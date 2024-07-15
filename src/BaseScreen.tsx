import React from 'react';
import {KeyboardAvoidingView, SafeAreaView, View} from 'react-native';

export default class BaseScreen extends React.Component<any, any> {
  render() {
    return <SafeAreaView style={{flex: 1}}>{this.renderScreen()}</SafeAreaView>;
  }

  renderScreen() {
    return <View></View>;
  }
}
