import React from 'react';
import {SafeAreaView, View} from 'react-native';

export default class BaseScreen extends React.Component<any, any> {
  render() {
    return <SafeAreaView>{this.renderScreen()}</SafeAreaView>;
  }

  renderScreen() {
    return <View></View>;
  }
}
