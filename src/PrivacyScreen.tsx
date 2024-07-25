import React from 'react';
import {View, StyleSheet} from 'react-native';
import {commonStyles} from './commonStyle';
import {Colors} from './colors';
import BaseScreen from './BaseScreen.tsx';
import WebView from "react-native-webview";
import {isIOS} from "./utils/until.js";

export default class PrivacyScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
        hideInsets: true
    };
  }

  renderScreen() {
      return (
      <View
        style={[
          styles.container,
          commonStyles.flexColumn,
          {flex: 1},
        ]}>
          <WebView source={require('./assets/privacy.html')}/>
      </View>
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
