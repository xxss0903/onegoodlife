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
 * 身高
 */
export default class HeightStaticsCard extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      maxMilkDose: 120,
      minMilkDose: 0,
      staticsData: [{value: 55, label: mainData.babyInfo.birthDay}],
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
      TYPE_ID.HEIGHT,
    );
    console.log('statics weight data', milkData);
    let data: any[] = [];
    let maxValue = -1;
    let minValue = -1;
    milkData.forEach((value: any) => {
      let timeLabel = moment(value.time).format('MM-DD');
      let height = parseFloat(value.height);
      let obj = {
        value: height,
        label: timeLabel,
        labelTextStyle: styleObject,
      };
      data.unshift(obj);
      if (maxValue < 0) {
        maxValue = height;
      }
      if (minValue < 0) {
        minValue = height;
      }
      if (height > maxValue) {
        maxValue = height;
      }
      if (minValue > height) {
        minValue = height;
      }
    });

    minValue = minValue - 1 < 0 ? 0 : minValue - 1;
    maxValue += 1;
    console.log('labels and data', minValue, maxValue);
    this.setState({
      minMilkDose: minValue,
      maxMilkDose: maxValue,
      staticsData: data,
    });
  }

  refreshData() {
    this._getStaticsData();
  }

  // 母乳统计
  _renderLineChart() {
    return (
      <LineChart
        color={Colors.primary}
        showVerticalLines
        height={200}
        stepValue={1}
        maxValue={this.state.maxMilkDose - this.state.minMilkDose}
        yAxisOffset={this.state.minMilkDose}
        labelsExtraHeight={40}
        width={ChartWidth}
        data={this.state.staticsData}
      />
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
              身高
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
