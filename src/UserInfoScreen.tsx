import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {mainData} from './mainData';
import {commonStyles} from './commonStyle';
import {Avatar, CheckIcon, Select} from 'native-base';
import {Margin} from './space';
import BaseScreen from './BaseScreen.tsx';
import React from 'react';
import {Colors} from './colors';
import {DeviceStorage} from './utils/deviceStorage';
import {isEmpty} from './utils/until';
import {showToast} from './utils/toastUtil';
import EventBus from './utils/eventBus';

export default class UserInfoScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      datepickerOpen: false,
      userInfo: {
        userName: '',
        role: 'mother',
      },
    };
  }

  componentDidMount() {
    this.setState({
      userInfo: mainData.userInfo,
    });
  }

  _checkUserInfo() {
    if (isEmpty(this.state.userInfo.userName)) {
      showToast('请输入用户名');
      return false;
    }
    return true;
  }

  _confirmUserInfo() {
    if (this._checkUserInfo()) {
      mainData.userInfo = this.state.userInfo;
      DeviceStorage.refreshMainData();
      EventBus.sendEvent(EventBus.REFRESH_USER_INFO);
      this.props.navigation.goBack();
    }
  }

  renderScreen() {
    return (
      <View style={[styles.container, {flex: 1}]}>
        <View
          style={[
            commonStyles.flexColumn,
            {flex: 1, padding: Margin.horizontal, alignItems: 'center'},
          ]}>
          <Avatar
            style={{width: 80, height: 80}}
            bg={'transparent'}
            source={{
              uri: mainData.userInfo.avatarUrl,
            }}>
            <Avatar.Badge bg="green.500" />
          </Avatar>
          <View
            style={[
              {height: 40, marginTop: 12},
              commonStyles.flexRow,
              commonStyles.center,
            ]}>
            <Text style={[styles.rowTitleText]}>用户名：</Text>
            <TextInput
              style={[commonStyles.commonTextInputStyle, {}]}
              value={this.state.userInfo.userName}
              onChangeText={text => {
                this.state.userInfo.userName = text;
                this.forceUpdate();
              }}
              placeholderTextColor={'#bbbbbb'}
              placeholder={'请输入用户名'}
            />
          </View>
          <View
            style={[
              {height: 40, marginTop: 12},
              commonStyles.flexRow,
              commonStyles.center,
            ]}>
            <Text style={[styles.rowTitleText]}>我是：</Text>
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.grayEe,
              }}>
              <Select
                selectedValue={this.state.userInfo.role}
                minWidth="200"
                accessibilityLabel="请选择"
                placeholder="请选择"
                _selectedItem={{
                  bg: Colors.primary4,
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={itemValue => {
                  this.state.userInfo.role = itemValue;
                  this.forceUpdate();
                }}>
                <Select.Item label="爸爸" value="爸爸" />
                <Select.Item label="妈妈" value="妈妈" />
              </Select>
            </View>
          </View>
        </View>
        <View style={[commonStyles.bottomContainer]}>
          <TouchableOpacity
            onPress={() => {
              this._confirmUserInfo();
            }}
            style={[{flex: 1}, commonStyles.center]}>
            <Text>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowTitleText: {
    textAlign: 'right',
    fontSize: 16,
    color: Colors.black333,
    width: 80,
  },
  container: {},
  titleImg: {
    width: 20,
    height: 20,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    right: 75,
  },
  backRightBtnRight: {
    right: 0,
  },
  backTextWhite: {
    color: '#ffffff',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
});
