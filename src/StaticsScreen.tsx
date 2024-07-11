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
import LifeTypeStaticsCard, {
  StaticsType,
} from './components/LifeTypeStaticsCard.tsx';
import {getDataListOrderByTime} from './utils/dbService';
import {db} from './dataBase.ts';
import {mainData} from './mainData.ts';

export default class StaticsScreen extends BaseScreen {
  private milkCardRef = null; // 喝奶统计卡片
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      staticsList: [], // 统计列表，统计比如喝奶次数，拉屎次数等，可以自行配置
      dataList: [], // 所有的数据
      dataType: StaticsType.DAY, // 统计类型，按天还是按周统计
    };
  }

  componentDidMount() {
    this._getDataList();
  }

  _refreshData() {
    this.milkCardRef?.refreshData();
  }

  async _getDataList() {
    console.log('get refresh data start 111');
    this.setState({
      refreshing: true,
    });
    getDataListOrderByTime(db.database, mainData.babyInfo.babyId)
      .then(dataList => {
        console.log('get data end');
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
            borderRadius: Margin.horizontal,
            margin: Margin.horizontal,
          },
        ]}>
        <TouchableOpacity
          onPress={() => {
            this._changeStaticsDate(StaticsType.DAY);
          }}
          style={styles.dateContainer}>
          <Text>今天</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateContainer}>
          <Text>本周</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateContainer}>
          <Text>本月</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateContainer}>
          <Text>选择日期</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderHealthTip() {}

  _renderStaticsList() {
    return (
      <View>
        <LifeTypeStaticsCard
          ref={ref => (this.milkCardRef = ref)}
          dataList={this.state.dataList}
          dataType={this.state.dataType}
        />
      </View>
    );
  }

  renderScreen() {
    return (
      <ScrollView
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
            {flex: 1, backgroundColor: Colors.grayEe},
          ]}>
          <View>{this._renderDateRange()}</View>
          <View>{this._renderHealthTip()}</View>
          <View>{this._renderStaticsList()}</View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  dateContainer: {
    flex: 1,
    display: 'flex',
    padding: Margin.midHorizontal,
    justifyContent: 'center',
    alignItems: 'center',
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
