/**
 * react-native中js的event事件发送监听
 */

import {DeviceEventEmitter} from 'react-native';


export default class EventBus {

    static listeners = [];
    static listenersMap = new Map();

    // 登录状态
    static REFRESH_DATA = 'REFRESH_DATA';



    static sendEvent = (key, value) => {
        DeviceEventEmitter.emit(key, value);
    };

    static addEventListener = (key, callback) => {
        if (this.listenersMap.has(key)) {
            return this.listenersMap.get(key);
        } else {
            const listener = DeviceEventEmitter.addListener(key, callback);
            this.listeners.push(listener);
            this.listenersMap.set(key, listener);
            return listener;
        }
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

