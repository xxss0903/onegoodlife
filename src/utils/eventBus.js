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
  // 刷新宝宝列表，首页要进行更新
  static REFRESH_BABY_LIST = 'REFRESH_BABY_LIST';
  // 插入新的数据
  static INSERT_NEW_LIFETIME = 'INSERT_NEW_LIFETIME';

  static sendEvent = (key, value) => {
    DeviceEventEmitter.emit(key, value);
  };

  static addEventListener = (key, callback) => {
    const listener = DeviceEventEmitter.addListener(key, callback);
    this.listeners.push(listener);
    this.listenersMap.set(key, listener);
    return listener;
  };

  static clearAllListeners() {
    if (this.listeners && this.listeners.length > 0) {
      this.listenersMap.clear();
      this.listeners.forEach(value => {
        value.remove();
      });
    }
  }
}
