// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知
// 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加

import React from 'react';
import moment from 'moment';
import {
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {logi} from '../utils/logutil';
import DatePicker from 'react-native-date-picker';
import {AndroidPermissions} from '../utils/permissionUtils';
import {BarChart, LineChart} from 'echarts/charts';
import * as echarts from 'echarts/core';
import {SVGRenderer} from '@wuba/react-native-echarts/svgChart';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import {getIconByTypeId, isIOS, screenW} from '../utils/until';
import {mainData, commonTypeList, TYPE_ID, staticsTypeList} from '../mainData';
import StaticsView from './StaticsView';
import EventBus from '../utils/eventBus';
import {
  deleteDataByRowId,
  getDataList,
  insertData,
  updateData,
} from '../utils/dbService';
import {decodeFuc, encodeFuc} from '../utils/base64';
import {renderTagList} from './commonViews';
import {commonStyles} from '../commonStyle';
import {Margin} from '../space';
import {Colors} from '../colors';
import {db} from '../dataBase.ts';
import {SwipeListView} from 'react-native-swipe-list-view';

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
  private staticsViewRef = null; // 统计数据view
  private cloneType = null; // 临时保存type的数据
  private newlifeModalRef = null;
  private currentPage = 0;
  private pageSize = 20;
  private totalPage = 0; // 数据总的页数
  private closeTimeoutMap = new Map();

  constructor(props) {
    super(props);
    this.state = {
      dataList: tempJsonData.dataList, // 本地的存储的数据列表
      showAddModal: false,
      datepickerOpen: false,
      refreshing: true,
    };
  }

  componentDidMount() {
    this._initData();
  }

  _initData() {
    if (isIOS()) {
      this._getDBData(0);
    } else {
      AndroidPermissions.checkStoragePermissions(
        () => {
          // this._initLocalData()
          this._getDBData(0);
        },
        () => {
          // 没有存储权限
        },
      );
    }
  }

  async _getDBData(page: number) {
    try {
      let dbDataList = await getDataList(
        db.database,
        this.props.baby.babyId,
        page,
        this.pageSize,
      );
      let dataList = dbDataList.dataList;
      this.totalPage = dbDataList.page.totalPage;
      let tempDataList = [];
      if (page === 0) {
        // 如果第一个不是统计则添加统计
        if (dataList.length === 0) {
          dataList.push({itemType: 1});
        } else if (dataList[0].itemType !== 1) {
          dataList.unshift({itemType: 1});
        }
        tempDataList = dataList;
      } else {
        tempDataList = this.state.dataList.concat(dataList);
      }

      this.setState(
        {
          refreshing: false,
          dataList: tempDataList,
        },
        () => {
          if (page === 0) {
            this.staticsViewRef?.refreshData();
          }
        },
      );
    } catch (e: any) {
      this.setState({
        refreshing: false,
      });
      logi('get data error', e);
    }
  }

  componentWillUnmount() {
    EventBus.clearAllListeners();
  }

  _editNewlifeLineImpl(data) {
    this._editItemInDB(data, mainData.babyInfo.babyId);
    // 插入到最新的数据，这里还是根据时间进行设置
    let dataList = this._editItemByResortTime(this.state.dataList, data);
    this._refreshStaticsCharts();
    this.setState({
      dataList: dataList,
    });
  }

  async _insertNewlifeLineImpl(data: any) {
    await this._insertItemToDB(data, mainData.babyInfo.babyId);
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
  }

  _renderMilkItem(item, index) {
    let time = moment(item.time).format('yyyy-MM-DD HH:mm');
    let tags = item.selectedTags;

    let tagView = null;
    if (tags && tags.length > 0) {
      tagView = renderTagList(tags, [], null, true);
    }

    // 根据typeId查找type
    let type = commonTypeList[0];
    return (
      <TouchableHighlight
        onLongPress={() => {
          // 弹出删除弹窗
          this._showDeleteDialog(item, index);
        }}
        underlayColor={Colors.grayEe}
        activeOpacity={1}
        onPress={() => {
          // 进入详情
          this._gotoItemDetail(item);
        }}
        key={item.time + '_' + item.typeId}
        style={[styles.timelineItemContainer, {marginBottom: Margin.vertical}]}>
        <View style={[commonStyles.flexRow]}>
          <View style={styles.timelineItemType}>
            {getIconByTypeId(item.typeId, 30)}
          </View>
          <View style={styles.timelineItemContent}>
            <Text style={[styles.rowTitleText]}>宝宝{item.name}啦</Text>
            <Text
              style={[styles.rowCommonText, {marginTop: Margin.midHorizontal}]}>
              时间：{time}
            </Text>
            {item.isMotherMilk ? (
              <Text
                style={[
                  {marginTop: Margin.midHorizontal},
                  styles.rowCommonText,
                ]}>
                左边：{item.leftTime}分钟 右边：{item.rightTime}分钟
              </Text>
            ) : (
              <Text
                style={[
                  {marginTop: Margin.midHorizontal},
                  styles.rowCommonText,
                ]}>
                剂量：{item.dose}ml
              </Text>
            )}
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

  _renderGrowthItem(item, index) {
    let time = moment(item.time).format('yyyy-MM-DD');
    let tags = item.selectedTags;

    let tagView = null;
    if (tags && tags.length > 0) {
      tagView = renderTagList(tags, [], null, true);
    }

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
        underlayColor={Colors.grayEe}
        activeOpacity={1}
        onPress={() => {
          // 进入详情
          this._gotoItemDetail(item);
        }}
        key={item.time + '_' + item.typeId}
        style={[styles.timelineItemContainer, {marginBottom: Margin.vertical}]}>
        <View style={[commonStyles.flexRow]}>
          <View style={styles.timelineItemType}>
            {getIconByTypeId(item.typeId, 30)}
          </View>
          <View style={styles.timelineItemContent}>
            <Text style={[styles.rowTitleText]}>宝宝{item.name}</Text>
            <Text
              style={[styles.rowCommonText, {marginTop: Margin.midHorizontal}]}>
              时间：{time}
            </Text>
            {item.typeId === commonTypeList[3].id ? (
              <View
                style={[
                  commonStyles.flexRow,
                  {marginTop: Margin.midHorizontal},
                ]}>
                <Text style={[styles.rowCommonText]}>
                  {'额头：'}
                  {item.jaundiceValue.header}
                </Text>
                <Text
                  style={[
                    styles.rowCommonText,
                    {marginLeft: Margin.horizontal},
                  ]}>
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

  _renderDefaultItem(item, index) {
    let time = moment(item.time).format('yyyy-MM-DD HH:mm');
    let tags = item.selectedTags;

    let tagView = null;
    if (tags && tags.length > 0) {
      tagView = renderTagList(tags, [], null, true);
    }

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
        underlayColor={Colors.grayEe}
        activeOpacity={1}
        onPress={() => {
          // 进入详情
          this._gotoItemDetail(item);
        }}
        key={item.typeId + '_' + item.time}
        style={[styles.timelineItemContainer, {marginBottom: Margin.vertical}]}>
        <View style={[commonStyles.flexRow]}>
          <View style={styles.timelineItemType}>
            {getIconByTypeId(item.typeId, 30)}
          </View>
          <View style={styles.timelineItemContent}>
            <Text style={[styles.rowTitleText]}>宝宝{item.name}啦</Text>
            <Text
              style={[styles.rowCommonText, {marginTop: Margin.midHorizontal}]}>
              时间：{time}
            </Text>
            {item.typeId === commonTypeList[3].id ? (
              <View
                style={[
                  commonStyles.flexRow,
                  {marginTop: Margin.midHorizontal},
                ]}>
                <Text style={[styles.rowCommonText]}>
                  {'额头：'}
                  {item.jaundiceValue.header}
                </Text>
                <Text
                  style={[
                    styles.rowCommonText,
                    {marginLeft: Margin.horizontal},
                  ]}>
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

  _renderTypeItem(item, index) {
    commonTypeList.forEach(value => {
      if (item.typeId === value.id) {
        item.icon = value.icon;
        return;
      }
    });
    console.log('render baby item ', item);

    switch (item.typeId) {
      case TYPE_ID.MILK:
        return this._renderMilkItem(item, index);
      case TYPE_ID.WEIGHT:
      case TYPE_ID.HEIGHT:
        return this._renderGrowthItem(item, index);
      default:
        return this._renderDefaultItem(item, index);
    }
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
    this.props.onItemClick && this.props.onItemClick(item);
  }

  async _deleteRow(item: any, index: Number) {
    // 数据库删除数据
    await deleteDataByRowId(db.database, item.rowid);
    // 删除数据
    let dataList = this.state.dataList;
    dataList.splice(index, 1);
    // 刷新统计信息
    this._refreshStaticsCharts();
    this.setState({
      dataList: dataList,
    });
  }

  async _editItemInDB(data, babyId) {
    logi('edit item to db data', data);
    await updateData(
      db.database,
      data,
      encodeFuc(JSON.stringify(data)),
      babyId,
    );
  }

  // 插入数据到数据库
  async _insertItemToDB(data, babyId) {
    try {
      let insertRes = await insertData(
        db.database,
        data,
        encodeFuc(JSON.stringify(data)),
        babyId,
      );
      console.log('insert new item res', insertRes);
    } catch (e) {
      console.log('insert errr', e);
    }
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

  _editItemByResortTime(dataList, newData) {
    logi('_edit item by time');
    if (!newData) {
      return dataList;
    }
    if (dataList && dataList.length > 0) {
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].rowid === newData.rowid) {
          logi('edit datalist', dataList[i], newData);
          dataList[i] = newData;
        }
      }
    } else {
      dataList = [newData];
    }
    return dataList;
  }

  insertNewData(data) {
    if (data.rowid) {
      // 编辑
      this._editNewlifeLineImpl(data);
    } else {
      data.rowid = data.time;
      // 新增
      this._insertNewlifeLineImpl(data);
    }
  }

  refreshData() {
    this.setState({
      refreshing: true,
    });
    this._refreshStaticsCharts();
    this.currentPage = 0;
    this._getDBData(this.currentPage);
  }

  // 刷新统计数据图标
  _refreshStaticsCharts() {
    this.staticsViewRef?.refreshData();
  }

  _closeRow(rowMap, rowKey) {
    rowMap[rowKey]?.closeRow();
  }

  // 复制当前数据
  _copyItem(item) {
    let cloneItem = JSON.parse(JSON.stringify(item));
    let now = moment().valueOf();
    cloneItem.time = now;
    cloneItem.rowid = now;
    cloneItem.key = now;
    console.log('clone item', item);
    // 插入到数据库，刷新列表
    this._insertNewlifeLineImpl(cloneItem);
  }

  _showRemoveItemDialog(item: any, index: Number) {
    console.log('remove item', item);
    Alert.alert(
      '提示',
      '确认移除' + (item.name ? item.name : '当前数据') + '吗？',
      [
        {
          text: '取消',
          onPress: () => {},
        },
        {
          text: '删除',
          onPress: () => {
            this._deleteRow(item, index);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      },
    );
  }

  _renderHiddenItem(item, rowMap, index) {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[
            styles.backLeftBtn,
            {
              backgroundColor: Colors.primary,
              borderTopLeftRadius: Margin.bigCorners,
              borderBottomLeftRadius: Margin.bigCorners,
              marginBottom: Margin.vertical,
            },
          ]}
          onPress={() => {
            this._closeRow(rowMap, item.time + '');
            setTimeout(() => {
              this._showRemoveItemDialog(item, index);
            }, 300);
          }}>
          <Text style={styles.backTextWhite}>删除</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.backRightBtn,
            {
              borderTopRightRadius: Margin.bigCorners,
              borderBottomRightRadius: Margin.bigCorners,
              backgroundColor: Colors.primary5,
              marginBottom: Margin.vertical,
            },
          ]}
          onPress={() => {
            // this.deleteRow(rowMap, data.item.key, data.item);
            this._closeRow(rowMap, item.time + '');
            setTimeout(() => {
              this._copyItem(item);
            }, 300);
          }}>
          <Text style={styles.backTextWhite}>复制</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _scheduleCloseRow(rowKey, rowMap) {
    if (this.closeTimeoutMap.has(rowKey)) {
      clearTimeout(this.closeTimeoutMap.get(rowKey));
      this.closeTimeoutMap.delete(rowKey);
    }
    let closeTimeout = setTimeout(() => {
      this._closeRow(rowMap, rowKey);
      this.closeTimeoutMap.delete(rowKey);
    }, 3000);
    this.closeTimeoutMap.set(rowKey, closeTimeout);
  }

  render() {
    return (
      <View style={[styles.container, {}]}>
        <SwipeListView
          onEndReached={() => {
            console.log('list reach end');
            if (this.currentPage < this.totalPage) {
              this.currentPage++;
              this._getDBData(this.currentPage);
            } else {
              console.log('no data');
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                console.log('on refresh control');
                this.currentPage = 0;
                // 刷新数据
                this._getDBData(0);
              }}
            />
          }
          useFlatList={true}
          data={this.state.dataList}
          style={{flex: 1, paddingHorizontal: Margin.horizontal}}
          renderItem={({item, index}) => {
            if (item.itemType === 1) {
              return this._renderLifeLineStatics();
            } else {
              return this._renderTypeItem(item, index);
            }
          }}
          keyExtractor={(rowData, index) => {
            return rowData?.time + '';
          }}
          renderHiddenItem={(data, rowMap) => {
            let item = data.item;
            if (item.itemType === 1) {
              return null;
            } else {
              return this._renderHiddenItem(item, rowMap, data.index);
            }
          }}
          leftOpenValue={75}
          rightOpenValue={-75}
          previewOpenValue={-40}
          previewOpenDelay={1000}
          onRowDidOpen={(rowKey, rowMap, toValue) => {
            this._scheduleCloseRow(rowKey, rowMap);
          }}
        />
        {this._renderDatetimePicker()}
        {/*{this._renderExportAction()}*/}
      </View>
    );
  }

  private _renderLifeLineStatics() {
    return (
      <View style={[styles.staticsContainer, {marginBottom: Margin.vertical}]}>
        <StaticsView
          ref={ref => (this.staticsViewRef = ref)}
          dataList={this.state.dataList}
          babyId={this.props.baby.babyId}
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
            this._deleteRow(item, index);
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
    right: 2,
    width: 85,
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
  backLeftBtn: {
    left: 2,
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 85,
  },
});
