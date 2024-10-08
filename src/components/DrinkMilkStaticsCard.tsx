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
  getDataListOrderByTime,
} from '../utils/dbService.js';
import {db} from '../dataBase.ts';
import EventBus from '../utils/eventBus.js';

const styleObject = {
  transform: [{rotate: '60deg'}],
  paddingLeft: Margin.horizontal,
};

/**
 * 奶粉统计
 */
export default class DrinkMilkStaticsCard extends Component<any, any> {
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
    this._getLast24StaticsData();
  }

  // 获取上个月数据，就是每天的量然后获取到整个月
  async _getLastMonthStaticsData() {
    let lastMonthMoment = moment().subtract(30, 'day').valueOf();
    let milkData = await getDataListByDateRange(
      db.database,
      mainData.babyInfo.babyId,
      TYPE_ID.MILK,
      lastMonthMoment,
      moment().valueOf(),
    );
    console.log('statics week data', milkData);

    // 使用map将日期进行统计计算相加
    let doseMilkMap = new Map();
    for (let i = 0; i < milkData.length; i++) {
      let value = milkData[i];
      let dateStr = moment(value.time).format('MM-DD');
      if (doseMilkMap.has(dateStr)) {
        let totalDose = doseMilkMap.get(dateStr) + value.dose;
        doseMilkMap.set(dateStr, totalDose);
      } else {
        doseMilkMap.set(dateStr, value.dose);
      }
    }

    console.log('value map ', doseMilkMap);

    let data: any[] = [];
    let maxValue = -1;
    let minValue = -1;
    for (const key of doseMilkMap.keys()) {
      let value = doseMilkMap.get(key);
      console.log('key in map', key, value);
      let obj = {value, label: key, labelTextStyle: styleObject};
      data.unshift(obj);
      if (maxValue < 0) {
        maxValue = value;
      }
      if (minValue < 0) {
        minValue = value;
      }
      if (value > maxValue) {
        maxValue = value;
      }
      if (minValue > value) {
        minValue = value;
      }
    }

    minValue = minValue - 20 < 0 ? 0 : minValue - 20;
    maxValue += 20;
    console.log('max min value', minValue, maxValue);
    this.setState({
      minMilkDose: minValue,
      maxMilkDose: maxValue,
      staticsData: data,
      dateTitle: '最近一月',
    });
  }

  // 按天获取统计数量
  async _getDayStaticsData() {
    let lastMonthMoment = moment().subtract(7, 'day').valueOf();
    let milkData = await getDataListByDateRange(
      db.database,
      mainData.babyInfo.babyId,
      TYPE_ID.MILK,
      lastMonthMoment,
      moment().valueOf(),
    );
    console.log('statics week data', milkData);

    // 使用map将日期进行统计计算相加
    let doseMilkMap = new Map();
    for (let i = 0; i < milkData.length; i++) {
      let value = milkData[i];
      let dateStr = moment(value.time).format('MM-DD');
      if (doseMilkMap.has(dateStr)) {
        let totalDose = doseMilkMap.get(dateStr) + value.dose;
        doseMilkMap.set(dateStr, totalDose);
      } else {
        doseMilkMap.set(dateStr, value.dose);
      }
    }

    console.log('value map ', doseMilkMap);

    let data: any[] = [];
    let maxValue = -1;
    let minValue = -1;
    for (const key of doseMilkMap.keys()) {
      let value = doseMilkMap.get(key);
      console.log('key in map', key, value);
      let obj = {value, label: key, labelTextStyle: styleObject};
      data.unshift(obj);
      if (maxValue < 0) {
        maxValue = value;
      }
      if (minValue < 0) {
        minValue = value;
      }
      if (value > maxValue) {
        maxValue = value;
      }
      if (minValue > value) {
        minValue = value;
      }
    }

    minValue = minValue - 20 < 0 ? 0 : minValue - 20;
    maxValue += 20;
    console.log('max min value', minValue, maxValue);
    this.setState({
      minMilkDose: minValue,
      maxMilkDose: maxValue,
      staticsData: data,
      dateTitle: '最近一周',
    });
  }

  async _getDataListFromDb(from, to) {
    const milkData = await getDataListByDateRange(
      db.database,
      mainData.babyInfo.babyId,
      TYPE_ID.MILK,
      from,
      to,
    );
    return milkData.filter(value => !value.isMotherMilk);
  }

  async _getLast24StaticsData() {
    let last24Moment = moment().subtract(1, 'day').valueOf();
    let milkData = await this._getDataListFromDb(
      last24Moment,
      moment().valueOf(),
    );
    console.log('statics today data', milkData);
    let data: any[] = [];
    let maxValue = -1;
    let minValue = -1;
    milkData.forEach((value: any) => {
      let timeLabel = moment(value.time).format('HH:mm');
      let obj = {
        value: value.dose,
        label: timeLabel,
        labelTextStyle: styleObject,
      };
      data.unshift(obj);
      if (maxValue < 0) {
        maxValue = value.dose;
      }
      if (minValue < 0) {
        minValue = value.dose;
      }
      if (value.dose > maxValue) {
        maxValue = value.dose;
      }
      if (minValue > value.dose) {
        minValue = value.dose;
      }
    });

    minValue = minValue - 20 < 0 ? 0 : minValue - 20;
    maxValue += 20;
    console.log('labels and data', minValue, maxValue);
    this.setState({
      minMilkDose: minValue,
      maxMilkDose: maxValue,
      staticsData: data,
      dateTitle: '24小时内',
    });
  }

  refreshData() {
    this.getDataListByDate(this.state.dateType);
  }

  private getDataListByDate(dateType: any) {
    switch (dateType) {
      case StaticsDate.DAY:
        this._getLast24StaticsData();
        break;
      case StaticsDate.WEEK:
        this._getDayStaticsData();
        break;
      case StaticsDate.MONTH:
        this._getLastMonthStaticsData();
        break;
      case StaticsDate.RANGE:
        break;
    }
  }

  // 母乳统计
  _renderLineChart() {
    return (
      <LineChart
        color={Colors.primary}
        showVerticalLines
        height={200}
        stepValue={10}
        labelsExtraHeight={40}
        maxValue={this.state.maxMilkDose - this.state.minMilkDose}
        yAxisOffset={this.state.minMilkDose}
        width={ChartWidth}
        data={this.state.staticsData}
      />
    );
  }

  // 更改统计类型
  _changeStaticsType(type: string) {
    this.setState({
      _dateType: type,
      title: '',
    });
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
              喝奶量-{this.state.title}（{this.state.dateTitle}）
            </Text>
          </View>
          <Menu
            w={120}
            style={{}}
            trigger={triggerProps => {
              return (
                <Pressable
                  style={{
                    padding: Margin.midHorizontal,
                    backgroundColor: Colors.loginTouch,
                    borderRadius: Margin.bigCorners,
                  }}
                  accessibilityLabel="More options menu"
                  {...triggerProps}>
                  <Image
                    style={styles.titleIcon}
                    source={require('../assets/ic_edit_white.png')}
                  />
                </Pressable>
              );
            }}>
            <Menu.Item
              onPress={() => {
                this.setState({
                  dateType: StaticsDate.DAY,
                });
                this.getDataListByDate(StaticsDate.DAY);
              }}>
              天
            </Menu.Item>
            <Menu.Item
              onPress={() => {
                this.setState({
                  dateType: StaticsDate.WEEK,
                });
                this.getDataListByDate(StaticsDate.WEEK);
              }}>
              周
            </Menu.Item>
            <Menu.Item
              onPress={() => {
                this.setState({
                  dateType: StaticsDate.MONTH,
                });
                this.getDataListByDate(StaticsDate.MONTH);
              }}>
              月
            </Menu.Item>
            <Menu.Item
              style={{}}
              onPress={() => {
                // 移除当前统计卡片
                EventBus.sendEvent(EventBus.REMOVE_CARD, StaticsType.POWDER);
              }}>
              移除
            </Menu.Item>
          </Menu>
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
