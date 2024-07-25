import React, {Component} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {mainData, TYPE_ID} from '../mainData';
import {COLOR_LINE, commonStyles} from '../commonStyle';
import moment from 'moment';
import {Margin} from '../space';
import {getLastData} from '../utils/dbService.js';
import {db} from '../dataBase.ts';

// 统计独立界面
export default class StaticsView extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false,
      datepickerOpen: false,
      todayDataMap: new Map(), // 今天的数据
      last24Data: new Map(),
      lastDataMap: new Map(), // 最近数据
    };
  }

  _getStaticsDataView(dataList, callback) {
    // 获取分类数据
    let dataMap = new Map();
    for (let i = 0; i < dataList.length; i++) {
      let data = dataList[i];
      if (dataMap.has(data.name)) {
        let value = dataMap.get(data.name);
        // 统计次数
        value.value += 1;
        // 如果是牛奶就添加牛奶总量
        if (data.name.indexOf('奶') >= 0) {
          value.dose += data.dose;
        }

        dataMap.set(data.name, value);
      } else {
        let obj = {value: 1, name: data.name};
        if (data.name.indexOf('奶') >= 0) {
          obj.dose = data.dose;
        }
        dataMap.set(data.name, obj);
      }
    }
    let sortedMap = new Map();
    mainData.typeMapList.forEach(value => {
      if (dataMap.has(value.name)) {
        sortedMap.set(value.name, dataMap.get(value.name));
      }
    });
    callback && callback(sortedMap);
  }

  componentDidMount() {
    this.refreshData();
  }

  // 获取类型最新的数据
  async _initLastData() {
    let lastMilkData = await getLastData(
      db.database,
      this.props.babyId,
      TYPE_ID.MILK,
    );
    let lastPoopData = await getLastData(
      db.database,
      this.props.babyId,
      TYPE_ID.POOP,
    );
    let lastDiaperData = await getLastData(
      db.database,
      this.props.babyId,
      TYPE_ID.DIAPER,
    );
    let lastData = {
      lastMilkData,
      lastPoopData,
      lastDiaperData,
    };
    console.log('get last data', lastData);
    this._getLastData(lastData);
  }

  refreshData() {
    let todayData = this._getTodayData();
    console.log("statics view get today data", todayData)
    this._initLastData();
    this._getStaticsDataView(todayData, data => {
      this.setState(
        {
          todayDataMap: data,
        },
        () => {},
      );
    });
    let last24Data = this._getLast24HoursData();
    this._getStaticsDataView(last24Data, data => {
      this.setState(
        {
          last24Data: data,
        },
        () => {},
      );
    });
  }

  // 获取固定类型的最近的数据
  _getLastData(lastData) {
    // 上次喝奶
    let lastDrinkMilk = lastData.lastMilkData;
    if (lastDrinkMilk && lastDrinkMilk.length > 0) {
      this.state.lastDataMap.set(TYPE_ID.MILK, lastDrinkMilk[0]);
    } else {
      this.state.lastDataMap.delete(TYPE_ID.MILK)
    }
    // 上次拉屎
    let lastPoop = lastData.lastPoopData;
    if (lastPoop && lastPoop.length > 0) {
      this.state.lastDataMap.set(lastPoop[0].typeId, lastPoop[0]);
    } else {
      this.state.lastDataMap.delete(TYPE_ID.POOP)
    }
    // 上次换尿布
    let lastDiaper = lastData.lastDiaperData;
    if (lastDiaper && lastDiaper.length > 0) {
      this.state.lastDataMap.set(lastDiaper[0].typeId, lastDiaper[0]);
    } else {
      this.state.lastDataMap.delete(TYPE_ID.DIAPER)
    }
    this.forceUpdate();
  }

  // 获取今天的数据
  _getTodayData() {
    let dataList = this.props.dataList;
    let tempDataList = [];
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

  // 获取过去24小时的数据
  _getLast24HoursData() {
    let dataList = this.props.dataList;
    let tempDataList = [];
    // 过去24小时的时间戳
    let last24HourMoment = moment().subtract(1, 'day').valueOf();
    for (let i = 0; i < dataList.length; i++) {
      let data = dataList[i];
      if (data.time > last24HourMoment) {
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

  _getLastTime(time) {
    let isSameDay = moment(time).isSame(moment(), 'day');
    if (isSameDay) {
      return moment(time).format('HH:mm');
    } else {
      let isLastDay = moment(time).isSame(moment().subtract(1, 'day'), 'day');
      if (isLastDay) {
        return `昨天${moment(time).format('HH:mm')}`;
      } else {
        return moment(time).format('MM-DD HH:mm');
      }
    }

    return moment(time).format('HH:MM');
  }

  _renderLastDataMap(dataMap: any) {
    let keyArray = Array.from(dataMap.keys());
    let mapView = keyArray.map((key, index) => {
      let data = dataMap.get(key);
      return (
        <View
          key={index}
          style={[commonStyles.flexRow, {marginBottom: Margin.smalHorizontal}]}>
          <Text style={[styles.contentText]}>
            {data.name}: {this._getLastTime(data.time)}
          </Text>
        </View>
      );
    });

    return <View>{mapView}</View>;
  }

  _renderDataMap(dataMap: any) {
    let keyArray = Array.from(dataMap.keys());
    let mapView = keyArray.map((key, index) => {
      let data = dataMap.get(key);
      return (
        <View
          key={index}
          style={[commonStyles.flexRow, {marginBottom: Margin.smalHorizontal}]}>
          <Text style={[styles.contentText]}>
            {key}:{data.value}次
          </Text>
          {data.dose > 0 ? <Text style={{}}>，共{data.dose}ml</Text> : null}
        </View>
      );
    });

    return <View>{mapView}</View>;
  }

  render() {
    if (
      (this.state.last24Data && this.state.last24Data.size) ||
      (this.state.lastDataMap && this.state.lastDataMap.size)
    ) {
      return (
        <View
          style={[
            commonStyles.flexColumn,
            {
              flex: 1,
              paddingTop: Margin.vertical,
            },
          ]}>
          {/*统计的数字信息*/}
          <View style={[commonStyles.flexRow, {flex: 1}]}>
            {/*最近数据，比如上次拉屎，上次喝奶，上次打疫苗等这种重要的最近一次统计的数据*/}
            <View style={[commonStyles.flexColumn, {flex: 1}]}>
              <Text
                style={[
                  {marginBottom: Margin.smalHorizontal},
                  styles.titleText,
                ]}>
                最近数据
              </Text>
              {this._renderLastDataMap(this.state.lastDataMap)}
            </View>
            {/*当天的统计*/}
            <View style={[commonStyles.flexColumn, {flex: 1}]}>
              <Text
                style={[
                  {marginBottom: Margin.smalHorizontal},
                  styles.titleText,
                ]}>
                24小时统计
              </Text>
              {this._renderDataMap(this.state.last24Data)}
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={[
            commonStyles.flexColumn,
            commonStyles.center,
            {
              flex: 1,
              paddingTop: Margin.horizontal,
            },
          ]}>
          <Text
            style={[
              {
                fontSize: 20,
                paddingVertical: Margin.vertical,
                fontWeight: 'bold',
              },
            ]}>
            亲爱的{mainData.userInfo.role}
          </Text>
          <Text
            style={[
              {
                fontSize: 20,
                paddingVertical: Margin.vertical,
                fontWeight: 'bold',
              },
            ]}>
            最近还没给宝宝添加记录哦！
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 16,
  },
});
