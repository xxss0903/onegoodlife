import React from 'react';
import {View} from 'react-native';

export default class BaseScreen extends React.Component<any, any> {
  render() {
    return <View style={{flex: 1}}>{this.renderScreen()}</View>;
  }

  renderScreen() {
    return <View></View>;
  }
}
