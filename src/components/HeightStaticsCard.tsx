import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {commonStyles} from '../commonStyle';
import {Colors} from '../colors';
import {ChartWidth, screenW} from '../utils/until';
import {Margin} from '../space';
import moment from 'moment';
import {mainData, StaticsDate, StaticsType, TYPE_ID} from '../mainData.ts';
import {Menu, Pressable} from 'native-base';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import {getDataListByDateRange, getDataListByType} from '../utils/dbService.js';
import {db} from '../dataBase.ts';
import EventBus from '../utils/eventBus.js';

const styleObject = {
  transform: [{rotate: '60deg'}],
  paddingLeft: Margin.horizontal,
};

/**
 * 身高统计
 */
export default class HeightStaticsCard extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      maxMilkDose: 120,
      minMilkDose: 0,
      title: '身高',
      dateTitle: '',
      dateType: StaticsDate.DAY,
      // {value: 250, label: 'M'}
      staticsData: [], // 统计的数据
      leftTimeData: [],
      rightTimeData: [],
    };
  }

  componentDidMount() {
    this._getHeightByMonth();
  }

  async _getDataListFromDb() {
    const dataList = await getDataListByType(
      db.database,
      mainData.babyInfo.babyId,
      TYPE_ID.HEIGHT,
    );
    return dataList;
  }

  // 根据月份获取高度
  async _getHeightByMonth() {
    let heightList = await this._getDataListFromDb();
    let heightMap = new Map();
    heightList.forEach(value => {
      let month = moment(value.time).format('YYYY-MM');
      if (heightMap.has(month)) {
        if (value.height > heightMap.get(month)) {
          heightMap.set(month, value.height); // 将最大的高度作为当前月份最高的更新
        }
      } else {
        heightMap.set(month, value.height);
      }
    });
    // 高度的值
    console.log('height map ', heightMap);
  }

  refreshData() {
    this._getHeightByMonth();
  }

  // 母乳统计
  _renderLineChart() {
    return (
      <View style={[commonStyles.flexColumn]}>
        <LineChart
          stepValue={2}
          showVerticalLines
          height={200}
          labelsExtraHeight={40}
          maxValue={this.state.maxMilkDose - this.state.minMilkDose}
          yAxisOffset={this.state.minMilkDose}
          color={Colors.primary}
          width={ChartWidth}
          data={this.state.staticsData}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={[commonStyles.flexColumn, styles.cardContainer]}>
        <View style={[styles.titleContainer, commonStyles.flexRow]}>
          <View style={[commonStyles.flexRow, {alignItems: 'center'}]}>
            <Image
              style={styles.titleIcon}
              source={require('../assets/ic_powder.png')}
            />
            <Text
              style={[
                {
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginLeft: Margin.midHorizontal,
                },
              ]}>
              生长曲线-{this.state.title}（{this.state.dateTitle}）
            </Text>
          </View>
        </View>
        <View style={styles.dataContainer}>
          {this.state.leftTimeData?.length > 0 ||
          this.state.rightTimeData.length?.length > 0
            ? this._renderLineChart()
            : null}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  cardContainer: {
    height: 380,
    marginHorizontal: Margin.horizontal,
    backgroundColor: Colors.white,
    paddingHorizontal: Margin.horizontal,
    paddingTop: Margin.horizontal,
    borderRadius: Margin.bigCorners,
  },
  titleContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleIcon: {
    width: 20,
    height: 20,
  },
  dataContainer: {},
});
