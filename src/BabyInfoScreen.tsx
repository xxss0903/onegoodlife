import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {mainData} from './mainData';
import {commonStyles} from './commonStyle';
import {launchCamera} from 'react-native-image-picker';
import {AndroidPermissions} from './utils/permissionUtils';
import {logi} from './utils/logutil';
import {Image} from 'native-base';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {formatTimeToDate} from './utils/until';
import {DeviceStorage} from './utils/deviceStorage';
import EventBus from './utils/eventBus';

export default class BabyInfoScreen extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      datepickerOpen: false,
      babyInfo: {
        name: '', // 姓名
        nickname: '', // 小名
        birthDay: moment().valueOf(), // 出生日期
        avatar: '', // 头像
      },
    };
  }

  componentDidMount() {
    let babyInfo = this.props.route.params?.baby;
    if (babyInfo) {
      // 编辑
      this.setState({
        babyInfo: JSON.parse(JSON.stringify(babyInfo)),
      });
    }
  }

  // 选择照片/拍照
  _choosePicture() {
    AndroidPermissions.checkStoragePermissions(
      () => {
        logi('storage permission');
        AndroidPermissions.checkCameraPermissions(
          () => {
            logi('camera permission');
            launchCamera({
              cameraType: 'back',
              saveToPhotos: true,
            })
              .then(res => {
                logi('camera res', res);
                // 拿到图片地址 {"assets": [{"fileName": "rn_image_picker_lib_temp_823f9d97-9b06-46ff-94e3-b37cc0ef86c2.jpg", "fileSize": 199674, "height": 1280, "original
                // Path": "file:///data/user/0/com.onegoodlife/cache/rn_image_picker_lib_temp_823f9d97-9b06-46ff-94e3-b37cc0ef86c2.jpg", "type": "image/jpeg", "uri": "file:///data/user/0/com.
                // onegoodlife/cache/rn_image_picker_lib_temp_823f9d97-9b06-46ff-94e3-b37cc0ef86c2.jpg", "width": 960}]}
                if (res.assets && res.assets.length > 0) {
                  let imgFile = res.assets[0];
                  let imgPath = imgFile.originalPath;
                  this.state.babyInfo.avatar = imgPath;
                  this.forceUpdate();
                }
              })
              .catch(error => {
                logi('camera error ', error);
              });
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
    return true;
  }

  _confirmBabyInfo() {
    try {
      if (this._checkBabyInfo()) {
        // 宝贝的id
        this.state.babyInfo.babyId = mainData.babies.length + 1;
        mainData.babies.unshift(
          JSON.parse(JSON.stringify(this.state.babyInfo)),
        );
        mainData.babyInfo = mainData.babies[0]; // 最新的宝贝数据作为更新的
        DeviceStorage.refreshMainData();
        EventBus.sendEvent(EventBus.REFRESH_BABY_LIST);
        if (this.props.route.params?.callback) {
          this.props.route.params?.callback();
        }
        this.props.navigation.goBack();
      }
    } catch (e) {
      logi('error ', e.message);
    }
  }

  render() {
    return (
      <View style={[styles.container, {flex: 1}]}>
        <View
          style={[
            commonStyles.flexColumn,
            {backgroundColor: '#ff0000', padding: 12},
          ]}>
          <View style={[commonStyles.flexRow, {alignItems: 'center'}]}>
            <Text style={{marginRight: 12}}>姓名</Text>
            <TextInput
              style={[
                {
                  textAlign: 'left',
                  fontSize: 16,
                  flex: 1,
                  backgroundColor: '#eeeeee',
                  color: '#333333',
                },
              ]}
              value={this.state.babyInfo.name}
              onChangeText={text => {
                this.state.babyInfo.name = text;
                this.forceUpdate();
              }}
              placeholderTextColor={'#bbbbbb'}
              placeholder={'请输入宝宝姓名'}
            />
          </View>
          <View style={[commonStyles.flexRow, {alignItems: 'center'}]}>
            <Text style={{marginRight: 12}}>昵称</Text>
            <TextInput
              style={[
                {
                  textAlign: 'left',
                  fontSize: 16,
                  flex: 1,
                  backgroundColor: '#eeeeee',
                  color: '#333333',
                },
              ]}
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
            style={[commonStyles.flexRow, {alignItems: 'center'}]}>
            <Text style={{marginRight: 12}}>出生日期</Text>
            <Text style={{marginRight: 12}}>
              {formatTimeToDate(this.state.babyInfo.birthDay)}
            </Text>
            <DatePicker
              is24hourSource="locale"
              open={this.state.datepickerOpen}
              date={new Date(this.state.babyInfo.birthDay)}
              modal={true}
              mode={'date'}
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
        </View>
        <View style={[commonStyles.flexColumn, {flex: 1}]}>
          <TouchableOpacity
            onPress={() => {
              this._choosePicture();
            }}>
            <Text>宝宝头像</Text>
          </TouchableOpacity>
          <Image
            style={{width: 78, height: 78, borderRadius: 40}}
            source={{
              uri: this.state.babyInfo.avatar,
            }}
          />
        </View>
        <View style={[commonStyles.flexRow, {height: 60}]}>
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
});
