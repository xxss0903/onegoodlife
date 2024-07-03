import React from 'react';
import {View} from 'react-native';

export default class BaseScreen extends React.Component<any, any> {
  render() {
    return <View>{this.renderScreen()}</View>;
  }

  renderScreen() {
    return undefined;
  }
}
