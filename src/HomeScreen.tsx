// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知
// 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加

import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {logi} from './utils/logutil';
import PagerView from 'react-native-pager-view';
import {commonActions, commonTypeList, mainData} from './mainData';
import EventBus from './utils/eventBus';
import BabyLifeListView from './components/BabyLifeListView';
import {FloatingAction} from 'react-native-floating-action';
import {commonStyles} from './commonStyle';
import {Avatar} from 'native-base';
import {Margin} from './space';
import AddNewLifeModal from './components/AddNewLifeModal.tsx';
import {DeviceStorage} from './utils/deviceStorage';
import {insertData} from './utils/dbService';
import App from '../App.tsx';
import {encodeFuc} from './utils/base64';

export default class HomeScreen extends React.Component<any, any> {
  private floatingActionRef: any; // 悬浮按钮引用
  private isTypeEdit = false;
  private currentAddType = null; // 当前的添加类型
  private newlifeModalRef: any;
  private cloneType: any;
  private babyPageRefs = []; // 宝宝的分页列表
  private currentBabyPageRef = null; // 当前宝宝分页

  constructor(props) {
    super(props);
    this.state = {
      currentBaby: {
        name: 'Jack',
      },
      currentBabyIndex: 0,
      babyList: [
        {
          name: 'Jack',
          avatar:
            'https://hbimg.huabanimg.com/5bc47fcdeb5023b5473735b3489e146d362512a422ed2-3smjNx_fw658',
        },
        {
          name: 'Elitha',
          avatar:
            'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        },
      ],
    };
  }

  componentDidMount() {
    this._initListeners();
  }

  _initListeners() {
    EventBus.addEventListener(EventBus.REFRESH_BABY_LIST, () => {
      logi('refresh baby list');
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    logi('remove all listeners');
    EventBus.clearAllListeners();
  }

  _renderBabyPages() {
    let babyView = mainData.babies.map((value, index) => {
      logi('init baby page ' + index, value);
      return (
        <View key={index} style={[{flex: 1}]}>
          <BabyLifeListView
            ref={ref => (this.babyPageRefs[index] = ref)}
            navigation={this.props.navigation}
            baby={value}
          />
        </View>
      );
    });
    return babyView;
  }

  // 添加新的时间线
  _addNewLifeline(item: any) {
    logi('add life line ', item);
    if (item.name === '全部') {
      // 进入全部
      this.props.navigation.navigate('AllTypeScreen');
    } else {
      this.cloneType = null;
      this.currentAddType = item;

      this.newlifeModalRef.addNewType(item);
    }
  }

  _renderHomeView() {
    return (
      <View
        style={[
          commonStyles.flexColumn,
          {flex: 1, padding: Margin.horizontal},
        ]}>
        <View>
          <View
            style={[
              commonStyles.flexColumn,
              {marginVertical: Margin.vertical},
            ]}>
            <Text style={{fontSize: 18}}>媽媽你好呀</Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                marginTop: Margin.smalHorizontal,
              }}>
              我是{this.state.currentBaby.name}，今天xx天啦
            </Text>
          </View>
        </View>
        <View
          style={[
            commonStyles.flexColumn,
            {
              height: 100,
              justifyContent: 'center',
            },
          ]}>
          <FlatList
            horizontal={true}
            style={{height: 100, flex: 1}}
            data={mainData.babies}
            renderItem={({item, index}) => {
              console.log('avatar ', item.avatar);
              return this._renderBabyItem(item, index);
            }}
          />
        </View>
        <View style={[commonStyles.flexColumn, {flex: 1}]}>
          <PagerView
            scrollEnabled={false}
            ref={ref => (this.pagerRef = ref)}
            useNext={true}
            style={{flex: 1}}
            initialPage={0}>
            {this._renderBabyPages()}
          </PagerView>
        </View>
      </View>
    );
  }

  _changeBaby(index: Number) {
    this.currentBabyPageRef = this.babyPageRefs[index];
    this.setState({
      currentBaby: mainData.babies[index],
      currentBabyIndex: index,
    });
    mainData.babyInfo = mainData.babies[index];
    // 更改寶寶信息，切換pagerview的列表
    this.pagerRef && this.pagerRef.setPage(index);
  }

  private _renderBabyItem(item: any, index: Number) {
    return (
      <TouchableOpacity
        onPress={() => {
          this._changeBaby(index);
        }}>
        <View
          style={[
            commonStyles.flexColumn,
            commonStyles.center,
            {
              marginHorizontal: Margin.midHorizontal,
              marginVertical: Margin.smalHorizontal,
            },
          ]}>
          {!(item && item.avatar) ? (
            <Avatar source={require('./assets/ic_about_us.png')}>
              {this.state.currentBabyIndex === index ? (
                <Avatar.Badge bg="green.500" />
              ) : null}
            </Avatar>
          ) : (
            <Avatar
              size={'lg'}
              source={{
                uri: item.avatar,
              }}>
              {this.state.currentBabyIndex === index ? (
                <Avatar.Badge bg="green.500" />
              ) : null}
            </Avatar>
          )}
          <Text
            style={{
              fontSize: 16,
              marginTop: Margin.smalHorizontal,
              fontWeight: '400',
            }}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // 插入数据到数据库
  async _insertItemToDB(data, babyId) {
    await insertData(App.db, data, encodeFuc(JSON.stringify(data)), babyId);
  }

  // 重新排序记录，根据时间插入
  _insertItemByResortTime(dataList, newData) {
    if (!newData) {
      return dataList;
    }
    if (dataList && dataList.length > 0) {
      if (dataList[0].time < newData.time) {
        dataList.unshift(newData);
      } else {
        for (let i = 0; i < dataList.length; i++) {
          let value = dataList[i];
          if (value.time < newData.time) {
            dataList.splice(i, 0, newData);
            return dataList;
          }
        }
        dataList.push(newData);
      }
    } else {
      dataList = [newData];
    }
    return dataList;
  }

  // 刷新统计数据图标
  _refreshStaticsCharts() {
    this.currentBabyPageRef?.refreshData();
  }

  _refreshLocalData() {
    // DeviceStorage.save(DeviceStorage.KEY_LOCAL_DATA, this.state.dataList).then(
    //   data => {},
    // );
  }

  // 插入新的类型
  _insertNewlifeLineImpl(data) {
    if (!this.currentBabyPageRef) {
      this.currentBabyPageRef = this.babyPageRefs[this.state.currentBabyIndex];
    }
    logi('homescreen insert newdata', this.currentBabyPageRef);
    // this._insertItemToDB(data, mainData.babyInfo.babyId);
    // // 插入到最新的数据，这里还是根据时间进行设置
    // let dataList = this._insertItemByResortTime(this.state.dataList, data);
    this.currentBabyPageRef?.insertNewData(data);
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          {this._renderHomeView()}
          <FloatingAction
            distanceToEdge={{vertical: 50, horizontal: 40}}
            buttonSize={60}
            ref={ref => {
              this.floatingActionRef = ref;
            }}
            actions={commonActions}
            onPressItem={typeName => {
              this.isTypeEdit = false;
              let items = commonActions.filter(item => item.name === typeName);
              items && items.length > 0 && this._addNewLifeline(items[0]);
            }}
          />
        </View>
        <AddNewLifeModal
          addNewLifeline={(item: any) => {
            this._insertNewlifeLineImpl(item);
          }}
          baby={mainData.babyInfo} // current babyinfo
          currentAddType={this.currentAddType}
          ref={ref => (this.newlifeModalRef = ref)}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
});
