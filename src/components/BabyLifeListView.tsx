// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知
// 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加

import React from 'react';
import moment from 'moment';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {logi} from '../utils/logutil';
import DatePicker from 'react-native-date-picker';
import {DeviceStorage} from '../utils/deviceStorage';
import {AndroidPermissions} from '../utils/permissionUtils';
import {SwipeListView} from 'react-native-swipe-list-view';
import {BarChart, LineChart} from 'echarts/charts';
import * as echarts from 'echarts/core';
import SvgChart, {SVGRenderer} from '@wuba/react-native-echarts/svgChart';
import {EChartsType} from 'echarts/core';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import {screenW} from '../utils/until';
import PagerView from 'react-native-pager-view';
import {AlertDialog, Checkbox} from 'native-base';
import {
  mainData,
  milkTemplateData,
  poopTemplateData,
  peeTemplateData,
  otherTemplateData,
  commonTypeList,
} from '../mainData';
import AddNewLifeModal from './AddNewLifeModal';
import StaticsView from './StaticsView';
import EventBus from '../utils/eventBus';
import Share from 'react-native-share';
import {
  deleteDataByTime,
  getDataListOrderByTime,
  insertData,
  saveDataList,
} from '../utils/dbService';
import App from '../../App';
import {decodeFuc, encodeFuc} from '../utils/base64';
import {renderTagList} from './commonViews';
import BabyInfoView from './BabyInfoView';
import {commonStyles} from '../commonStyle';
import {Margin} from '../space';
import {Colors} from '../colors';

const typeMapList = mainData.typeMapList; // 类型列表
const commonActions = [
  commonTypeList[0],
  commonTypeList[1],
  commonTypeList[2],
  {
    id: 6,
    name: '全部',
    value: 'type_6',
    text: '全部',
    position: 6,
  },
]; // 放在主页的主要使用的类型action

// 测试用数据json，用来存储本地的数据，比如typeMap可以通过动态进行添加存储在本地
const tempJsonData = {dataList: [{itemType: 1}]};

