import React from 'react';
import {View} from 'react-native';
import {commonStyles} from './commonStyle';

export default class BaseScreen extends React.Component<any, any> {
  render() {
    return (
      <View style={[commonStyles.flexColumn, {flex: 1}]}>
        {this.renderScreen()}
      </View>
    );
  }

  renderScreen() {
    return <View></View>;
  }
}
