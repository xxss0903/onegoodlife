import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native';
import {commonStyles} from './commonStyle';
import moment from 'moment';
import {mainData} from './mainData';
import AddNewLifeModal from './components/AddNewLifeModal';
import EventBus from './utils/eventBus';
import {screenW} from './utils/until';
import {Margin} from './space';
import {Colors} from './colors';
import BaseScreen from './BaseScreen.tsx';
import LinearGradient from 'react-native-linear-gradient';
// 所有类型界面，选择类型然后添加
export default class AllTypeScreen extends BaseScreen {
  private currentAddType = null; // 当前的添加类型
  private newlifeModalRef = null;

  constructor(props: any) {
    super(props);
    this.state = {
      datepickerOpen: false,
      birthDay: moment(mainData.babyInfo.birthDay).valueOf(),
    };
  }

  _renderItem(value: any, index: any) {
    return (
      <TouchableOpacity
        key={`${value.name}_${index}`}
        onPress={() => {
          // 添加类型
          this._addNewLifeline(value);
        }}
        style={[
          {
            width: (screenW - 60) / 3,
            height: 60,
            marginBottom: 12,
            borderRadius: Margin.corners,
            marginHorizontal: 6,
            backgroundColor: value.bgColor,
          },
          commonStyles.center,
        ]}>
        <View style={[commonStyles.flexRow]}>
          <Image
            style={{width: 22, height: 22, marginRight: Margin.midHorizontal}}
            source={value.icon}
          />
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
      return this._renderItem(value, index);
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

  _addNewLifeline(type: any) {
    this.newlifeModalRef.addNewType(type);
  }

  _renderOtherItem() {
    let otherType: any[] = [];
    mainData.typeMapList.forEach(value => {
      let isCommon = false;
      mainData.commonActions.forEach(value2 => {
        if (value.id === value2.id) {
          isCommon = true;
        }
      });
      if (!isCommon) {
        otherType.push(value);
      }
    });
    console.log('render other type', otherType);
    let view = otherType.map((value, index) => {
      return this._renderItem(value, index);
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
