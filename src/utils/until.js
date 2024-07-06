// 屏幕宽度
import {Dimensions} from 'react-native';
import moment from 'moment';
import {type} from 'yarn/lib/cli';

export const screenW = Dimensions.get('window').width;
// 屏幕高度
export const screenH = Dimensions.get('window').height;

// 格式化日期
export const formatTimeToDate = date => {
  return moment(date).format('yyyy-MM-DD');
};

export const formatTime = date => {
  return moment(date).format('yyyy-MM-DD HH:mm');
};

// 字符串为空
export const isEmpty = str => {
  return (
    str === undefined ||
    str === null ||
    typeof str !== 'string' ||
    str.trim().length === 0
  );
};
