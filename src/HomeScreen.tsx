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
import {
  commonActions,
  commonTypeList,
  GradientColors,
  mainData,
} from './mainData';
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
import {screenH, screenW} from './utils/until';
import LinearGradient from 'react-native-linear-gradient';

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
    mainData.refreshBabies = false;
    this._initListeners();
    this.setState({
      currentBaby: mainData.babies[0],
      currentBabyIndex: 0,
    });
  }

  _refreshData() {
    try {
      logi('force update refresh home data');
      this.forceUpdate(() => {});
    } catch (e) {
      logi('refresh data err', e);
    }
  }

  _initListeners() {
    this.props.navigation.addListener('focus', () => {
      if (mainData.refreshBabies) {
        mainData.refreshBabies = false;
        if (mainData.babies && mainData.babies.length > 0) {
          mainData.babyInfo = mainData.babies[0];
          this.setState(
            {
              currentBaby: mainData.babies[0],
              currentBabyIndex: 0,
            },
            () => {
              let newPageRefs = this.babyPageRefs.filter(value => {
                if (value) {
                  return value;
                }
              });
              this.babyPageRefs = newPageRefs;
              this.pagerRef && this.pagerRef.setPage(0);
              this.babyPageRefs.forEach(value => {
                value && value.refreshData();
              });
            },
          );
        } else {
          logi('render empty babies');
          this.forceUpdate();
        }
      }
    });
    // 在全部页面插入之后，在这里使用本地插入和刷新当前宝宝的页面
    EventBus.addEventListener(EventBus.INSERT_NEW_LIFETIME, data => {
      this._insertNewlifeLineImpl(data);
    });
  }

  _editNewLifeline(item: any) {
    let type = commonTypeList.filter(value => item.typeId === value.id)[0];
    if (type) {
      this.cloneType = JSON.parse(JSON.stringify(item));
      this.currentAddType = type;
      this.newlifeModalRef.editType(this.currentAddType, this.cloneType);
    }
  }

  _renderBabyPages() {
    let babyView = mainData.babies.map((value:any, index:any) => {
      return (
        <View key={index} style={[{flex: 1}]}>
          <BabyLifeListView
            ref={ref => (this.babyPageRefs[index] = ref)}
            navigation={this.props.navigation}
            baby={value}
            onItemClick={item => {
              logi('detail item', item);
              // 直接显示弹窗的内容吧
              this._editNewLifeline(item);

              // this.props.navigation.navigate('NewLifeDetailScreen', {
              //   data: item,
              // });
            }}
          />
        </View>
      );
    });
    return babyView;
  }

  // 添加新的时间线
  _addNewLifeline(item: any) {
    console.log('click new life item', item);
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
    let diffDay = moment().diff(moment(birthDay), 'days');
    return diffDay + 1;
  }

  _renderBabyInfo() {
    if (this.state.currentBaby) {
      return (
        <View
          style={[commonStyles.flexColumn, {marginVertical: Margin.vertical}]}>
          <Text style={{fontSize: 20}}>{mainData.userInfo.role}你好呀</Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              marginTop: Margin.smalHorizontal,
            }}>
            我是{this.state.currentBaby.name}，已经
            {this._getBirthDay(this.state.currentBaby.birthDay)}天啦
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={[commonStyles.flexColumn, {marginVertical: Margin.vertical}]}>
          <Text style={{fontSize: 18}}>{mainData.userInfo.role}你好呀</Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              marginTop: Margin.smalHorizontal,
            }}>
            请先添加宝宝
          </Text>
        </View>
      );
    }
  }

  _renderHomeView() {
    let babiesWidth = mainData.babies.length * 80;
    if (babiesWidth > screenW - 120) {
      babiesWidth = screenW - 120;
    }
    return (
      <View
        style={[
          commonStyles.flexColumn,
          {flex: 1},
        ]}>
        <View style={{padding: Margin.horizontal}}>{this._renderBabyInfo()}</View>
        <View
          style={[
            commonStyles.flexRow,
            {
              height: 100, paddingHorizontal: Margin.horizontal
            },
          ]}>
          <View style={{}}>
            <FlatList
              horizontal={true}
              style={{height: 100, width: babiesWidth}}
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
          {this._renderAddBabyItem()}
        </View>
        <PagerView
            scrollEnabled={false}
          ref={ref => (this.pagerRef = ref)}
          orientation={'horizontal'}
          style={{flex: 1}}
          initialPage={0}>
          {this._renderBabyPages()}
        </PagerView>
      </View>
    );
  }

  _changeBaby(index: Number) {
    console.log('change baby index ' + index);
    EventBus.sendEvent(EventBus.REFRESH_GRADIENT_COLOR);
    this.currentBabyPageRef = this.babyPageRefs[index];
    if (index === 0) {
      mainData.gradientColor = GradientColors.boyColor1;
    } else {
      mainData.gradientColor = GradientColors.boyColor2;
    }
    mainData.babyInfo = mainData.babies[index];
    this.setState({
      currentBaby: mainData.babies[index],
      currentBabyIndex: index,
    });
    // 更改寶寶信息，切換pagerview的列表
    this.pagerRef && this.pagerRef.setPage(index);
  }

  _renderAddBabyItem() {
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

  _renderEmptyAddView() {
    return (
      <View style={[commonStyles.flexColumn, commonStyles.center, {flex: 1}]}>
        <View style={commonStyles.center}>
          <Text style={[{fontSize: 24, fontWeight: 'bold'}]}>
            还没有添加宝宝哦~
          </Text>
          <Text style={[{fontSize: 24, fontWeight: 'bold'}]}>
            请点击添加您的小宝宝
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('BabyInfoScreen');
          }}
          style={[
            {
              marginTop: Margin.vertical,
              backgroundColor: Colors.primary,
              paddingHorizontal: Margin.horizontal,
              paddingVertical: Margin.vertical,
              borderRadius: Margin.bigCorners,
            },
          ]}>
          <Text style={[{fontSize: 16, color: Colors.white}]}>添加宝宝</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderScreen() {
    return (
        <View>
          <View style={styles.container}>
            {mainData.babies && mainData.babies.length > 0
              ? this._renderHomeView()
              : this._renderEmptyAddView()}
            {mainData.babies.length > 0 ? (
              <FloatingAction
                distanceToEdge={{vertical: 50, horizontal: 40}}
                buttonSize={60}
                ref={ref => {
                  this.floatingActionRef = ref;
                }}
                actions={[...mainData.commonActions, commonActions.all]}
                onPressItem={typeName => {
                  console.log('click item', typeName);
                  if (typeName === '全部') {
                    this.props.navigation.navigate('AllTypeScreen');
                  } else {
                    this.isTypeEdit = false;
                    let items = mainData.commonActions.filter(
                      item => item.name === typeName,
                    );
                    items && items.length > 0 && this._addNewLifeline(items[0]);
                  }
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
