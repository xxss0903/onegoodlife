import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {commonStyles} from '../commonStyle';
import {Colors} from '../colors';
import {Margin} from '../space';
import {mainData, TYPE_ID} from '../mainData.ts';
import {Menu, Pressable} from 'native-base';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import {ChartWidth} from '../utils/until';
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
  constructor(props: any) {
    super(props);
    this.state = {
      staticsType: 'line', // 表格类型: 'line', 'bar', 'pie'
      dataType: StaticsType.DAY,
      // {value: 250, label: 'M'}
      staticsData: [{value: 250, label: 'M'}],
      weightTitle: '',
      heightTitle: '',
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
    if (mainData.babyInfo.sex === 'boy') {
      this.setState({
        heightTitle: `（身高-男）`,
        weightTitle: `（体重-男）`,
      });
      this._initBoyGrowthData();
    } else {
      this.setState({
        heightTitle: `（身高-女）`,
        weightTitle: `（体重-女）`,
      });
      this._initGirlHeightData();
    }
  }

  _initBoyGrowthData() {}

  _initGirlHeightData() {
    let height1List: any[] = []; //下
    let height2List: any[] = []; //中下
    let height3List: any[] = []; // 中下
    let height4List: any[] = []; // 中身高
    let height5List: any[] = []; // 中上
    let height6List: any[] = []; // 重伤
    let height7List: any[] = []; //上

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

  refreshData() {
    this._initBaseData();
  }

  _editCard() {}

  _renderBoyGrowthLineChart() {
    const height1List = this.state.girlsHeight['height1List'];
    const height3List = this.state.girlsHeight['height3List'];
    const height4List = this.state.girlsHeight['height4List'];
    const height5List = this.state.girlsHeight['height5List'];
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
              color: '#FFAFCC80',
              strokeDashArray: dashData,
            },
            {
              data: height3List,
              color: '#CDB4DB80',
              strokeDashArray: dashData,
            },
            {
              data: height4List,
              color: '#A2D2FF80',
              strokeDashArray: dashData,
            },
            {
              data: height5List,
              color: '#CDB4DB80',
              strokeDashArray: dashData,
            },
            {
              data: height7List,
              color: '#FFAFCC80',
              strokeDashArray: dashData,
            },
            // 身高数据
            {
              data: [
                {value: 48, label: '0'},
                {value: 55, label: '0.2'},
                {value: 60, label: '0.3'},
                {value: 62, label: '0.5'},
              ],
            },
          ]}
        />
      );
    } else {
      return null;
    }
  }

  _renderGirlGrowthLineChart() {
    const height1List = this.state.girlsHeight['height1List'];
    const height3List = this.state.girlsHeight['height3List'];
    const height4List = this.state.girlsHeight['height4List'];
    const height5List = this.state.girlsHeight['height5List'];
    const height7List = this.state.girlsHeight['height7List'];
    console.log('girls height list', height1List);
    if (height1List && height1List.length > 0) {
      return (
        <LineChart
          height={240}
          maxValue={40}
          showVerticalLines={true}
          verticalLinesColor={Colors.grayEe}
          hideDataPoints={true}
          yAxisOffset={40}
          initialSpacing={10}
          spacing={24}
          verticalLinesStrokeDashArray={[4, 8]}
          showXAxisIndices={false}
          thickness={1}
          width={ChartWidth}
          dataSet={[
            {
              data: height1List,
              color: '#FFAFCC80',
              strokeDashArray: dashData,
            },
            {
              data: height3List,
              color: '#CDB4DB80',
              strokeDashArray: dashData,
            },
            {
              data: height4List,
              color: '#A2D2FF80',
              strokeDashArray: dashData,
            },
            {
              data: height5List,
              color: '#CDB4DB80',
              strokeDashArray: dashData,
            },
            {
              data: height7List,
              color: '#FFAFCC80',
              strokeDashArray: dashData,
            },
            // 身高数据
            {
              data: [
                {value: 48, label: '0'},
                {value: 55, label: '0.2'},
                {value: 60, label: '0.3'},
                {value: 62, label: '0.5'},
              ],
            },
          ]}
        />
      );
    } else {
      return null;
    }
  }

  _renderLineChart() {
    if (mainData.babyInfo.sex === 'boy') {
      return this._renderBoyGrowthLineChart();
    } else {
      return this._renderGirlGrowthLineChart();
    }
  }

  // 到处生长曲线
  _exportGrowthImage() {}

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
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginLeft: Margin.midHorizontal,
                },
              ]}>
              生长曲线{this.state.weightTitle}
            </Text>
          </View>
        </View>
        <View style={styles.dataContainer}>
          {this.state.staticsData?.length > 0 ? this._renderLineChart() : null}
        </View>
      </View>
    );
  }

  _renderHeight() {
    return (
      <View style={{}}>
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
              生长曲线{this.state.heightTitle}
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
                this._exportGrowthImage();
              }}>
              导出
            </Menu.Item>
            <Menu.Item onPress={() => {}}>柱状图</Menu.Item>
          </Menu>
        </View>
        <View style={styles.dataContainer}>
          {this.state.staticsData?.length > 0 ? this._renderLineChart() : null}
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={[commonStyles.flexColumn, styles.cardContainer]}>
        {this._renderHeight()}
        {this._renderWeight()}
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
