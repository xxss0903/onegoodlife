/**
 * react-native中js的event事件发送监听
 */

import {DeviceEventEmitter} from 'react-native';

export default class EventBus {
  static listeners = [];
  static listenersMap = new Map();

  // 登录状态
  static REFRESH_DATA = 'REFRESH_DATA';
  static REFRESH_BABY_INFO = 'REFRESH_BABY_INFO';
  // 移除统计i卡片
  static REMOVE_CARD = 'REMOVE_CARD';
  // 刷新背景颜色
  static REFRESH_GRADIENT_COLOR = 'REFRESH_GRADIENT_COLOR';
  // 刷新宝宝列表，首页要进行更新
  static REFRESH_BABY_LIST = 'REFRESH_BABY_LIST';
  // 插入新的数据
  static INSERT_NEW_LIFETIME = 'INSERT_NEW_LIFETIME';
  static REFRESH_BABIES_SCREEN = 'REFRESH_BABIES_SCREEN';
  // 刷新用户信息
  static REFRESH_USER_INFO = 'REFRESH_USER_INFO';

  static sendEvent = (key, value) => {
    DeviceEventEmitter.emit(key, value);
  };

  static addEventListener = (key, callback) => {
    const listener = DeviceEventEmitter.addListener(key, callback);
    this.listeners.push(listener);
    return listener;
  };

  static clearAllListeners() {
    if (this.listeners && this.listeners.length > 0) {
      this.listeners.forEach(value => {
        value.remove();
      });
    }
  }
}
