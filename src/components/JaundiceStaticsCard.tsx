import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {commonStyles} from '../commonStyle';
import {Colors} from '../colors';
import {ChartWidth} from '../utils/until';
import {Margin} from '../space';
import moment from 'moment';
import {mainData, StaticsType, TYPE_ID} from '../mainData.ts';
import {LineChart} from 'react-native-gifted-charts';
import {getDataListByType} from '../utils/dbService.js';
import {db} from '../dataBase.ts';
import {Menu, Pressable} from 'native-base';
import EventBus from '../utils/eventBus';

const styleObject = {
  transform: [{rotate: '60deg'}],
  paddingLeft: Margin.horizontal,
};

/**
 * 黄疸统计
 */
export default class JaundiceStaticsCard extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      maxMilkDose: 15,
      minMilkDose: 0,
      chestData: [], // 胸
      headerData: [], // 头
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
      TYPE_ID.JAUNDICE,
    );
    console.log('statics jaundice data', milkData);
    let data: any[] = [];
    let maxValue = -1;
    let minValue = -1;
    let headerData: any[] = [];
    let chestData: any[] = [];
    milkData.forEach((value: any) => {
      let timeLabel = moment(value.time).format('MM-DD');
      const {header, chest} = value.jaundiceValue;

      headerData.push({
        value: header,
        label: timeLabel,
        labelTextStyle: styleObject,
      });
      chestData.push({
        value: chest,
        label: timeLabel,
        labelTextStyle: styleObject,
      });

      if (maxValue < 0 || minValue < 0) {
        maxValue = parseFloat(header);
        minValue = parseFloat(header);
      }
      if (maxValue < header) {
        maxValue = header;
      } else if (minValue > header) {
        minValue = header;
      }
      if (maxValue < chest) {
        maxValue = chest;
      } else if (minValue > chest) {
        minValue = chest;
      }
    });

    minValue = minValue - 1 < 0 ? 0 : minValue - 1;
    maxValue += 1;
    console.log('labels and data', headerData);
    this.setState({
      minMilkDose: minValue,
      maxMilkDose: maxValue,
      headerData,
      chestData,
    });
  }

  refreshData() {
    this._getStaticsData();
  }

  // 母乳统计
  _renderLineChart() {
    return (
      <View style={[commonStyles.flexColumn]}>
        <LineChart
          stepValue={1}
          showVerticalLines
          height={200}
          labelsExtraHeight={40}
          maxValue={this.state.maxMilkDose - this.state.minMilkDose}
          yAxisOffset={this.state.minMilkDose}
          color={Colors.primary}
          color1={Colors.primary1}
          width={ChartWidth}
          data={this.state.headerData}
          data2={this.state.chestData}
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
            <Text>头</Text>
          </View>
          <View
            style={[commonStyles.flexColumn, commonStyles.center, {width: 60}]}>
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: Colors.primary1,
              }}></View>
            <Text>胸</Text>
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
              黄疸
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
                EventBus.sendEvent(EventBus.REMOVE_CARD, StaticsType.HEIGHT);
              }}>
              移除
            </Menu.Item>
          </Menu>
        </View>
        <View style={styles.dataContainer}>{this._renderLineChart()}</View>
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
