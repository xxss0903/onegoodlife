import {NativeModules} from 'react-native';

export const nativeModel = {}
nativeModel.initPrivacy = (callback) => {
    NativeModules.NativeModel.initPrivacy(callback);
};
