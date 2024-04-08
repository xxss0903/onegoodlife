// 屏幕宽度
import {Dimensions} from "react-native";
import moment from "moment";

export const screenW = Dimensions.get('window').width;
// 屏幕高度
export const screenH = Dimensions.get('window').height;

// 格式化日期
export const formatTimeToDate = (date) => {
    return moment(date).format("yyyy-MM-DD")
}

export const formatTime = (date) => {
    return moment(date).format("yyyy-MM-DD HH:mm")
}