echarts.use([
  SVGRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

export default class BabyLifeListView extends React.Component<any, any> {
  private currentAddType = null; // 当前的添加类型

  private staticsViewRef = null; // 统计数据view
  private cloneType = null; // 临时保存type的数据
  private last24HourChartRef: any; // 统计数据的渲染引用
  private last24HourCharts: EChartsType; // 统计图表
  private todayChartRef: any; // 统计数据的渲染引用
  private todayCharts: EChartsType; // 统计图表
  private newlifeModalRef = null;

  constructor(props) {
    super(props);
    this.state = {
      dataList: tempJsonData.dataList, // 本地的存储的数据列表
      showAddModal: false,
      datepickerOpen: false,
    };
  }

  componentDidMount() {
    this._initListeners();
    this._initEcharts();
    AndroidPermissions.checkStoragePermissions(
      () => {
        // this._initLocalData()
        this._initDBData();
      },
      () => {
        // 没有存储权限
      },
    );
  }

  // 获取数据库数据
  async _initDBData() {
    try {
      let localData = await getDataListOrderByTime(
        App.db,
        this.props.baby.babyId,
      );
      if (localData && localData.length > 0) {
        let dataList = [];
        // 获取列表数据
        for (const value of localData) {
          let data = decodeFuc(value.json);
          let dataObj = JSON.parse(data);
          dataList.push(dataObj);
        }
        // 更新界面数据
        this.setState({
          dataList: dataList,
        });
      }
    } catch (e) {
      logi('get data error', e);
    }
  }

  _initListeners() {
    EventBus.addEventListener(EventBus.REFRESH_DATA, data => {
      this._insertNewlifeLineImpl(data);
    });
  }

  componentWillUnmount() {
    EventBus.clearAllListeners();
  }

  _refreshLocalData() {
    DeviceStorage.save(DeviceStorage.KEY_LOCAL_DATA, this.state.dataList).then(
      data => {
        logi('save data ', data);
      },
    );
  }

  _insertNewlifeLineImpl(data) {
    this._insertItemToDB(data, this.props.baby.babyId);
    // 插入到最新的数据，这里还是根据时间进行设置
    let dataList = this._insertItemByResortTime(this.state.dataList, data);
    this.setState(
      {
        dataList: dataList,
      },
      () => {
        this._refreshStaticsCharts();
      },
    );
    // this.state.dataList.unshift(this.cloneType)
    this._refreshLocalData();
  }

  _renderTypeIcon() {}

  _renderTypeItem(item, index) {
    let typeName = item.name;
    let time = moment(item.time).format('yyyy-MM-DD HH:mm');
    let tags = item.selectedTags;

    let tagView = null;
    if (tags && tags.length > 0) {
      tagView = renderTagList(tags, [], null, true);
    }

    logi('render type item ', item);
    // 根据typeId查找type
    let type = mainData.typeMapList.filter(
      value => value.id === item.typeId,
    )[0];
    return (
      <TouchableHighlight
        onLongPress={() => {
          // 弹出删除弹窗
          this._showDeleteDialog(item, index);
        }}
        underlayColor={Colors.grayD3}
        activeOpacity={1}
        onPress={() => {
          // 进入详情
          this._gotoItemDetail(item);
        }}
        key={item.time}
        style={[styles.timelineItemContainer, {marginTop: Margin.vertical}]}>
        <View style={[commonStyles.flexRow]}>
          <View style={styles.timelineItemType}>
            <Image
              style={{width: 30, height: 30, padding: Margin.smalHorizontal}}
              source={type.icon}
            />
          </View>
          <View style={styles.timelineItemContent}>
            <Text style={[styles.rowTitleText]}>宝宝{item.name}啦</Text>
            <Text
              style={[styles.rowCommonText, {marginTop: Margin.midHorizontal}]}>
              时间：{time}
            </Text>
            {item.dose ? (
              <Text
                style={[
                  {marginTop: Margin.midHorizontal},
                  styles.rowCommonText,
                ]}>
                剂量：{item.dose}ml
              </Text>
            ) : null}
            {item.typeId === commonTypeList[3].id ? (
              <View style={commonStyles.flexRow}>
                <Text style={[styles.rowCommonText]}>
                  {' '}
                  头：{item.jaundiceValue.header}
                </Text>
                <Text style={[styles.rowCommonText]}>
                  {' '}
                  胸口：{item.jaundiceValue.chest}
                </Text>
              </View>
            ) : null}
            {item.typeId === commonTypeList[6].id ? (
              <Text
                style={[
                  {marginTop: Margin.midHorizontal},
                  styles.rowCommonText,
                ]}>
                身高：{item.height} cm
              </Text>
            ) : null}
            {item.typeId === commonTypeList[7].id ? (
              <Text
                style={[
                  {marginTop: Margin.midHorizontal},
                  styles.rowCommonText,
                ]}>
                体重：{item.weight} kg
              </Text>
            ) : null}
            {tagView ? (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: Margin.vertical,
                }}>
                {tagView}
              </View>
            ) : null}
            {item.remark ? (
              <Text style={{marginTop: Margin.midHorizontal}}>
                {item.remark}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _toggleDatetimePicker(open: Boolean) {
    this.setState({
      datepickerOpen: open,
    });
  }

  _renderDatetimePicker() {
    let datetime = this.cloneType ? new Date(this.cloneType?.time) : new Date();
    return (
      <DatePicker
        is24hourSource="locale"
        open={this.state.datepickerOpen}
        date={datetime}
        modal={true}
        mode={'datetime'}
        onConfirm={date => {
          // 确认选择，将日期转为时间戳
          this.cloneType.time = moment(date).valueOf();
          let formatTime = moment(this.cloneType.time).format(
            'yyyy-MM-DD HH:mm',
          );
          logi('confirm date', date + ' # ' + formatTime);
          this._toggleDatetimePicker(false);
        }}
        onCancel={() => {
          this.setState({
            datepickerOpen: false,
          });
        }}
      />
    );
  }

  // 进入详情
  _gotoItemDetail(item: any) {
    logi('detail item', item);
    this.props.navigation.navigate('NewLifeDetailScreen', {data: item});
  }

  _deleteRow(index: Number) {
    // 删除数据
    let dataList = this.state.dataList;
    dataList.splice(index, 1);
    this.setState({
      dataList: dataList,
    });
    this._refreshLocalData();
    // 数据库删除数据
    this._refreshStaticsCharts();
  }

  // 插入数据到数据库
  async _insertItemToDB(data, babyId) {
    await insertData(App.db, data, encodeFuc(JSON.stringify(data)), babyId);
  }

  // 重新排序记录，根据时间插入
  _insertItemByResortTime(dataList, newData) {
    if (!newData) {
      return dataList;
    }
    if (dataList && dataList.length > 0) {
      if (dataList[0].time < newData.time) {
        dataList.unshift(newData);
      } else {
        for (let i = 0; i < dataList.length; i++) {
          let value = dataList[i];
          if (value.time < newData.time) {
            dataList.splice(i, 0, newData);
            return dataList;
          }
        }
        dataList.push(newData);
      }
    } else {
      dataList = [newData];
    }
    return dataList;
  }

  // 刷新统计数据图标
  _refreshStaticsCharts() {
    // setTimeout(() => {
    //     this._refreshLast24HourCharts()
    //     this._refreshTodayCharts()
    // }, 0)
    this.staticsViewRef.refreshData();
  }

  _initEcharts() {
    if (this.todayChartRef) {
      this.todayCharts = echarts.init(this.todayChartRef, 'light', {
        renderer: 'svg',
        width: screenW,
        height: screenW * 0.6,
      });
    }
    if (this.last24HourChartRef) {
      this.last24HourCharts = echarts.init(this.last24HourChartRef, 'light', {
        renderer: 'svg',
        width: screenW,
        height: screenW * 0.6,
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.scrollContainer}>
          <View style={styles.timelineContainer}>
            <FlatList
              data={this.state.dataList}
              renderItem={({item, index}) => {
                if (item.itemType === 1) {
                  return this._renderLifeLineStatics();
                } else {
                  return this._renderTypeItem(item, index);
                }
              }}
            />
          </View>
        </View>
        <AddNewLifeModal
          addNewLifeline={item => {
            this._insertNewlifeLineImpl(item);
          }}
          currentAddType={this.currentAddType}
          ref={ref => (this.newlifeModalRef = ref)}
        />
        {this._renderDatetimePicker()}
        {/*{this._renderExportAction()}*/}
      </View>
    );
  }

  private _renderLifeLineStatics() {
    return (
      <View style={[styles.staticsContainer, {}]}>
        <StaticsView
          ref={ref => (this.staticsViewRef = ref)}
          dataList={this.state.dataList}
        />
      </View>
    );
  }

  _showDeleteDialog(item: any, index: Number) {
    Alert.alert(
      '提示',
      '确认删除' + item.name + '吗？',
      [
        {
          text: '取消',
          onPress: () => {},
        },
        {
          text: '删除',
          onPress: () => {
            this._deleteRow(index);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      },
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  staticsContainer: {},
  timelineContainer: {
    flex: 1,
  },
  timelineItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
  },
  timelineItemContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  timelineItemType: {
    width: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  btnCreate: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 48,
    bottom: 128,
    backgroundColor: '#ff0000',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  addModalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#00000033',
  },
  addContentContainer: {
    width: '80%',
    minHeight: 400,
    backgroundColor: '#ffffff',
    shadowColor: '#bbbbbb',
    borderRadius: 12,
  },
  modalFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnModalFooter: {
    height: 48,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    height: 1,
    backgroundColor: '#bbbbbb',
  },
  emptyViewContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  photoLeftBtn: {
    alignItems: 'center',
    bottom: 0,
    left: 0,
    top: 0,
    justifyContent: 'center',
    position: 'absolute',
    width: 75,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    right: 75,
  },
  backRightBtnRight: {
    right: 0,
  },
  backTextWhite: {
    color: '#ffffff',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  exportActionsContainer: {
    position: 'absolute',
    bottom: 180,
    right: 48,
    width: 60,
    height: 148,
    display: 'flex',
    flexDirection: 'column',
  },
  btnExportAction: {
    width: 60,
    color: 'white',
    height: 60,
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  rowCommonText: {
    fontSize: 16,
    color: Colors.black333,
  },
  rowTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black333,
  },
});
