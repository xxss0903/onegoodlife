import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {mainData} from './mainData';
import {SwipeListView} from 'react-native-swipe-list-view';
import {formatTimeToDate} from './utils/until';
import {commonStyles} from './commonStyle';
import EventBus from './utils/eventBus';

export default class BabiesScreen extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      datepickerOpen: false,
    };
  }

  _editBaby(baby) {
    this.props.navigation.navigate('BabyInfoScreen', {
      baby: baby,
      callback: () => {
        this.forceUpdate();
      },
    });
  }

  _renderBabyItem(item, index) {
    return (
      <TouchableOpacity
        onPress={() => {
          this._editBaby(item);
        }}
        style={[
          commonStyles.flexColumn,
          {
            backgroundColor: '#ffffff',
            padding: 12,
            borderRadius: 12,
            marginTop: 12,
          },
        ]}>
        <Text>{item.nickname}</Text>
        <Text>{formatTimeToDate(item.birthDay)}</Text>
      </TouchableOpacity>
    );
  }

  onRowDidOpen = (rowKey, rowMap) => {};

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  deleteRow = (rowMap, rowKey, data) => {
    this.closeRow(rowMap, rowKey);
    let index = mainData.babies.indexOf(data);
    mainData.babies.splice(index, 1);
    EventBus.sendEvent(EventBus.REFRESH_BABY_LIST);
    this.forceUpdate();
  };

  _addNewBaby() {
    this.props.navigation.navigate('BabyInfoScreen');
  }

  render() {
    return (
      <View style={[styles.container, {flex: 1}]}>
        <View style={[commonStyles.flexColumn, {flex: 1}]}>
          <SwipeListView
            data={mainData.babies}
            renderItem={({item, index}) => {
              return this._renderBabyItem(item, index);
            }}
            renderHiddenItem={(data, rowMap) => {
              return (
                <View style={styles.rowBack}>
                  <TouchableOpacity
                    style={[styles.backRightBtn, styles.backRightBtnRight]}
                    onPress={() => {
                      this.deleteRow(rowMap, data.item.key, data.item);
                    }}>
                    <Text style={styles.backTextWhite}>删除</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            rightOpenValue={-75}
            previewOpenValue={-40}
            previewOpenDelay={1000}
            onRowDidOpen={(rowKey, rowMap, toValue) =>
              this.onRowDidOpen(rowKey, rowMap)
            }
          />
        </View>
        <View style={[commonStyles.flexRow, {height: 60}]}>
          <TouchableOpacity
            onPress={() => {
              this._addNewBaby();
            }}
            style={[{flex: 1}, commonStyles.center]}>
            <Text>添加宝宝</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  titleImg: {
    width: 20,
    height: 20,
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
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
});
