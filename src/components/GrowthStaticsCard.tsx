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
import {GrowthData} from '../utils/babyGrowthData';
import boysHeight from '../data/boys-weight.json';
import girlsHeight from '../data/girls-height.json';

// 统计类型
export const StaticsType = {
  DAY: 'day', // 按天统计
  WEEK: 'week',
  MONTH: 'month',
  RANGE: 'range',
};

const dashData = [2, 1];

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
      staticsType: 'line', // 表格类型: 'line', 'bar', 'pie'
      dataType: StaticsType.DAY,
      // {value: 250, label: 'M'}
      staticsData: [{value: 250, label: 'M'}],
      girlsHeight: {
        height1List: [],
        height2List: [],
        height3List: [],
        height4List: [],
        height5List: [],
        height6List: [],
        height7List: [],
      },
    };
  }

  componentDidMount() {
    // this._getDayStaticsData();
    this._initBaseData();
    // this._getDayStaticsData();
  }

  // 初始化初始统计数据
  _initBaseData() {
    // this._initBoyHeightData();
    this._initGirlHeightData();
  }

  _initGirlHeightData() {
    let height1List: any[] = []; //下
    let height2List: any[] = []; //中下
    let height3List: any[] = []; // 中下
    let height4List: any[] = []; // 中身高
    let height5List: any[] = []; // 中上
    let height6List: any[] = []; // 重伤
    let height7List: any[] = []; //上

    console.log('girls origin data', girlsHeight);
    girlsHeight.forEach(value => {
      let month = value['age']; // 月份
      let heights = value['percentiles'];
      height1List.push({value: heights[0]['v'], label: month + ''});
      height2List.push({value: heights[1]['v'], label: month + ''});
      height3List.push({value: heights[2]['v'], label: month + ''});
      height4List.push({value: heights[3]['v'], label: month + ''});
      height5List.push({value: heights[4]['v'], label: month + ''});
      height6List.push({value: heights[5]['v'], label: month + ''});
      height7List.push({value: heights[6]['v'], label: month + ''});
    });
    this.setState({
      girlsHeight: {
        height1List,
        height2List,
        height3List,
        height4List,
        height5List,
        height6List,
        height7List,
      },
    });
  }

  _initBoyHeightData() {
    let height1List = []; //下
    let height2List = []; //中下
    let height3List = []; // 中下
    let height4List = []; // 中身高
    let height5List = []; // 中上
    let height6List = []; // 重伤
    let height7List = []; //上

    boysHeight.forEach(value => {});
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
    let originHeight = GrowthData.height;
    let boyHeightData = originHeight['0'];
    let heightDataList = [];
    const height1List = this.state.girlsHeight['height1List'];
    const height2List = this.state.girlsHeight['height2List'];
    const height3List = this.state.girlsHeight['height3List'];
    const height4List = this.state.girlsHeight['height4List'];
    const height5List = this.state.girlsHeight['height5List'];
    const height6List = this.state.girlsHeight['height6List'];
    const height7List = this.state.girlsHeight['height7List'];
    console.log('girls height list', height1List);
    if (height1List && height1List.length > 0) {
      return (
        <LineChart
          height={240}
          maxValue={40}
          hideDataPoints={true}
          yAxisOffset={40}
          showXAxisIndices={false}
          thickness={1}
          width={ChartWidth}
          dataSet={[
            {
              data: height1List,
              color: Colors.primary1,
              strokeDashArray: dashData,
            },
            {
              data: height2List,
              color: Colors.primary2,
              strokeDashArray: dashData,
            },
            {
              data: height3List,
              color: Colors.primary3,
              strokeDashArray: dashData,
            },
            {
              data: height4List,
              color: Colors.primary4,
              strokeDashArray: dashData,
            },
            {
              data: height5List,
              color: Colors.primary3,
              strokeDashArray: dashData,
            },
            {
              data: height6List,
              color: Colors.primary2,
              strokeDashArray: dashData,
            },
            {
              data: height7List,
              color: Colors.primary1,
              strokeDashArray: dashData,
            },
            {
              data: [
                {value: 48, label: '0'},
                {value: 55, label: '1'},
                {value: 60, label: '2'},
                {value: 62, label: '3'},
              ],
            },
          ]}
        />
      );
    } else {
      return null;
    }
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
            <Menu.Item onPress={() => {}}>柱状图</Menu.Item>
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
