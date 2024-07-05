import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native';
import moment from 'moment';
import {DeviceStorage} from './utils/deviceStorage';
import {mainData} from './mainData';
import BaseScreen from './BaseScreen.tsx';

// 标签管理界面
export default class TypeMangeScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      datepickerOpen: false,
      birthDay: moment(mainData.babyInfo.birthDay).valueOf(),
    };
  }

  componentDidMount() {}

  // 设置出生日期等信息
  _setBirthInfo() {
    this.setState(
      {
        datepickerOpen: true,
      },
      () => {
        // 更新本地数据
        DeviceStorage.refreshMainData();
      },
    );
  }

  renderScreen() {
    return (
      <View style={styles.container}>
        <View>
          <Text>常用类型</Text>
          <View></View>
        </View>
        <View>
          <Text>全部类型</Text>
          <View></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userInfoContainer: {
    height: 200,
    backgroundColor: '#ff0000',
  },
  container: {
    padding: 12,
  },
  titleImg: {
    width: 20,
    height: 20,
  },
});
