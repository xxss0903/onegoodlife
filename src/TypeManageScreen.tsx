import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native';
import {commonStyles} from './commonStyle';
import moment from 'moment';
import {mainData} from './mainData';
import AddNewLifeModal from './components/AddNewLifeModal';
import EventBus from './utils/eventBus';
import {getIconByTypeId, screenW} from './utils/until';
import {Margin} from './space';
import {Colors} from './colors';
import BaseScreen from './BaseScreen.tsx';
import {DeviceStorage} from './utils/deviceStorage';

// 所有类型界面，选择类型然后添加
export default class TypeManageScreen extends BaseScreen {
  private currentAddType = null; // 当前的添加类型
  private newlifeModalRef = null;

  constructor(props: any) {
    super(props);
    this.state = {
      hideInsets: true,
      datepickerOpen: false,
      birthDay: moment(mainData.babyInfo.birthDay).valueOf(),
      otherActions: [],
    };
  }

  _getOtherActions() {
    let otherActions: any[] = [];
    mainData.typeMapList.forEach(value => {
      let isCommon = false;
      mainData.commonActions.forEach(value2 => {
        if (value.id === value2.id) {
          isCommon = true;
        }
      });
      if (!isCommon) {
        otherActions.push(value);
      }
    });
    this.setState({
      otherActions: otherActions,
    });
  }

  componentDidMount() {
    if (this.state.otherActions.length === 0) {
      this._getOtherActions();
    }
  }

  _removeCommonItem(value, index) {
    mainData.commonActions.splice(index, 1);
  }

  _addCommonItem(value, index) {
    mainData.commonActions.push(value);
  }

  _toggleCommonItem(value: any, index: any, isCommon: Boolean) {
    if (isCommon) {
      // 移除到常用类型
      this._removeCommonItem(value, index);
    } else {
      // 添加到常用类型
      this._addCommonItem(value, index);
    }
    this._getOtherActions();
    mainData.refreshBabies = true;
    DeviceStorage.refreshMainData();
  }

  _renderItem(value: any, index: any, isCommon: Boolean) {
    return (
      <TouchableOpacity
        key={`${value.name}_${index}`}
        onPress={() => {
          this._toggleCommonItem(value, index, isCommon);
        }}
        style={[
          {
            width: (screenW - 60) / 3,
            height: 60,
            marginBottom: 12,
            borderRadius: Margin.bigCorners,
            marginHorizontal: 6,
            backgroundColor: value.bgColor,
          },
          commonStyles.center,
        ]}>
        <View style={[commonStyles.flexRow]}>
          {getIconByTypeId(value.typeId, 22)}
          <Text
            style={[{color: Colors.white, fontWeight: 'bold', fontSize: 16}]}>
            {value.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderCommonItem() {
    let view = mainData.commonActions.map((value, index) => {
      return this._renderItem(value, index, true);
    });
    return (
      <View
        style={[
          {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          },
        ]}>
        {view}
      </View>
    );
  }

  _addNewLifeline(type: any) {}

  _renderOtherItem() {
    let view = this.state.otherActions.map((value, index) => {
      return this._renderItem(value, index, false);
    });
    return (
      <View
        style={[
          {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          },
        ]}>
        {view}
      </View>
    );
  }

  // 插入新的类型
  _insertNewlifeLineImpl(data: any) {
    EventBus.sendEvent(EventBus.INSERT_NEW_LIFETIME, data);
    this.props.navigation.goBack();
  }

  renderScreen() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={[commonStyles.commonContentText]}>常用类型</Text>
          <View style={{marginTop: Margin.vertical}}>
            {this._renderCommonItem()}
          </View>
        </View>
        <View>
          <Text style={[commonStyles.commonContentText]}>全部类型</Text>
          <View style={{marginTop: Margin.vertical}}>
            {this._renderOtherItem()}
          </View>
        </View>
        <AddNewLifeModal
          addNewLifeline={item => {
            this._insertNewlifeLineImpl(item);
          }}
          currentAddType={this.currentAddType}
          ref={ref => (this.newlifeModalRef = ref)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userInfoContainer: {
    height: 200,
  },
  container: {
    padding: 12,
  },
  titleImg: {
    width: 20,
    height: 20,
  },
});
