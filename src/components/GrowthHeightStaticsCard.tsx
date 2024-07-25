import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {commonStyles} from '../commonStyle';
import {Colors} from '../colors';
import {Margin} from '../space';
import {mainData, StaticsType, TYPE_ID} from '../mainData.ts';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import {ChartWidth} from '../utils/until';
import girlsHeight from '../data/girls-height.json';
import boysHeight from '../data/boys-height.json';
import {Menu, Pressable} from 'native-base';
import EventBus from '../utils/eventBus';

const dashData = [2, 1];

/**
 * 生长曲线统计卡片
 */
export default class GrowthWeightStaticsCard extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      staticsType: 'line', // 表格类型: 'line', 'bar', 'pie'
      dataType: StaticsType.DAY,
      // {value: 250, label: 'M'}
      staticsData: [{value: 250, label: 'M'}],
      weightTitle: '',
      heightTitle: '',
      showStaticsChart: true, // 显示生长统计，默认不显示
      girlsHeight: {
        dataList1: [],
        dataList2: [],
        dataList3: [],
        dataList4: [],
        dataList5: [],
        dataList6: [],
        dataList7: [],
      },
      boysHeight: {
        dataList1: [],
        dataList2: [],
        dataList3: [],
        dataList4: [],
        dataList5: [],
        dataList6: [],
        dataList7: [],
      },
    };
  }

  componentDidMount() {
    // this._getDayStaticsData();
    if (this.state.showStaticsChart) {
      this._initBaseData();
    }
    // this._getDayStaticsData();
  }

  // 初始化初始统计数据
  _initBaseData() {
    if (mainData.babyInfo.sex === 'boy') {
      this.setState({
        weightTitle: `体重-男`,
      });
      this._initBoyGrowthData();
    } else {
      this.setState({
        weightTitle: `体重-女`,
      });
      this._initGirlHeightData();
    }
  }

  // 男孩的生长曲线数据
  _initBoyGrowthData() {
    let dataList1: any[] = []; //下
    let dataList2: any[] = []; //中下
    let dataList3: any[] = []; // 中下
    let dataList4: any[] = []; // 中身高
    let dataList5: any[] = []; // 中上
    let dataList6: any[] = []; // 重伤
    let dataList7: any[] = []; //上

    boysHeight.forEach(value => {
      let month = value['age']; // 月份
      let heights = value['percentiles'];
      dataList1.push({value: heights[0]['v'], label: month + ''});
      dataList2.push({value: heights[1]['v'], label: month + ''});
      dataList3.push({value: heights[2]['v'], label: month + ''});
      dataList4.push({value: heights[3]['v'], label: month + ''});
      dataList5.push({value: heights[4]['v'], label: month + ''});
      dataList6.push({value: heights[5]['v'], label: month + ''});
      dataList7.push({value: heights[6]['v'], label: month + ''});
    });
    this.setState({
      boysHeight: {
        dataList1,
        dataList2,
        dataList3,
        dataList4,
        dataList5,
        dataList6,
        dataList7,
      },
    });
  }

  // 女孩的生长曲线数据
  _initGirlHeightData() {
    let dataList1: any[] = []; //下
    let dataList2: any[] = []; //中下
    let dataList3: any[] = []; // 中下
    let dataList4: any[] = []; // 中身高
    let dataList5: any[] = []; // 中上
    let dataList6: any[] = []; // 重伤
    let dataList7: any[] = []; //上

    girlsHeight.forEach(value => {
      let month = value['age']; // 月份
      let heights = value['percentiles'];
      dataList1.push({value: heights[0]['v'], label: month + ''});
      dataList2.push({value: heights[1]['v'], label: month + ''});
      dataList3.push({value: heights[2]['v'], label: month + ''});
      dataList4.push({value: heights[3]['v'], label: month + ''});
      dataList5.push({value: heights[4]['v'], label: month + ''});
      dataList6.push({value: heights[5]['v'], label: month + ''});
      dataList7.push({value: heights[6]['v'], label: month + ''});
    });
    this.setState({
      girlsHeight: {
        dataList1,
        dataList2,
        dataList3,
        dataList4,
        dataList5,
        dataList6,
        dataList7,
      },
    });
  }

  refreshData() {
    this._initBaseData();
  }

  _renderBoyGrowthLineChart() {
    const dataList1 = this.state.boysHeight['dataList1'];
    const dataList3 = this.state.boysHeight['dataList3'];
    const dataList4 = this.state.boysHeight['dataList4'];
    const dataList5 = this.state.boysHeight['dataList5'];
    const dataList7 = this.state.boysHeight['dataList7'];

    return this._renderChart(
      dataList1,
      dataList3,
      dataList4,
      dataList5,
      dataList7,
    );
  }

  _renderChart(
    dataList1: any[],
    dataList3: any[],
    dataList4: any[],
    dataList5: any[],
    dataList7: any[],
  ) {
    if (dataList1 && dataList1.length > 0) {
      return (
        <LineChart
          height={240}
          maxValue={30}
          yAxisOffset={40}
          hideDataPoints={true}
          showXAxisIndices={false}
          thickness={1}
          width={ChartWidth}
          dataSet={[
            {
              data: dataList1,
              color: '#FFAFCC80',
              strokeDashArray: dashData,
            },
            {
              data: dataList3,
              color: '#CDB4DB80',
              strokeDashArray: dashData,
            },
            {
              data: dataList4,
              color: '#A2D2FF80',
              strokeDashArray: dashData,
            },
            {
              data: dataList5,
              color: '#CDB4DB80',
              strokeDashArray: dashData,
            },
            {
              data: dataList7,
              color: '#FFAFCC80',
              strokeDashArray: dashData,
            },
            // 身高数据
            {
              data: [],
            },
          ]}
        />
      );
    } else {
      return null;
    }
  }

  _renderGirlGrowthLineChart() {
    const dataList1 = this.state.girlsHeight['dataList1'];
    const dataList3 = this.state.girlsHeight['dataList3'];
    const dataList4 = this.state.girlsHeight['dataList4'];
    const dataList5 = this.state.girlsHeight['dataList5'];
    const dataList7 = this.state.girlsHeight['dataList7'];
    return this._renderChart(
      dataList1,
      dataList3,
      dataList4,
      dataList5,
      dataList7,
    );
  }

  _renderLineChart() {
    if (mainData.babyInfo.sex === 'boy') {
      return this._renderBoyGrowthLineChart();
    } else {
      return this._renderGirlGrowthLineChart();
    }
  }

  _renderWeight() {
    return (
      <View style={{marginTop: Margin.horizontal}}>
        <View style={[styles.titleContainer, commonStyles.flexRow]}>
          <View style={[commonStyles.flexRow, {alignItems: 'center'}]}>
            <Image
              style={styles.titleIcon}
              source={require('../assets/ic_height.png')}
            />
            <Text
              style={[
                {
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginLeft: Margin.midHorizontal,
                },
              ]}>
              {this.state.weightTitle}
            </Text>
          </View>
        </View>
        <View style={styles.dataContainer}>{this._renderLineChart()}</View>
      </View>
    );
  }

  _renderStaticsChart() {
    if (this.state.showStaticsChart) {
      return <View>{this._renderWeight()}</View>;
    } else {
      return null;
    }
  }

  _toggleStaticsData() {
    if (this.state.showStaticsChart) {
      this.setState({
        showStaticsChart: false,
      });
    } else {
      this._initBaseData();
      this.setState({
        showStaticsChart: true,
      });
    }
  }

  _renderTitle() {
    return (
      <View style={[styles.titleContainer, commonStyles.flexRow]}>
        <View style={[commonStyles.flexRow, {alignItems: 'center'}]}>
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
            style={{}}
            onPress={() => {
              // 移除当前统计卡片
              EventBus.sendEvent(EventBus.REMOVE_CARD, StaticsType.GROW_HEIGHT);
            }}>
            移除
          </Menu.Item>
        </Menu>
      </View>
    );
  }

  render() {
    return (
      <View style={[commonStyles.flexColumn, styles.cardContainer]}>
        {this._renderTitle()}
        {this._renderStaticsChart()}
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
  dataContainer: {
    marginTop: Margin.vertical,
  },
});
