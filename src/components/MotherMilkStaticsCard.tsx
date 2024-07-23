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
import {getDataListByDateRange} from '../utils/dbService.js';
import {db} from '../dataBase.ts';
import EventBus from '../utils/eventBus.js';

const styleObject = {
  transform: [{rotate: '60deg'}],
  paddingLeft: Margin.horizontal,
};

/**
 * 奶粉统计
 */
export default class MotherMilkStaticsCard extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      maxMilkDose: 120,
      minMilkDose: 0,
      title: '母乳',
      dateType: StaticsDate.DAY,
      // {value: 250, label: 'M'}
      staticsData: [{value: 250, label: 'M'}],
      leftTimeData: [],
      rightTimeData: [],
    };
  }

  componentDidMount() {
    // this._getLast24StaticsData();
    this._getLast24StaticsData();
  }

  // 获取上个月数据，就是每天的量然后获取到整个月
  async _getLastMonthStaticsData() {
    let last24Moment = moment().subtract(30, 'day').valueOf();
    let milkData = await this._getDataListFromDb(
      last24Moment,
      moment().valueOf(),
    );
    console.log('mothermilk today data', milkData);
    let data: any[] = [];
    let maxValue = -1;
    let minValue = -1;

    let leftTimeData: any[] = [];
    let rightTimeData: any[] = [];
    let milkLeftDataMap = new Map();
    let milkRightDataMap = new Map();
    milkData.forEach((value: any) => {
      let timeLabel = moment(value.time).format('MM-DD');
      if (milkLeftDataMap.has(timeLabel)) {
        let tempData = value.leftTime + milkLeftDataMap.get(timeLabel);
        milkLeftDataMap.set(timeLabel, tempData);
      } else {
        milkLeftDataMap.set(timeLabel, value.leftTime);
      }
      if (milkRightDataMap.has(timeLabel)) {
        let tempData = value.rightTime + milkRightDataMap.get(timeLabel);
        milkRightDataMap.set(timeLabel, tempData);
      } else {
        milkRightDataMap.set(timeLabel, value.rightTime);
      }
    });

    for (const key of milkLeftDataMap.keys()) {
      let tempLeftTime = milkLeftDataMap.get(key);
      if (maxValue < 0) {
        maxValue = tempLeftTime;
      }
      if (minValue < 0) {
        minValue = tempLeftTime;
      }
      if (maxValue < tempLeftTime) {
        maxValue = tempLeftTime;
      }
      if (minValue > tempLeftTime) {
        minValue = tempLeftTime;
      }

      let leftTimeObj = {
        value: tempLeftTime,
        label: key,
        labelTextStyle: styleObject,
      };
      leftTimeData.push(leftTimeObj);
    }
    for (const key of milkRightDataMap.keys()) {
      let tempRightTime = milkRightDataMap.get(key);
      if (maxValue < 0) {
        maxValue = tempRightTime;
      }
      if (minValue < 0) {
        minValue = tempRightTime;
      }
      if (maxValue < tempRightTime) {
        maxValue = tempRightTime;
      }
      if (minValue > tempRightTime) {
        minValue = tempRightTime;
      }

      let rightTimeObj = {
        value: tempRightTime,
        label: key,
        labelTextStyle: styleObject,
      };
      rightTimeData.push(rightTimeObj);
    }

    minValue = minValue - 5 < 0 ? 0 : minValue - 5;
    maxValue += 5;
    console.log('labels and data left', leftTimeData);
    console.log('labels and data right', rightTimeData);
    this.setState({
      minMilkDose: minValue,
      maxMilkDose: maxValue,
      staticsData: data,
      leftTimeData,
      rightTimeData,
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
    return milkData.filter(value => value.isMotherMilk);
  }

  // 按天获取统计数量
  async _getDayStaticsData() {
    let last24Moment = moment().subtract(7, 'day').valueOf();
    let milkData = await this._getDataListFromDb(
      last24Moment,
      moment().valueOf(),
    );
    console.log('mothermilk today data', milkData);
    let data: any[] = [];
    let maxValue = -1;
    let minValue = -1;

    let leftTimeData: any[] = [];
    let rightTimeData: any[] = [];
    let milkLeftDataMap = new Map();
    let milkRightDataMap = new Map();
    milkData.forEach((value: any) => {
      let timeLabel = moment(value.time).format('MM-DD');
      if (milkLeftDataMap.has(timeLabel)) {
        let tempData = value.leftTime + milkLeftDataMap.get(timeLabel);
        milkLeftDataMap.set(timeLabel, tempData);
      } else {
        milkLeftDataMap.set(timeLabel, value.leftTime);
      }
      if (milkRightDataMap.has(timeLabel)) {
        let tempData = value.rightTime + milkRightDataMap.get(timeLabel);
        milkRightDataMap.set(timeLabel, tempData);
      } else {
        milkRightDataMap.set(timeLabel, value.rightTime);
      }
    });

    for (const key of milkLeftDataMap.keys()) {
      let tempLeftTime = milkLeftDataMap.get(key);
      if (maxValue < 0) {
        maxValue = tempLeftTime;
      }
      if (minValue < 0) {
        minValue = tempLeftTime;
      }
      if (maxValue < tempLeftTime) {
        maxValue = tempLeftTime;
      }
      if (minValue > tempLeftTime) {
        minValue = tempLeftTime;
      }

      let leftTimeObj = {
        value: tempLeftTime,
        label: key,
        labelTextStyle: styleObject,
      };
      leftTimeData.push(leftTimeObj);
    }
    for (const key of milkRightDataMap.keys()) {
      let tempRightTime = milkRightDataMap.get(key);
      if (maxValue < 0) {
        maxValue = tempRightTime;
      }
      if (minValue < 0) {
        minValue = tempRightTime;
      }
      if (maxValue < tempRightTime) {
        maxValue = tempRightTime;
      }
      if (minValue > tempRightTime) {
        minValue = tempRightTime;
      }

      let rightTimeObj = {
        value: tempRightTime,
        label: key,
        labelTextStyle: styleObject,
      };
      rightTimeData.push(rightTimeObj);
    }

    minValue = minValue - 5 < 0 ? 0 : minValue - 5;
    maxValue += 5;
    console.log('labels and data left', leftTimeData);
    console.log('labels and data right', rightTimeData);
    this.setState({
      minMilkDose: minValue,
      maxMilkDose: maxValue,
      staticsData: data,
      leftTimeData,
      rightTimeData,
    });
  }

  async _getLast24StaticsData() {
    let last24Moment = moment().subtract(1, 'day').valueOf();
    let milkData = await this._getDataListFromDb(
      last24Moment,
      moment().valueOf(),
    );
    console.log('mothermilk today data', milkData);
    let data: any[] = [];
    let maxValue = -1;
    let minValue = -1;

    let leftTimeData: any[] = [];
    let rightTimeData: any[] = [];
    milkData.forEach((value: any) => {
      let timeLabel = moment(value.time).format('HH:mm');
      let leftTime = value.leftTime;
      let rightTime = value.rightTime;
      let leftTimeObj = {
        value: leftTime,
        label: timeLabel,
        labelTextStyle: styleObject,
      };
      let rightTimeObj = {
        value: rightTime,
        label: timeLabel,
        labelTextStyle: styleObject,
      };
      leftTimeData.push(leftTimeObj);
      rightTimeData.push(rightTimeObj);

      if (maxValue < 0) {
        if (leftTime > rightTime) {
          maxValue = leftTime;
        } else {
          maxValue = rightTime;
        }
      }

      if (minValue < 0) {
        if (leftTime < rightTime) {
          minValue = leftTime;
        } else {
          minValue = rightTime;
        }
      }
      let tempMaxValue = leftTime;
      let tempMinValue = leftTime;
      if (leftTime > rightTime) {
        tempMaxValue = leftTime;
        tempMinValue = rightTime;
      } else {
        tempMaxValue = leftTime;
        tempMinValue = rightTime;
      }
      if (tempMaxValue > maxValue) {
        maxValue = tempMaxValue;
      }
      if (tempMinValue < minValue) {
        minValue = tempMinValue;
      }
    });

    minValue = minValue - 5 < 0 ? 0 : minValue - 5;
    maxValue += 5;
    console.log('labels and data left', leftTimeData);
    console.log('labels and data right', rightTimeData);
    this.setState({
      minMilkDose: minValue,
      maxMilkDose: maxValue,
      staticsData: data,
      leftTimeData,
      rightTimeData,
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
      <View style={[commonStyles.flexColumn]}>
        <LineChart
          stepValue={2}
          showVerticalLines
          height={200}
          labelsExtraHeight={40}
          maxValue={this.state.maxMilkDose - this.state.minMilkDose}
          yAxisOffset={this.state.minMilkDose}
          color={Colors.primary}
          color1={Colors.primary1}
          width={ChartWidth}
          data={this.state.leftTimeData}
          data2={this.state.rightTimeData}
        />
        <View
          style={[
            commonStyles.flexRow,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
          <View
            style={[commonStyles.flexColumn, commonStyles.center, {width: 60}]}>
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: Colors.primary,
              }}></View>
            <Text>左边</Text>
          </View>
          <View
            style={[commonStyles.flexColumn, commonStyles.center, {width: 60}]}>
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: Colors.primary1,
              }}></View>
            <Text>右边</Text>
          </View>
        </View>
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
              喝奶量-{this.state.title}
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
