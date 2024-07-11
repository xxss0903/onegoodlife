import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {commonStyles} from '../commonStyle';
import {Colors} from '../colors';
import {screenW} from '../utils/until';
import {Margin} from '../space';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';
import {mainData, TYPE_ID} from '../mainData.ts';

const ChartWidth = screenW - Margin.horizontal * 4;
// 统计类型
export const StaticsType = {
  DAY: 'day', // 按天统计
  WEEK: 'week',
  MONTH: 'month',
  RANGE: 'range',
};

export default class LifeTypeStaticsCard extends Component<any, any> {
  private chartConfig = {
    color: (opacity = 0.5) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    fillShadowGradientTo: 'transparent',
    fillShadowGradientFrom: 'transparent',
    useShadowColorFromDataset: false, // optional
  };
  private chartStyle = {
    marginVertical: Margin.vertical,
    borderRadius: 16,
  };

  constructor(props) {
    super(props);
    this.state = {
      maxMilkDose: 120,
      minMilkDose: 0,
      dataType: StaticsType.DAY,
      staticsData: {
        labels: ['星期1', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            data: [60, 45, 90, 100, 60, 40],
          },
        ],
      },
    };
  }

  componentDidMount() {
    // this._getDayStaticsData();
    this._getLast24HoursData();
  }

  // 获取过去24小时的数据
  _getLast24HoursData() {
    let dataList = this.props.dataList;
    let tempDataList: any[] = [];
    // 过去24小时的时间戳
    let last24HourMoment = moment().subtract(1, 'day').valueOf();
    let maxValue = -1;
    let minValue = -1;
    for (let i = 0; i < dataList.length; i++) {
      let data = dataList[i];
      if (data.time > last24HourMoment) {
        // 常用的数据
        mainData.commonActions.forEach(value => {
          if (value.id === data.typeId) {
            if (maxValue < 0) {
              maxValue = data.dose;
            }
            if (minValue < 0) {
              minValue = data.dose;
            }
            tempDataList.push(data);
            if (data.dose > maxValue) {
              maxValue = data.dose;
            }
            if (minValue < data.dose) {
              minValue = data.dose;
            }
          }
        });
      }
    }
    this.setState({
      maxMilkDose: minValue - 10 < 0 ? 0 : minValue - 10,
      minMilkDose: maxValue + 20,
    });
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
    let milkData = today.filter((value: any) => value.typeId === TYPE_ID.MILK);
    console.log(' statics today data', milkData);
    let labels: string[] = [];
    let data: number[] = [];
    milkData.forEach((value: any) => {
      let timeLabel = moment(value.time).format('HH:mm');
      labels.push(timeLabel);
      data.push(value.dose);
    });

    console.log('labels and data', labels, data);
    this.setState({
      staticsData: {
        labels: labels,
        datasets: [
          {
            data: data,
          },
          {
            data: new Array(milkData.length).fill(this.state.minMilkDose),
            color: () => 'transparent',
            strokeWidth: 0,
            withDots: false,
          },
          {
            data: new Array(milkData.length).fill(this.state.maxMilkDose),
            color: () => 'transparent',
            strokeWidth: 0,
            withDots: false,
          },
        ],
      },
    });
  }

  _getWeekStaticsData() {}

  _getMonthStaticsData() {}

  refreshData() {
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

  render() {
    return (
      <View style={[commonStyles.flexColumn, styles.cardContainer]}>
        <View style={[styles.titleContainer, commonStyles.flexRow]}>
          <View style={[commonStyles.flexRow, {alignItems: 'center'}]}>
            <Image
              style={styles.titleIcon}
              source={require('../assets/ic_milk.png')}
            />
            <Text
              style={[
                {
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginLeft: Margin.midHorizontal,
                },
              ]}>
              喝奶量
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              this._editCard();
            }}
            style={{
              padding: Margin.midHorizontal,
              backgroundColor: Colors.loginTouch,
              borderRadius: Margin.midHorizontal,
            }}>
            <Image
              style={styles.titleIcon}
              source={require('../assets/ic_edit_white.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.dataContainer}>
          {this.state.staticsData?.labels.length > 0 ? (
            <LineChart
              style={this.chartStyle}
              data={this.state.staticsData}
              width={ChartWidth}
              height={240}
              fromNumber={this.state.maxMilkDose}
              fromZero={true}
              yAxisSuffix={''}
              yAxisLabel={''}
              chartConfig={this.chartConfig}
              verticalLabelRotation={30}
              segments={4}
            />
          ) : null}
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
