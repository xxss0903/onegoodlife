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
import {
  getDataListByDateRange,
  getDataListByType,
  getDataListOrderByTime,
} from '../utils/dbService.js';
import {db} from '../dataBase.ts';
import EventBus from '../utils/eventBus.js';

const styleObject = {
  transform: [{rotate: '60deg'}],
  paddingLeft: Margin.horizontal,
};

/**
 * 体重统计
 */
export default class WeightStaticsCard extends Component<any, any> {
  private chartStyle = {
    marginVertical: Margin.vertical,
    borderRadius: 16,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      maxMilkDose: 120,
      minMilkDose: 0,
      title: '奶粉',
      dateTitle: '',
      dateType: StaticsDate.DAY,
      // {value: 250, label: 'M'}
      staticsData: [{value: 250, label: 'M'}],
    };
  }

  componentDidMount() {
    this._getStaticsData();
  }

  // 体重统计数据
  async _getStaticsData() {
    let milkData = await getDataListByType(
      db.database,
      mainData.babyInfo.babyId,
      TYPE_ID.WEIGHT,
    );
    console.log('statics weight data', milkData);
    let data: any[] = [];
    let maxValue = -1;
    let minValue = -1;
    milkData.forEach((value: any) => {
      let timeLabel = moment(value.time).format('MM-DD');
      let weight = parseFloat(value.weight);
      let obj = {
        value: weight,
        label: timeLabel,
        labelTextStyle: styleObject,
      };
      data.unshift(obj);
      if (maxValue < 0) {
        maxValue = weight;
      }
      if (minValue < 0) {
        minValue = weight;
      }
      if (weight > maxValue) {
        maxValue = weight;
      }
      if (minValue > weight) {
        minValue = weight;
      }
    });

    minValue = minValue - 1 < 0 ? 0 : minValue - 1;
    maxValue += 1;
    console.log('labels and data', minValue, maxValue);
    this.setState({
      minMilkDose: minValue,
      maxMilkDose: maxValue,
      staticsData: data,
    });
  }

  refreshData() {
    this._getStaticsData();
  }

  // 母乳统计
  _renderLineChart() {
    return (
      <LineChart
        color={Colors.primary}
        showVerticalLines
        height={200}
        stepValue={1}
        maxValue={this.state.maxMilkDose - this.state.minMilkDose}
        yAxisOffset={this.state.minMilkDose}
        labelsExtraHeight={40}
        width={ChartWidth}
        data={this.state.staticsData}
      />
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
              体重
            </Text>
          </View>
        </View>
        <View style={styles.dataContainer}>
          {this.state.staticsData?.length > 0 ? this._renderLineChart() : null}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  cardContainer: {
    height: 360,
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
