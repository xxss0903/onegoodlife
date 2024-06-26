import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import moment from 'moment';
import {commonStyles} from '../commonStyle';
import EventBus from '../utils/eventBus';

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
      <View style={[{flex: 1, padding: 12}, commonStyles.center]}>
        {this.props.baby.avatar ? (
          <Image
            style={{width: 48, height: 48, borderRadius: 24}}
            source={{
              uri: this.props.baby.avatar,
            }}
          />
        ) : null}
        <Text>昵称：{this.props.baby.nickname}</Text>
        <Text>宝宝出生：{this._getBirthDay()}天啦</Text>
      </View>
    );
  }
}
