import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native';
import {commonStyles} from './commonStyle';
import {Margin, Style} from './space';
import {Colors} from './colors';
import BaseScreen from './BaseScreen.tsx';
import {isIOS} from './utils/until';

const ItemRow = (img, title, content, callback, showLine = true) => {
  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: Margin.bigTop,
          paddingHorizontal: Margin.horizontal,
          alignItems: 'center',
        }}
        onPress={callback}>
        <View style={{flexDirection: 'row'}}>
          {img}
          <Text style={{marginLeft: 8, color: Colors.black333, fontSize: 15}}>
            {title}
          </Text>
        </View>
        <View>
          <Text>{content}</Text>
        </View>
      </TouchableOpacity>
      {showLine ? <View style={commonStyles.lineWithMargin} /> : null}
    </View>
  );
};

export default class VersionScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      hideInsets: true,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  _checkiOSUpdate() {}

  _checkAndroidUpdate() {}

  _checkLatestVersion() {
    if (isIOS()) {
      this._checkiOSUpdate();
    } else {
      this._checkAndroidUpdate();
    }
  }

  renderScreen() {
    return (
      <View style={[styles.container, commonStyles.flexColumn, {flex: 1}]}>
        <View
          style={[
            commonStyles.flexColumn,
            {
              borderRadius: Margin.bigCorners,
              backgroundColor: Colors.white,
              marginTop: Margin.vertical,
              marginHorizontal: Margin.horizontal,
            },
          ]}>
          {ItemRow(
            <Image
              style={styles.titleImg}
              source={require('./assets/ic_mine_n.png')}
            />,
            '当前版本',
            '1.0.0',
            () => {},
          )}
          {ItemRow(
            <Image
              style={styles.titleImg}
              source={require('./assets/ic_update.png')}
            />,
            '检查升级',
            '>',
            () => {
              // 检查最新版本
              this._checkLatestVersion();
            },
          )}
        </View>
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
