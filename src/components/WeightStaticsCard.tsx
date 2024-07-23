import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {commonStyles} from '../commonStyle';
import {Colors} from '../colors';
import {Margin} from '../space';
import {mainData, TYPE_ID} from '../mainData.ts';
import {Menu, Pressable} from 'native-base';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import {ChartWidth} from '../utils/until';
import girlsWeight from '../data/girls-weight.json';
import moment from 'moment/moment';
import {getDataListByType} from '../utils/dbService';
import {db} from '../dataBase.ts';

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
export default class WeightStaticsCard extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      staticsType: 'line', // 表格类型: 'line', 'bar', 'pie'
      dataType: StaticsType.DAY,
      // {value: 250, label: 'M'}
      staticsData: [],
      weightTitle: '',
      heightTitle: '',
      showStaticsChart: false, // 显示生长统计，默认不显示
      maxValue: 10,
      girlsWeight: {
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
    this._getStaticsData();
  }

  async _getDataListFromDb() {
    const dataList = await getDataListByType(
      db.database,
      mainData.babyInfo.babyId,
      TYPE_ID.HEIGHT,
    );
    return dataList;
  }

  async _getStaticsData() {
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

  // 初始化初始统计数据
  _initBaseData() {
    console.log('init base data 1 ', mainData.babyInfo.sex);
    if (mainData.babyInfo.sex === 'boy') {
      this.setState({
        weightTitle: `体重-男`,
      });
      this._initBoyGrowthData();
    } else {
      this.setState({
        weightTitle: `体重-女`,
      });
      this._initGirlWeightData();
    }
  }

  _initBoyGrowthData() {}

  _initGirlWeightData() {
    let dataList1: any[] = []; //下
    let dataList2: any[] = []; //中下
    let dataList3: any[] = []; // 中下
    let dataList4: any[] = []; // 中身高
    let dataList5: any[] = []; // 中上
    let dataList6: any[] = []; // 重伤
    let dataList7: any[] = []; //上

    girlsWeight.forEach(value => {
      let month = value['age']; // 月份
      let weightList = value['percentiles'];
      dataList1.push({value: weightList[0]['v'], label: month + ''});
      dataList2.push({value: weightList[1]['v'], label: month + ''});
      dataList3.push({value: weightList[2]['v'], label: month + ''});
      dataList4.push({value: weightList[3]['v'], label: month + ''});
      dataList5.push({value: weightList[4]['v'], label: month + ''});
      dataList6.push({value: weightList[5]['v'], label: month + ''});
      dataList7.push({value: weightList[6]['v'], label: month + ''});
    });
    console.log('init base weight data', dataList1);
    this.setState({
      girlsWeight: {
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
    this._getStaticsData();
  }

  _renderBoyGrowthLineChart() {
    const dataList1 = this.state.girlsWeight['dataList1'];
    const dataList3 = this.state.girlsWeight['dataList3'];
    const dataList4 = this.state.girlsWeight['dataList4'];
    const dataList5 = this.state.girlsWeight['dataList5'];
    const dataList7 = this.state.girlsWeight['dataList7'];
    if (dataList1 && dataList1.length > 0) {
      return (
        <LineChart
          height={340}
          showVerticalLines={true}
          verticalLinesColor={Colors.grayEe}
          hideDataPoints={true}
          verticalLinesStrokeDashArray={[4, 8]}
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
    const dataList1 = this.state.girlsWeight['dataList1'];
    const dataList3 = this.state.girlsWeight['dataList3'];
    const dataList4 = this.state.girlsWeight['dataList4'];
    const dataList5 = this.state.girlsWeight['dataList5'];
    const dataList7 = this.state.girlsWeight['dataList7'];
    console.log('render girl weight', dataList1);
    if (dataList1 && dataList1.length > 0) {
      return (
        <LineChart
          height={240}
          maxValue={this.state.maxValue}
          showVerticalLines={true}
          verticalLinesColor={Colors.grayEe}
          hideDataPoints={true}
          initialSpacing={10}
          spacing={24}
          verticalLinesStrokeDashArray={[4, 8]}
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
    console.log('render weight chart');
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
          <Image
            style={styles.titleIcon}
            source={require('../assets/ic_baby_girl.png')}
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
        <TouchableOpacity
          onPress={() => {
            this._toggleStaticsData();
          }}
          style={[
            commonStyles.center,
            {
              width: 40,
              height: 40,
              backgroundColor: Colors.loginTouch,
              borderRadius: Margin.bigCorners,
            },
          ]}>
          <Image
            style={{
              resizeMode: 'contain',
              width: 16,
              height: 16,
              transform: [
                {rotate: this.state.showStaticsChart ? '180deg' : '0deg'},
              ],
            }}
            source={require('../assets/ic_down_white.png')}
          />
        </TouchableOpacity>
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
