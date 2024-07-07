import React from 'react';
import {View, StyleSheet} from 'react-native';
import {commonStyles} from './commonStyle';
import {Colors} from './colors';
import BaseScreen from './BaseScreen.tsx';

export default class PrivacyScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderScreen() {
    return (
      <View
        style={[
          styles.container,
          commonStyles.flexColumn,
          {backgroundColor: Colors.white, flex: 1},
        ]}></View>
    );
  }
}

const styles = StyleSheet.create({
  userInfoContainer: {
    height: 200,
  },
  container: {},
  titleImg: {
    width: 20,
    height: 20,
  },
});
