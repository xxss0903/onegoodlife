import React from 'react';
import {View} from 'react-native';
import {DeviceStorage} from './utils/deviceStorage';
import {createLifeRecordTable, getDBConnection} from './utils/dbService';
import {logi} from './utils/logutil';
import BaseScreen from './BaseScreen.tsx';
import LottieView from 'lottie-react-native';
import {db} from './dataBase.ts';

export default class SplashScreen extends BaseScreen {
  componentDidMount() {
    let loadPromise = new Promise(async resolve => {
      await this._initDb();
      await DeviceStorage.getMainData();
      resolve('');
    });

    loadPromise
      .then(() => {})
      .catch(err => {
        logi('enter err', err);
      })
      .finally(() => {
        setTimeout(async () => {
          // 进入主页
          this.props.navigation.replace('MainScreen');
        }, 2500);
      });
  }

  // 初始化数据库，首先连接本地数据库，然后如果没有表则创建表
  async _initDb() {
    try {
      // 首先创建数据库链接
      db.database = await getDBConnection();
      await createLifeRecordTable(db.database);
    } catch (e: any) {
      logi('init db error ', e);
    }
  }

  renderScreen() {
    return (
      <View style={{flex: 1}}>
        <LottieView
          source={require('./animations/splash_animation.json')}
          style={{width: '100%', height: '100%'}}
          autoPlay
        />
      </View>
    );
  }
}
