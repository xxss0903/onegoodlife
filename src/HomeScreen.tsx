// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知
// 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加

import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import {commonActions, commonTypeList, mainData} from './mainData';
import EventBus from './utils/eventBus';
import BabyLifeListView from './components/BabyLifeListView';
import {FloatingAction} from 'react-native-floating-action';
import {commonStyles} from './commonStyle';
import {Avatar, Center, HStack} from 'native-base';
import {Margin} from './space';
import AddNewLifeModal from './components/AddNewLifeModal.tsx';
import moment from 'moment';
import BaseScreen from './BaseScreen.tsx';
import {Colors} from './colors';
import {logi} from './utils/logutil';

export default class HomeScreen extends BaseScreen {
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
      currentBaby: {},
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
    this.setState({
      currentBaby: mainData.babies[0],
      currentBabyIndex: 0,
    });
  }

  _initListeners() {
    // 更新了宝宝信息之后刷新列表
    EventBus.addEventListener(EventBus.REFRESH_BABY_LIST, () => {
      this.forceUpdate();
    });
    // 在全部页面插入之后，在这里使用本地插入和刷新当前宝宝的页面
    EventBus.addEventListener(EventBus.INSERT_NEW_LIFETIME, data => {
      this._insertNewlifeLineImpl(data);
    });
  }

  componentWillUnmount() {
    EventBus.clearAllListeners();
  }

  _renderBabyPages() {
    let babyView = mainData.babies.map((value, index) => {
      logi('render pagerview ', value);
      if (value.itemType !== 1) {
        return (
          <View key={index} style={[{flex: 1}]}>
            <BabyLifeListView
              ref={ref => (this.babyPageRefs[index] = ref)}
              navigation={this.props.navigation}
              baby={value}
            />
          </View>
        );
      } else {
        return null;
      }
    });
    return babyView;
  }

  // 添加新的时间线
  _addNewLifeline(item: any) {
    if (item.name === '全部') {
      // 进入全部
      this.props.navigation.navigate('AllTypeScreen');
    } else {
      this.cloneType = null;
      this.currentAddType = item;

      this.newlifeModalRef.addNewType(item);
    }
  }

  /**
   * 获取出生天数
   * @param birthDay
   */
  _getBirthDay(birthDay) {
    let diffDay = moment().diff(moment(birthDay), 'day');
    return diffDay + 1;
  }

  _renderBabyInfo() {
    if (this.state.currentBaby) {
      return (
        <View
          style={[commonStyles.flexColumn, {marginVertical: Margin.vertical}]}>
          <Text style={{fontSize: 18}}>妈妈你好呀</Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              marginTop: Margin.smalHorizontal,
            }}>
            我是{this.state.currentBaby.name}，今天
            {this._getBirthDay(this.state.currentBaby.birthDay)}天啦
          </Text>
        </View>
      );
    } else {
      return <View></View>;
    }
  }

  _renderHomeView() {
    return (
      <View
        style={[
          commonStyles.flexColumn,
          {flex: 1, padding: Margin.horizontal},
        ]}>
        <View>{this._renderBabyInfo()}</View>
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
              if (item.type === 'ADD') {
                return this._renderAddBabyItem(item, index);
              } else {
                return this._renderBabyItem(item, index);
              }
            }}
          />
        </View>
        <PagerView
          scrollEnabled={false}
          ref={ref => (this.pagerRef = ref)}
          useNext={true}
          style={{flex: 1}}
          initialPage={0}>
          {this._renderBabyPages()}
        </PagerView>
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

  _renderAddBabyItem(item, index) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('BabyInfoScreen');
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
          <Image
            style={{width: 65, height: 65}}
            source={require('./assets/ic_add_baby.png')}
          />
          <Text
            style={{
              fontSize: 16,
              marginTop: Margin.smalHorizontal,
              fontWeight: '400',
            }}>
            添加宝宝
          </Text>
        </View>
      </TouchableOpacity>
    );
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
              marginLeft: Margin.midHorizontal,
              marginVertical: Margin.smalHorizontal,
            },
          ]}>
          {!(item && item.avatar) ? (
            <Avatar
              size={'lg'}
              bg={'transparent'}
              source={require('./assets/ic_baby.png')}>
              {this.state.currentBabyIndex === index ? (
                <Avatar.Badge bg="green.500" />
              ) : null}
            </Avatar>
          ) : (
            <Avatar
              size={'lg'}
              bg={'transparent'}
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

  // 插入新的类型
  _insertNewlifeLineImpl(data) {
    if (!this.currentBabyPageRef) {
      this.currentBabyPageRef = this.babyPageRefs[this.state.currentBabyIndex];
    }
    this.currentBabyPageRef?.insertNewData(data);
  }

  renderScreen() {
    return (
      <View>
        <View style={styles.container}>
          {this._renderHomeView()}
          {mainData.babies.length > 1 ? (
            <FloatingAction
              distanceToEdge={{vertical: 50, horizontal: 40}}
              buttonSize={60}
              ref={ref => {
                this.floatingActionRef = ref;
              }}
              actions={commonActions}
              onPressItem={typeName => {
                this.isTypeEdit = false;
                let items = commonActions.filter(
                  item => item.name === typeName,
                );
                items && items.length > 0 && this._addNewLifeline(items[0]);
              }}
            />
          ) : null}
        </View>
        <AddNewLifeModal
          addNewLifeline={(item: any) => {
            this._insertNewlifeLineImpl(item);
          }}
          baby={mainData.babyInfo} // current babyinfo
          currentAddType={this.currentAddType}
          ref={ref => (this.newlifeModalRef = ref)}
        />
      </View>
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
