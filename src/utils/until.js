// 屏幕宽度
import {Dimensions, Image, Platform} from 'react-native';
import moment from 'moment';
import {type} from 'yarn/lib/cli';
import {Margin} from '../space';
import React from 'react';
import {TYPE_ID} from '../mainData';

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

export const isIOS = () => {
  return Platform.OS === 'ios';
};

export const ChartWidth = screenW - Margin.horizontal * 6;

/**
 *   MILK: 1, // 喝奶
 *   POOP: 2, // 拉屎
 *   PEE: 3, // 撒尿
 *   JAUNDICE: 4, // 黄疸
 *   SPITMILK: 5, // 吐奶
 *   OTHER: 6, // 其他
 *   HEIGHT: 7, // 身高
 *   WEIGHT: 8, // 体重
 *   DIAPER: 9, // 尿布
 *   VACCINE: 10, // 疫苗
 * @param typeId
 * @param size
 * @returns {Element}
 */
export const getIconByTypeId = (typeId, size = 20) => {
  let icon;
  let style = {
    width: size,
    height: size,
    marginRight: Margin.smalHorizontal,
  };
  switch (typeId) {
    case TYPE_ID.SPITMILK:
      icon = (
        <Image style={style} source={require('../assets/ic_spitting.png')} />
      );
      break;
    case TYPE_ID.OTHER:
      icon = <Image style={style} source={require('../assets/ic_other.png')} />;
      break;
    case TYPE_ID.DIAPER:
      icon = (
        <Image style={style} source={require('../assets/ic_pee_wrapper.png')} />
      );
      break;
    case TYPE_ID.VACCINE:
      icon = (
        <Image style={style} source={require('../assets/ic_vaccine.png')} />
      );
      break;
    case TYPE_ID.MILK:
      icon = <Image style={style} source={require('../assets/ic_milk.png')} />;
      break;
    case TYPE_ID.POOP:
      icon = <Image style={style} source={require('../assets/ic_poop.png')} />;
      break;
    case TYPE_ID.JAUNDICE:
      icon = (
        <Image style={style} source={require('../assets/ic_jaundice.png')} />
      );
      break;
    case TYPE_ID.PEE:
      icon = <Image style={style} source={require('../assets/ic_pee.png')} />;
      break;
    case TYPE_ID.WEIGHT:
      icon = (
        <Image style={style} source={require('../assets/ic_weight.png')} />
      );
      break;
    case TYPE_ID.HEIGHT:
      icon = (
        <Image style={style} source={require('../assets/ic_height.png')} />
      );
      break;
  }
  return icon;
};
