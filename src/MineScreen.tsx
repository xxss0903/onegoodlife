import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import {commonStyles} from './commonStyle';
import {Margin, Style} from './space';
import {Colors} from './colors';
import moment from 'moment';
import {mainData} from './mainData';
import {Avatar} from 'native-base';
import {Font} from './font';
import {FontStyle} from '@shopify/react-native-skia';
import {background} from 'native-base/lib/typescript/theme/styled-system';

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

export default class MineScreen extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      datepickerOpen: false,
      birthDay: moment(mainData.babyInfo.birthDay).valueOf(),
    };
  }

  componentDidMount() {}

  render() {
    return (
      <View
        style={[
          styles.container,
          commonStyles.flexColumn,
          {backgroundColor: Colors.white, flex: 1},
        ]}>
        <ImageBackground
          style={{height: 240}}
          source={require('./assets/ic_user_background.webp')}>
          <View style={[styles.userInfoContainer, commonStyles.center]}>
            <Avatar
              style={{width: 80, height: 80}}
              source={{
                uri: 'https://hbimg.huabanimg.com/5bc47fcdeb5023b5473735b3489e146d362512a422ed2-3smjNx_fw658',
              }}
            />
            <Text
              style={{
                marginTop: Margin.vertical,
                fontSize: 18,
                fontWeight: Style.bold,
              }}>
              伊丽莎白
            </Text>
          </View>
        </ImageBackground>

        <View
          style={[
            commonStyles.flexColumn,
            {
              borderTopLeftRadius: Margin.horizontal,
              backgroundColor: Colors.white,
              borderTopRightRadius: Margin.horizontal,
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
              this.props.navigation.navigate('TypeMangeScreen');
            },
          )}
          {ItemRow(
            <Image
              style={styles.titleImg}
              source={require('./assets/ic_setting.png')}
            />,
            '应用设置',
            () => {
              this.props.navigation.navigate('VersionScreen');
            },
          )}
          {ItemRow(
            <Image
              style={styles.titleImg}
              source={require('./assets/ic_version.png')}
            />,
            '版本信息',
            () => {
              this.props.navigation.navigate('VersionScreen');
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
