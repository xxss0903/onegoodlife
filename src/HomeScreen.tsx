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
import * as url from 'node:url';
import {Colors} from './colors';
import AddNewLifeModal from './components/AddNewLifeModal.tsx';

const typeMapList = mainData.typeMapList;

export default class HomeScreen extends React.Component<any, any> {
  private floatingActionRef: any; // 悬浮按钮引用
  private isTypeEdit = false;
  private currentAddType = null; // 当前的添加类型
  private newlifeModalRef: any;
  private cloneType: any;

  constructor(props) {
    super(props);
    this.state = {
      currentBaby: {
        name: 'Jack',
      },
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
      logi('init baby ' + index, value);
      return (
        <View key={index} style={[{flex: 1}]}>
          <BabyLifeListView navigation={this.props.navigation} baby={value} />
        </View>
      );
    });
    return babyView;
  }

  _addType(type: any) {
    switch (type.id) {
      case commonTypeList[0].id:
        break;
    }
  }

  // 添加新的时间线
  _addNewLifeline(item: any) {
    logi('add life line ', item);
    this.cloneType = null;
    this.currentAddType = item;

    this.newlifeModalRef.addNewType(item);
  }

  _renderHomeView() {
    return (
      <View
        style={[
          commonStyles.flexColumn,
          {flex: 1, padding: Margin.horizontal},
        ]}>
        <TouchableOpacity
          onPress={() => {
            // 选择当前宝宝
          }}>
          <View
            style={[
              commonStyles.flexColumn,
              {marginVertical: Margin.vertical},
            ]}>
            <Text style={{fontSize: 20}}>Hello</Text>
            <Text style={{fontSize: 40, fontWeight: 'bold'}}>
              {this.state.currentBaby.name}
            </Text>
          </View>
        </TouchableOpacity>
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
            data={[
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
            ]}
            renderItem={({item, index}) => {
              console.log('avatar ', item.avatar);
              return (
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
                    <Avatar source={require('./assets/ic_about_us.png')} />
                  ) : (
                    <Avatar
                      source={{
                        uri: item.avatar,
                      }}
                    />
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
              );
            }}
          />
        </View>
        <View style={[commonStyles.flexColumn, {flex: 1}]}>
          <PagerView useNext={true} style={{flex: 1}} initialPage={0}>
            {this._renderBabyPages()}
          </PagerView>
        </View>
      </View>
    );
  }

  // 插入新的类型
  _insertNewlifeLineImpl(data: any) {
    EventBus.sendEvent(EventBus.REFRESH_DATA, data);
    this.props.navigation.goBack();
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          {this._renderHomeView()}
          {/*<PagerView style={{flex: 1}} initialPage={0}>*/}
          {/*  {this._renderBabyPages()}*/}
          {/*</PagerView>*/}
          <FloatingAction
            distanceToEdge={{vertical: 50, horizontal: 40}}
            buttonSize={60}
            color={Colors.primary}
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
