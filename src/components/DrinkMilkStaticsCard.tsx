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

/**
 * 奶粉统计
 */
export default class DrinkMilkStaticsCard extends Component<any, any> {
  private lineChartConfig = {
    backgroundColor: Colors.white,
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    color: (opacity = 0.5) => Colors.primary1,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    fillShadowGradientTo: Colors.white,
    fillShadowGradientFrom: Colors.white,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontSize: 14,
    },
  };
  private barChartConfig = {
    strokeWidth: 2, // optional, default 3
    fillShadowGradientTo: Colors.primary1,
    fillShadowGradientToOpacity: 1,
    fillShadowGradientFrom: Colors.primary1,
    useShadowColorFromDataset: false,
    backgroundColor: Colors.white,
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => Colors.primary1,
  };
  private pieChartConfig = {
    backgroundColor: Colors.white,
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    color: (opacity = 0.5) => Colors.primary1,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    fillShadowGradientTo: Colors.white,
    fillShadowGradientFrom: Colors.white,
    useShadowColorFromDataset: false, // optional
    propsForLabels: {
      fontSize: 14,
    },
  };

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
      dateType: StaticsDate.DAY,
      // {value: 250, label: 'M'}
      staticsData: [{value: 250, label: 'M'}],
    };
  }

  componentDidMount() {
    // this._getLast24StaticsData();
    // this._getLast24StaticsData();
  }

  // 获取过去24小时的数据
  async _getLast24HoursData() {
    let now = moment();
    let last24Moment = now.diff(1, 'days').valueOf();
    let dataList = await getDataListByDateRange(
      db.database,
      mainData.babyInfo.babyId,
      TYPE_ID.MILK,
      last24Moment,
      now.valueOf(),
    );
    console.log('last 24 hours milk list', dataList);
    let tempDataList: any[] = [];
    // 过去24小时的时间戳
    let last24HourMoment = moment().subtract(1, 'day').valueOf();

    for (let i = 0; i < dataList.length; i++) {
      let data = dataList[i];
      if (data.time > last24HourMoment) {
        if (data.typeId === TYPE_ID.MILK) {
          tempDataList.push(data);
        }
      }
    }
    return JSON.parse(JSON.stringify(tempDataList));
  }

  _getTodayData() {
    let dataList = this.props.dataList;
    let tempDataList: any[] = [];
    let todayMoment = moment().startOf('day').valueOf();
    for (let i = 0; i < dataList.length; i++) {
      let data = dataList[i];
      if (data.time > todayMoment) {
        // 常用的数据
        mainData.commonActions.forEach(value => {
          if (value.id === data.typeId) {
            tempDataList.push(data);
          }
        });
      }
    }
    return JSON.parse(JSON.stringify(tempDataList));
  }

  // 获取上个月数据，就是每天的量然后获取到整个月
  _getLastMonthStaticsData() {}

  // 按天获取统计数量
  async _getDayStaticsData() {
    let today = await this._getLast24HoursData();
    let milkData = today.filter((value: any) => value.typeId === TYPE_ID.MILK);
    console.log(' statics today data', milkData);
    let data: any[] = [];
    let maxValue = -1;
    let minValue = -1;
    milkData.forEach((value: any) => {
      let timeLabel = moment(value.time).format('HH:mm');
      let obj = {value: value.dose, label: timeLabel};
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
    });
  }

  async _getLast24StaticsData() {
    let last24Moment = moment().subtract(1, 'day').valueOf();
    let milkData = await getDataListByDateRange(
      db.database,
      mainData.babyInfo.babyId,
      TYPE_ID.MILK,
      last24Moment,
      moment().valueOf(),
    );
    console.log('statics today data', milkData);
    let data: any[] = [];
    let maxValue = -1;
    let minValue = -1;
    milkData.forEach((value: any) => {
      let timeLabel = moment(value.time).format('HH:mm');
      let obj = {value: value.dose, label: timeLabel};
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
    });
  }

  _getMotherMilkStaticsData() {}

  _getMixStaticsData() {}

  refreshData() {
    switch (this.state.dateType) {
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
    this.forceUpdate();
  }

  // 母乳统计
  _renderLineChart() {
    return <LineChart width={ChartWidth} data={this.state.staticsData} />;
  }

  _renderChart(type: string) {
    switch (type) {
      case StaticsDate.DAY:
        return this._renderLineChart();
      case StaticsDate.WEEK:
        return this._renderLineChart();
      case StaticsDate.MONTH:
        return this._renderLineChart();
    }
    return null;
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
              }}>
              天
            </Menu.Item>
            <Menu.Item
              onPress={() => {
                this.setState({
                  dateType: StaticsDate.WEEK,
                });
              }}>
              周
            </Menu.Item>
            <Menu.Item
              onPress={() => {
                this.setState({
                  dateType: StaticsDate.MONTH,
                });
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
          {this.state.staticsData?.length > 0
            ? this._renderChart(this.state.dateType)
            : null}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: Margin.horizontal,
    backgroundColor: Colors.white,
    padding: Margin.horizontal,
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
