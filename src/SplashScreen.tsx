import React from 'react';
import {View} from 'react-native';
import {DeviceStorage} from './utils/deviceStorage';
import {createLifeRecordTable, getDBConnection} from './utils/dbService';
import {logi} from './utils/logutil';
import App from '../App';
import BaseScreen from './BaseScreen.tsx';

export default class SplashScreen extends BaseScreen {
  componentDidMount() {
    setTimeout(async () => {
      await this._initDb();
      await DeviceStorage.getMainData();
      // 进入主页
      this.props.navigation.replace('MainScreen');
    }, 2000);
  }

  // 初始化数据库，首先连接本地数据库，然后如果没有表则创建表
  async _initDb() {
    try {
      // 首先创建数据库链接
      App.db = await getDBConnection();
      await createLifeRecordTable(App.db);
    } catch (e) {
      logi('init db error ', e);
    }
  }

  renderScreen() {
    return <View />;
  }
}
