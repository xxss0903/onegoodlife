import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {commonStyles} from '../commonStyle';
import {Colors} from '../colors';
import {Margin} from '../space';
import moment from 'moment';
import {mainData, TYPE_ID} from '../mainData.ts';
import {Menu, Pressable} from 'native-base';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import {ChartWidth} from '../utils/until';

// 统计类型
export const StaticsType = {
  DAY: 'day', // 按天统计
  WEEK: 'week',
  MONTH: 'month',
  RANGE: 'range',
};

/**
 * 生长曲线统计卡片
 */
export default class GrowthStaticsCard extends Component<any, any> {
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
      maxValue: 120,
      minValue: 0,
      staticsType: 'line', // 表格类型: 'line', 'bar', 'pie'
      dataType: StaticsType.DAY,
      // {value: 250, label: 'M'}
      staticsData: [{value: 250, label: 'M'}],
    };
  }

  componentDidMount() {
    // this._getDayStaticsData();
    this._getDayStaticsData();
  }

  // 获取过去24小时的数据
  _getLast24HoursData() {
    let dataList = this.props.dataList;
    let tempDataList: any[] = [];
    // 过去24小时的时间戳
    let last24HourMoment = moment().subtract(1, 'day').valueOf();

    for (let i = 0; i < dataList.length; i++) {
      let data = dataList[i];
      if (data.time > last24HourMoment) {
        if (data.typeId === TYPE_ID.HEIGHT) {
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

  _getDayStaticsData() {
    let today = this._getLast24HoursData();
    let dataList = today.filter(
      (value: any) => value.typeId === TYPE_ID.HEIGHT,
    );
    console.log('statics height data', dataList);
    let data: any[] = [];
    let birthTime = moment(mainData.babyInfo.birthDay);

    dataList.forEach((value: any) => {
      let timeLabel = moment(value.time).format('HH:mm');
      // 将测量时间换算成出生的天数
      let dataTime = moment(value.time);
      let birthDay = dataTime.diff(birthTime, 'day');

      let obj = {value: birthDay, label: birthDay + '天'};
      data.unshift(obj);
    });

    console.log('labels and data', data);
    this.setState({
      staticsData: data,
    });
  }

  _getWeekStaticsData() {}

  _getMonthStaticsData() {}

  refreshData() {
    console.log('refresh growth data');
    switch (this.state.dataType) {
      case StaticsType.DAY:
        this._getDayStaticsData();
        break;
      case StaticsType.WEEK:
        this._getWeekStaticsData();
        break;
      case StaticsType.MONTH:
        this._getMonthStaticsData();
        break;
      case StaticsType.RANGE:
        break;
    }
    this.forceUpdate();
  }

  _editCard() {}

  _renderLineChart() {
    return (
      <LineChart
        height={240}
        width={ChartWidth}
        data={this.state.staticsData}
      />
    );
  }

  _renderPieChart() {
    return <PieChart data={this.state.staticsData} />;
  }

  _renderBarChart() {
    return (
      <BarChart
        width={ChartWidth}
        barWidth={22}
        noOfSections={3}
        barBorderRadius={4}
        frontColor="lightgray"
        data={this.state.staticsData}
        yAxisThickness={0}
        xAxisThickness={0}
      />
    );
  }

  _renderChart(type: string) {
    switch (type) {
      case 'pie':
        return this._renderPieChart();
      case 'line':
        return this._renderLineChart();
      case 'bar':
        return this._renderBarChart();
    }
    return null;
  }

  // 更改统计类型
  _changeStaticsType(type: string) {
    this.setState({
      staticsType: type,
    });
  }

  render() {
    return (
      <View style={[commonStyles.flexColumn, styles.cardContainer]}>
        <View style={[styles.titleContainer, commonStyles.flexRow]}>
          <View style={[commonStyles.flexRow, {alignItems: 'center'}]}>
            <Image
              style={styles.titleIcon}
              source={require('../assets/ic_height.png')}
            />
            <Text
              style={[
                {
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginLeft: Margin.midHorizontal,
                },
              ]}>
              生长曲线
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
                    borderRadius: Margin.midHorizontal,
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
                this._changeStaticsType('bar');
              }}>
              柱状图
            </Menu.Item>
            <Menu.Item
              onPress={() => {
                this._changeStaticsType('line');
              }}>
              线状图
            </Menu.Item>
            <Menu.Item
              onPress={() => {
                this._changeStaticsType('pie');
              }}>
              饼状图
            </Menu.Item>
          </Menu>
        </View>
        <View style={styles.dataContainer}>
          {this.state.staticsData?.length > 0
            ? this._renderChart(this.state.staticsType)
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
    borderRadius: Margin.borderPadding,
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
