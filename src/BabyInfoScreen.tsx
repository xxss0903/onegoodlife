import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {mainData} from './mainData';
import {commonStyles} from './commonStyle';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {AndroidPermissions} from './utils/permissionUtils';
import {logi} from './utils/logutil';
import {Avatar, Image, VStack} from 'native-base';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {formatTimeToDate, isEmpty} from './utils/until';
import {DeviceStorage} from './utils/deviceStorage';
import EventBus from './utils/eventBus';
import {Margin} from './space';
import {Colors} from './colors';
import BaseScreen from './BaseScreen.tsx';
import {showToast} from './utils/toastUtil';
import ActionSheet from 'react-native-actions-sheet';
import ImagePicker from 'react-native-image-crop-picker';

export default class BabyInfoScreen extends BaseScreen {
  private actionSheetRef: any;

  constructor(props: any) {
    super(props);
    this.state = {
      datepickerOpen: false,
      babyInfo: {
        name: '', // 姓名
        nickname: '', // 小名
        birthDay: moment().valueOf(), // 出生日期
        avatar: '', // 头像
      },
      isEdit: false,
    };
  }

  componentDidMount() {
    let babyInfo = this.props.route.params?.baby;
    if (babyInfo) {
      // 编辑
      this.setState({
        babyInfo: JSON.parse(JSON.stringify(babyInfo)),
        isEdit: true,
      });
      this.props.navigation.setOptions({title: `编辑宝宝信息`});
    } else {
      this.props.navigation.setOptions({title: '添加宝宝'});
    }
  }

  _openCamera() {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      let imgPath = image.path;
      this.state.babyInfo.avatar = imgPath;
      this.forceUpdate();
    });
  }

  _openGallery() {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      let imgPath = image.path;
      this.state.babyInfo.avatar = imgPath;
      this.forceUpdate();
    });
  }

  // 选择照片/拍照
  _choosePicture() {
    AndroidPermissions.checkStoragePermissions(
      () => {
        AndroidPermissions.checkCameraPermissions(
          () => {
            logi('camera permission', this.actionSheetRef);
            this.actionSheetRef?.show();
          },
          () => {
            logi('camera no permission');
          },
        );
      },
      () => {
        logi('storage no permission');
      },
    );
  }

  _checkBabyInfo() {
    const {name, birthDay} = this.state.babyInfo;
    if (isEmpty(name)) {
      showToast('请输入宝宝姓名');
      return false;
    }
    if (moment() < moment(birthDay)) {
      showToast('宝宝生日不能大于当前日期');
      return false;
    }
    return true;
  }

  _editBaby() {
    for (let i = 0; i < mainData.babies.length; i++) {
      if (mainData.babies[i].babyId === this.state.babyInfo.babyId) {
        mainData.babies[i] = {...this.state.babyInfo};
        DeviceStorage.refreshMainData();
        EventBus.sendEvent(EventBus.REFRESH_BABIES_SCREEN);
        mainData.refreshBabies = true;
        this.props.navigation.goBack();
        return;
      }
    }
  }

  _addNewBaby() {
    let maxBabyId = 1;

    mainData.babies.forEach(value => {
      if (value.babyId > maxBabyId) {
        maxBabyId = value.babyId;
      }
    });
    this.state.babyInfo.babyId = maxBabyId + 1;
    logi('insert new baby', this.state.babyInfo);
    mainData.refreshBabies = true;
    mainData.babies.unshift(JSON.parse(JSON.stringify(this.state.babyInfo)));
    DeviceStorage.refreshMainData();
    EventBus.sendEvent(EventBus.REFRESH_BABIES_SCREEN);
    this.props.navigation.goBack();
  }

  _confirmBabyInfo() {
    if (this._checkBabyInfo()) {
      if (this.state.isEdit) {
        this._editBaby();
      } else {
        this._addNewBaby();
      }
    }
  }

  renderScreen() {
    return (
      <View style={[{flex: 1}]}>
        <VStack style={{flex: 1, padding: Margin.horizontal}}>
          <View
            style={[
              commonStyles.flexColumn,
              {
                padding: Margin.horizontal,
                backgroundColor: Colors.white,
                borderRadius: Margin.corners,
              },
            ]}>
            <View style={[commonStyles.flexRow, {alignItems: 'center'}]}>
              <Text
                style={[
                  {width: 80, textAlign: 'right'},
                  commonStyles.commonContentText,
                ]}>
                姓名：
              </Text>
              <TextInput
                style={[commonStyles.commonTextInputStyle, {}]}
                value={this.state.babyInfo.name}
                onChangeText={text => {
                  this.state.babyInfo.name = text;
                  this.forceUpdate();
                }}
                placeholderTextColor={'#bbbbbb'}
                placeholder={'请输入宝宝姓名'}
              />
            </View>
            <View
              style={[
                commonStyles.flexRow,
                {alignItems: 'center', marginTop: Margin.vertical},
              ]}>
              <Text
                style={[
                  {width: 80, textAlign: 'right'},
                  commonStyles.commonContentText,
                ]}>
                昵称：
              </Text>
              <TextInput
                style={[commonStyles.commonTextInputStyle, {}]}
                value={this.state.babyInfo.nickname}
                onChangeText={text => {
                  this.state.babyInfo.nickname = text;
                  this.forceUpdate();
                }}
                placeholderTextColor={'#bbbbbb'}
                placeholder={'请输入宝宝昵称'}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  datepickerOpen: true,
                });
              }}
              style={[
                commonStyles.flexRow,
                {alignItems: 'center', marginTop: Margin.vertical},
              ]}>
              <Text style={[{width: 80}, commonStyles.commonContentText]}>
                出生日期：
              </Text>
              <Text
                style={[
                  {marginRight: Margin.horizontal},
                  commonStyles.commonContentText,
                ]}>
                {formatTimeToDate(this.state.babyInfo.birthDay)}
              </Text>
              <DatePicker
                is24hourSource="locale"
                open={this.state.datepickerOpen}
                date={new Date(this.state.babyInfo.birthDay)}
                modal={true}
                mode={'date'}
                style={[commonStyles.commonTextStyle]}
                onConfirm={date => {
                  // 确认选择，将日期转为时间戳
                  this.state.babyInfo.birthDay = moment(date).valueOf();
                  this.setState({
                    datepickerOpen: false,
                  });
                }}
                onCancel={() => {
                  this.setState({
                    datepickerOpen: false,
                  });
                }}
              />
            </TouchableOpacity>
            <View
              style={[
                commonStyles.flexRow,
                {alignItems: 'center', marginTop: Margin.vertical},
              ]}>
              <Text
                style={[
                  commonStyles.commonContentText,
                  {width: 80, textAlign: 'right'},
                ]}>
                宝宝头像：
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this._choosePicture();
                }}>
                {this.state.babyInfo.avatar ? (
                  <Avatar
                    style={{width: 78, height: 78}}
                    source={{
                      uri: this.state.babyInfo.avatar,
                    }}
                  />
                ) : (
                  <Image
                    alt={''}
                    style={{width: 78, height: 78, borderRadius: 40}}
                    source={require('./assets/ic_user_default.png')}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </VStack>

        <View style={[commonStyles.bottomContainer]}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={[{flex: 1}, commonStyles.center]}>
            <Text>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[{flex: 1}, commonStyles.center]}
            onPress={() => {
              // 修改数据
              this._confirmBabyInfo();
            }}>
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
  container: {
    padding: 12,
  },
  titleImg: {
    width: 20,
    height: 20,
  },
  actionItemContainer: {
    height: 60,
    paddingHorizontal: Margin.horizontal,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
