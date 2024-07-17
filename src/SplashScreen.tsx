import React from 'react';
import {View} from 'react-native';
import {DeviceStorage} from './utils/deviceStorage';
import {createLifeRecordTable, getDBConnection} from './utils/dbService';
import {logi} from './utils/logutil';
import BaseScreen from './BaseScreen.tsx';
import LottieView from 'lottie-react-native';
import {db} from './dataBase.ts';

export default class SplashScreen extends React.Component<any, any> {
  componentDidMount() {
    // DeviceStorage.refreshMainData();

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

  render() {
    return (
      <View style={{flex: 1}}>
        <LottieView
          resizeMode={'cover'}
          source={require('./animations/splash_animation.json')}
          style={{width: '100%', height: '100%'}}
          autoPlay
          loop={false}
        />
      </View>
    );
  }
}
