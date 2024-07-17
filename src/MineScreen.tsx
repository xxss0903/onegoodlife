import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native';
import {commonStyles} from './commonStyle';
import {Margin, Style} from './space';
import {Colors} from './colors';
import moment from 'moment';
import {mainData} from './mainData';
import {Avatar} from 'native-base';
import BaseScreen from './BaseScreen.tsx';
import EventBus from './utils/eventBus';
import LinearGradient from 'react-native-linear-gradient';

const ItemRow = (img, title, callback, showLine = true) => {
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
        <View></View>
      </TouchableOpacity>
      {showLine ? <View style={commonStyles.lineWithMargin} /> : null}
    </View>
  );
};

export default class MineScreen extends BaseScreen {
  private refreshUserInfoListener: any;

  constructor(props: any) {
    super(props);
    this.state = {
      datepickerOpen: false,
      birthDay: moment(mainData.babyInfo.birthDay).valueOf(),
    };
  }

  componentDidMount() {
    this.refreshUserInfoListener = EventBus.addEventListener(
      EventBus.REFRESH_USER_INFO,
      () => {
        this.forceUpdate();
      },
    );
    this._initListeners();
  }

  _initListeners() {
    EventBus.addEventListener(EventBus.REFRESH_GRADIENT_COLOR, () => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.refreshUserInfoListener && this.refreshUserInfoListener.remove();
  }

  renderScreen() {
    return (
      <View
        style={[
          styles.container,
          commonStyles.flexColumn,
          {flex: 1},
        ]}>

          <View style={[styles.userInfoContainer, commonStyles.center]}>
              {mainData.userInfo.avatarUrl ? <Avatar
                  style={{width: 80, height: 80}}
                  source={{
                      uri: mainData.userInfo.avatarUrl,
                  }}
              /> : <Avatar
                  style={{width: 80, height: 80}}
                  source={require("./assets/ic_default_user.webp")}
              />}
            <Text
              style={{
                fontWeight: 'bold',
                marginTop: Margin.vertical,
                fontSize: 18,
              }}>
              {mainData.userInfo.userName}
            </Text>
          </View>

        <View
          style={[
            commonStyles.flexColumn,
            {
                marginHorizontal: Margin.horizontal,
                borderRadius: Margin.bigCorners,
              backgroundColor: Colors.white,
              marginTop: -2 * Margin.vertical,
            },
          ]}>
          {ItemRow(
            <Image
              style={styles.titleImg}
              source={require('./assets/ic_mine_n.png')}
            />,
            '我的信息',
            () => {
              this.props.navigation.navigate('UserInfoScreen');
            },
          )}
          {ItemRow(
            <Image
              style={styles.titleImg}
              source={require('./assets/ic_baby.png')}
            />,
            '宝宝信息',
            () => {
              this.props.navigation.navigate('BabiesScreen');
            },
          )}
          {ItemRow(
            <Image
              style={styles.titleImg}
              source={require('./assets/ic_type.png')}
            />,
            '类型管理',
            () => {
              this.props.navigation.navigate('TypeManageScreen');
            },
          )}
          {ItemRow(
            <Image
              style={styles.titleImg}
              source={require('./assets/ic_setting.png')}
            />,
            '应用信息',
            () => {
              this.props.navigation.navigate('VersionScreen');
            },
          )}
          {ItemRow(
            <Image
              style={styles.titleImg}
              source={require('./assets/ic_privacy.png')}
            />,
            '用户协议和隐私',
            () => {
              this.props.navigation.navigate('PrivacyScreen');
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
