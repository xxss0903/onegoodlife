// 统计界面，整体的统计数据

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {Colors} from './colors';
import {commonStyles} from './commonStyle';
import BaseScreen from './BaseScreen.tsx';
import {Margin} from './space';
import DrinkMilkStaticsCard from './components/DrinkMilkStaticsCard.tsx';
import {getDataListOrderByTime} from './utils/dbService';
import {db} from './dataBase.ts';
import {
  StaticsType,
  commonActions,
  mainData,
  staticsTypeList,
} from './mainData.ts';
import {screenH} from './utils/until';
import EventBus from './utils/eventBus';
import {FloatingAction} from 'react-native-floating-action';
import MixMilkStaticsCard from './components/MixMilkStaticsCard.tsx';
import MotherMilkStaticsCard from './components/MotherMilkStaticsCard.tsx';
import WeightStaticsCard from './components/WeightStaticsCard.tsx';
import HeightStaticsCard from './components/HeightStaticsCard.tsx';

export default class StaticsScreen extends BaseScreen {
  private milkCardRef = null; // 喝奶统计卡片
  private growthCardRef = null; // 成长统计
  private cardRefList: any[] = []; // 统计卡片的引用列表

  constructor(props) {
    super(props);
    this.state = {
      staticsType: StaticsType.DAY,
      refreshing: false,
      staticsList: [], // 统计列表，统计比如喝奶次数，拉屎次数等，可以自行配置
      dataList: [], // 所有的数据
      dataType: StaticsType.DAY, // 统计类型，按天还是按周统计
      staticsCardList: [staticsTypeList[0], staticsTypeList[1]],
    };
  }

  componentDidMount() {
    this._getDataList();
    this._initListeners();
  }

  _initListeners() {
    let colorListener = EventBus.addEventListener(
      EventBus.REFRESH_GRADIENT_COLOR,
      () => {
        console.log('refresh statics screen color change');
        this.forceUpdate();
      },
    );
    console.log('statics listen color change ', colorListener);
  }

  async _getDataList() {
    this.setState({
      refreshing: true,
    });
    setTimeout(() => {
      this.setState({
        refreshing: false,
      });
    }, 1000);
    this.cardRefList.forEach(ref => {
      ref.refreshData();
    });
  }

  _changeStaticsDate(type: any) {
    this.setState({
      staticsType: type,
    });
  }

  _renderDateRange() {
    return (
      <View
        style={[
          commonStyles.flexRow,
          {
            backgroundColor: Colors.primary1,
            padding: Margin.horizontal,
            borderRadius: Margin.bigCorners,
          },
        ]}>
        <TouchableOpacity
          onPress={() => {
            this._changeStaticsDate(StaticsType.DAY);
          }}
          style={[styles.dateContainer, commonStyles.flexColumn]}>
          <Text style={[commonStyles.flexRow, {flex: 1}]}>天</Text>
          {this.state.staticsType === StaticsType.DAY ? (
            <View style={styles.activeTab} />
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this._changeStaticsDate(StaticsType.WEEK);
          }}
          style={[styles.dateContainer, commonStyles.flexColumn]}>
          <Text style={[commonStyles.flexRow, {flex: 1}]}>周</Text>
          {this.state.staticsType === StaticsType.WEEK ? (
            <View style={styles.activeTab} />
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this._changeStaticsDate(StaticsType.MONTH);
          }}
          style={[styles.dateContainer, commonStyles.flexColumn]}>
          <Text style={[commonStyles.flexRow, {flex: 1}]}>月</Text>
          {this.state.staticsType === StaticsType.MONTH ? (
            <View style={styles.activeTab} />
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this._changeStaticsDate(StaticsType.RANGE);
          }}
          style={[styles.dateContainer, commonStyles.flexColumn]}>
          <Text style={[commonStyles.flexRow, {flex: 1}]}>年</Text>
          {this.state.staticsType === StaticsType.RANGE ? (
            <View style={styles.activeTab} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }

  _renderHealthTip() {}

  _renderMixMilkStaticsCard() {
    return <MixMilkStaticsCard />;
  }

  // 统计卡片列表
  _renderStaticsList() {
    let staticsListView = mainData.staticsCardList.map((value, index) => {
      let view = null;
      switch (value.type) {
        case StaticsType.MIX:
          view = (
            <MixMilkStaticsCard
              key={`id_${value.id}`}
              ref={ref => this.cardRefList.push(ref)}
            />
          );
          break;
        case StaticsType.MOTHERMILK:
          view = (
            <MotherMilkStaticsCard
              key={`id_${value.id}`}
              ref={ref => this.cardRefList.push(ref)}
            />
          );
          break;
        case StaticsType.POWDER:
          view = (
            <DrinkMilkStaticsCard
              key={`id_${value.id}`}
              ref={ref => this.cardRefList.push(ref)}
            />
          );
          break;
        case StaticsType.WEIGHT:
          view = (
            <WeightStaticsCard
              key={`id_${value.id}`}
              ref={ref => this.cardRefList.push(ref)}
            />
          );
          break;
        case StaticsType.HEIGHT:
          view = (
            <HeightStaticsCard
              key={`id_${value.id}`}
              ref={ref => this.cardRefList.push(ref)}
            />
          );
          break;
      }
      if (view) {
        return (
          <View key={`id_${value.id}`} style={{marginBottom: Margin.vertical}}>
            {view}
          </View>
        );
      }
    });
    console.log('render card list', staticsListView);
    return <View style={[commonStyles.flexColumn]}>{staticsListView}</View>;
  }

  renderScreen() {
    return (
      <View style={[commonStyles.flexColumn, {flex: 1}]}>
        <ScrollView
          style={{
            flex: 1,
            height: screenH,
            display: 'flex',
            flexDirection: 'column',
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                // 刷新数据
                this._getDataList();
              }}
            />
          }>
          <View
            style={[
              commonStyles.flexColumn,
              {
                flex: 1,
                paddingTop: Margin.horizontal,
                paddingBottom: Margin.horizontal,
              },
            ]}>
            <View>{this._renderHealthTip()}</View>
            <View>{this._renderStaticsList()}</View>
          </View>
        </ScrollView>
        <FloatingAction
          distanceToEdge={{vertical: 50, horizontal: 40}}
          buttonSize={60}
          ref={ref => {
            this.floatingActionRef = ref;
          }}
          actions={staticsTypeList}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activeTab: {
    height: 2,
    backgroundColor: Colors.black333,
    width: 20,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
    height: 30,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  btnFloating: {
    position: 'absolute',
    bottom: 50,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.loginTouch,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#dddddd',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  photoLeftBtn: {
    alignItems: 'center',
    bottom: 0,
    left: 0,
    top: 0,
    justifyContent: 'center',
    position: 'absolute',
    width: 75,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    right: 75,
  },
  backRightBtnRight: {
    right: 0,
  },
  backTextWhite: {
    color: '#ffffff',
  },
});
