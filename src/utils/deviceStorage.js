import AsyncStorage from "@react-native-async-storage/async-storage";

export class DeviceStorage {
    /**
     * 获取  */
    static get(key) {
        return AsyncStorage.getItem(key).then((value) => {
            const jsonValue = JSON.parse(value);
            return jsonValue;
        }).catch(error => {
            return null;
        });
    }

    /**
     * 保存 */
    static save(key, value) {
        return AsyncStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * 更新  */
    static update(key, value) {
        return DeviceStorage.get(key).then((item) => {
            value = typeof value === 'string' ? value : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value));
        });
    }

    /**
     * 删除 */
    static delete(key) {
        return AsyncStorage.removeItem(key);
    }
}