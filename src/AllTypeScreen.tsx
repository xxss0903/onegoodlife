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
import {logi} from './utils/logutil';

// 存储本地数据的key
const KEY_LOCAL_DATA = 'key_local_key';

// 所有类型界面，选择类型然后添加
export default class AllTypeScreen extends React.Component<any, any> {
  private currentAddType = null; // 当前的添加类型
  private newlifeModalRef = null;

  constructor(props) {
    super(props);
    this.state = {
      datepickerOpen: false,
      birthDay: moment(mainData.babyInfo.birthDay).valueOf(),
    };
  }

  _renderItem(value, index) {
    return (
      <TouchableOpacity
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

  _addNewLifeline(type) {
    this.newlifeModalRef.addNewType(type);
  }

  _renderOtherItem() {
    let otherType = [];
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
  _insertNewlifeLineImpl(data) {
    EventBus.sendEvent(EventBus.REFRESH_DATA, data);
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text>常用类型</Text>
          <View>{this._renderCommonItem()}</View>
        </View>
        <View>
          <Text>全部类型</Text>
          <View>{this._renderOtherItem()}</View>
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
