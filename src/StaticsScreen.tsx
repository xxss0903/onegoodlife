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
import DrinkMilkStaticsCard, {
  StaticsType,
} from './components/DrinkMilkStaticsCard.tsx';
import {getDataListOrderByTime} from './utils/dbService';
import {db} from './dataBase.ts';
import {mainData} from './mainData.ts';
import GrowthStaticsCard from './components/GrowthStaticsCard.tsx';
import LinearGradient from 'react-native-linear-gradient';
import {screenH} from './utils/until';
import EventBus from './utils/eventBus';

export default class StaticsScreen extends BaseScreen {
  private milkCardRef = null; // 喝奶统计卡片
  private growthCardRef = null; // 成长统计
  constructor(props) {
    super(props);
    this.state = {
      staticsType: StaticsType.DAY,
      refreshing: false,
      staticsList: [], // 统计列表，统计比如喝奶次数，拉屎次数等，可以自行配置
      dataList: [], // 所有的数据
      dataType: StaticsType.DAY, // 统计类型，按天还是按周统计
    };
  }

  componentDidMount() {
    this._getDataList();
    this._initListeners();
  }

  _initListeners() {
    EventBus.addEventListener(EventBus.REFRESH_GRADIENT_COLOR, () => {
      this.forceUpdate();
    });
  }

  _refreshData() {
    this.growthCardRef?.refreshData();
    this.milkCardRef?.refreshData();
  }

  async _getDataList() {
    console.log('get refresh data start 111');
    this.setState({
      refreshing: true,
    });
    getDataListOrderByTime(db.database, mainData.babyInfo.babyId)
      .then(dataList => {
        console.log('get data end', dataList);
        this.setState(
          {
            refreshing: false,
            dataList: dataList,
          },
          () => {
            this._refreshData();
          },
        );
      })
      .catch(err => {
        console.log('get refresh data err', err);
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

  _renderStaticsList() {
    return (
      <View style={[commonStyles.flexColumn]}>
        <View>
          <DrinkMilkStaticsCard
            ref={ref => (this.milkCardRef = ref)}
            dataList={this.state.dataList}
            dataType={this.state.dataType}
          />
        </View>
        <View style={[{marginTop: Margin.vertical}]}>
          <GrowthStaticsCard
            ref={ref => (this.growthCardRef = ref)}
            dataList={this.state.dataList}
            dataType={this.state.dataType}
          />
        </View>
      </View>
    );
  }

  renderScreen() {
    return (
        <View style={[commonStyles.flexColumn, {flex: 1}]}>
          {/*<View*/}
          {/*  style={{*/}
          {/*    position: 'absolute',*/}
          {/*    top: Margin.vertical,*/}
          {/*    left: Margin.horizontal,*/}
          {/*    zIndex: 999,*/}
          {/*    width: screenW - Margin.horizontal * 2,*/}
          {/*  }}>*/}
          {/*  {this._renderDateRange()}*/}
          {/*</View>*/}
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
                  console.log('on refresh control');
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
