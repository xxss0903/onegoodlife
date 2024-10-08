import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import {mainData} from './mainData';
import {commonStyles} from './commonStyle';
import {Avatar, CheckIcon, Select} from 'native-base';
import {Margin} from './space';
import BaseScreen from './BaseScreen.tsx';
import React from 'react';
import {Colors} from './colors';
import {DeviceStorage} from './utils/deviceStorage';
import {isEmpty, isIOS} from './utils/until';
import {showToast} from './utils/toastUtil';
import EventBus from './utils/eventBus';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';

export default class UserInfoScreen extends BaseScreen {
  private actionSheetRef: any;

  constructor(props) {
    super(props);
    this.state = {
      hideInsets: true,
      datepickerOpen: false,
      userInfo: {
        userName: '',
        role: 'mother',
        avatarUrl: '',
      },
    };
  }

  componentDidMount() {
    console.log("user info", mainData.userInfo)
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

  _changeUserAvatar() {
    this.actionSheetRef?.show();
  }

  _openCamera() {
    if (isIOS()) {
      setTimeout(() => {
        ImagePicker.openCamera({
          width: 400,
          height: 400,
          mediaType: 'photo',
          writeTempFile: true,
          cropping: true,
          includeBase64:true
        }).then(image => {
          console.log('select img', image);
          let base64Img = `data:image/png;base64,${image.data}`
          let imgPath = base64Img;
          this.state.userInfo.avatarUrl = imgPath;
          this.forceUpdate();
        });
      }, 300)
    } else {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        mediaType: 'photo',
        cropping: true,
      }).then(image => {
        console.log(image);
        let imgPath = image.path;
        this.state.userInfo.avatarUrl = imgPath;
        this.forceUpdate();
      });
    }

  }

  _openGallery() {
    if (isIOS()) {
      setTimeout(() => {
        ImagePicker.openPicker({
          width: 400,
          height: 400,
          mediaType: 'photo',
          writeTempFile: true,
          includeBase64:true
        }).then(image => {
          console.log('select img', image);
          let base64Img = `data:image/png;base64,${image.data}`
          let imgPath = base64Img;
          this.state.userInfo.avatarUrl = imgPath;
          this.forceUpdate();
        });
      }, 300)
    } else {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        mediaType: 'photo',
        cropping: true,
      }).then(image => {
        console.log(image);
        let imgPath = image.path;
        this.state.userInfo.avatarUrl = imgPath;
        this.forceUpdate();
      });
    }

  }

  renderScreen() {
    return (
      <View style={[styles.container, {flex: 1}]}>
        <View
          style={[
            commonStyles.flexColumn,
            {
              marginHorizontal: Margin.horizontal,
              marginTop: Margin.horizontal,
              borderRadius: Margin.bigCorners,
              backgroundColor: Colors.white,
              padding: Margin.horizontal,
              alignItems: 'center',
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              this._changeUserAvatar();
            }}>
            {this.state.userInfo.avatarUrl ? <Image
                width={Margin.avatarSize}
                height={Margin.avatarSize}
                style={{width: Margin.avatarSize, height: Margin.avatarSize, borderRadius: Margin.avatarSize/2}}
                source={{
                  uri: this.state.userInfo.avatarUrl,
                }}>
            </Image> : <Avatar
                style={{width: Margin.avatarSize, height: Margin.avatarSize}}
                bg={'transparent'}
                source={require('./assets/ic_user_default.png')}
            />}
          </TouchableOpacity>

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
        <ActionSheet ref={ref => (this.actionSheetRef = ref)}>
          <View
            style={[
              commonStyles.flexColumn,
              {paddingVertical: Margin.vertical},
            ]}>
            <TouchableOpacity
              style={styles.actionItemContainer}
              onPress={() => {
                this.actionSheetRef?.hide();
                this._openCamera();
              }}>
              <Text>拍照</Text>
            </TouchableOpacity>
            <View style={commonStyles.line} />
            <TouchableOpacity
              style={styles.actionItemContainer}
              onPress={() => {
                this.actionSheetRef?.hide();
                this._openGallery();
              }}>
              <Text>相册</Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>
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
  actionItemContainer: {
    height: 60,
    paddingHorizontal: Margin.horizontal,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
