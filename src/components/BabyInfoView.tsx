import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import moment from 'moment';
import {commonStyles} from '../commonStyle';
import EventBus from '../utils/eventBus';
import {Margin} from "../space";

export default class BabyInfoView extends Component<any, any> {
  componentDidMount() {
    EventBus.addEventListener(EventBus.REFRESH_BABY_INFO, () => {
      this.forceUpdate();
    });
  }

  _getBirthDay() {
    return moment().diff(moment(this.props.baby.birthDay), 'day');
  }

  render() {
    return (
      <View style={[{paddingHorizontal: Margin.horizontal, paddingTop: Margin.vertical}]}>
        <Text>昵称：{this.props.baby.nickname}</Text>
        <Text>宝宝出生：{this._getBirthDay()}天啦</Text>
      </View>
    );
  }
}
