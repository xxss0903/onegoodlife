import React from 'react';
import {View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import moment from 'moment';
import {formatTime, formatTimeToDate} from './utils/until';
import {logi} from './utils/logutil';
import DatePicker from 'react-native-date-picker';
import {commonStyles} from './commonStyle';
import {renderTagList} from './components/commonViews';
import {AndroidPermissions} from './utils/permissionUtils';
import {showToast} from './utils/toastUtil';
import {Margin} from './space';

// 记录的记录详情
export default class NewLifeDetailScreen extends React.Component<any, any> {
  constructor(props) {
    super(props);
    let data = JSON.parse(JSON.stringify(this.props.route.params?.data));
    this.state = {
      data: data,
      datepickerOpen: false,
    };
  }

  componentDidMount() {
    logi('type detail ', this.state.data);
    this.props.navigation.setOptions({title: this.state.data.name});
  }

  _toggleDatetimePicker(open) {
    this.setState({
      datepickerOpen: open,
    });
  }

  // 确认修改
  _confirmEditData() {}

  _selectImage() {
    AndroidPermissions.checkStoragePermissions(
      () => {
        AndroidPermissions.checkCameraPermissions(
          () => {
            // 权限成功
          },
          () => {
            showToast('请打开相机权限');
          },
        );
      },
      () => {
        showToast('请打开存储权限');
      },
    );
  }

  render() {
    const {time, remark, name, selectedTags, tags} = this.state.data;
    return (
      <View style={[commonStyles.flexColumn, {flex: 1, padding: 12}]}>
        {/*记录内容*/}
        <View>
          <TouchableOpacity
            onPress={() => {
              this._toggleDatetimePicker(true);
            }}>
            <Text
              style={[
                commonStyles.commonContentText,
                {marginTop: Margin.vertical},
              ]}>
              时间：{formatTime(time)}
            </Text>
          </TouchableOpacity>
          <View>
            <Text
              style={[
                commonStyles.commonContentText,
                {marginTop: Margin.vertical},
              ]}>
              标签
            </Text>
            {selectedTags ? (
              <View style={{marginTop: Margin.vertical}}>
                {renderTagList(
                  tags,
                  selectedTags,
                  tag => {
                    this.forceUpdate();
                  },
                  false,
                  name.indexOf('奶') < 0,
                )}
              </View>
            ) : null}
          </View>
          <View style={{minHeight: 80, marginTop: 12}}>
            <TextInput
              style={[
                {
                  fontSize: 14,
                  flex: 1,
                  backgroundColor: '#eeeeee',
                  color: '#333333',
                },
              ]}
              multiline={true}
              value={remark}
              onChangeText={text => {
                this.state.data.remark = text;
                this.forceUpdate();
              }}
              placeholderTextColor={'#bbbbbb'}
              keyboardType={'default'}
              placeholder={'请输入备注'}
            />
          </View>
        </View>
        {/*记录图片*/}
        <View style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => {
              this._selectImage();
            }}>
            <Text>选择图片</Text>
          </TouchableOpacity>
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
              this._confirmEditData();
            }}>
            <Text>确认</Text>
          </TouchableOpacity>
        </View>
        <DatePicker
          is24hourSource="locale"
          open={this.state.datepickerOpen}
          date={new Date(time)}
          modal={true}
          mode={'datetime'}
          onConfirm={date => {
            // 确认选择，将日期转为时间戳
            this.state.data.time = moment(date).valueOf();
            let formatTime = moment(this.state.data.time).format(
              'yyyy-MM-DD HH:mm',
            );
            logi('confirm date', date + ' # ' + formatTime);
            this._toggleDatetimePicker(false);
          }}
          onCancel={() => {
            this.setState({
              datepickerOpen: false,
            });
          }}
        />
      </View>
    );
  }
}
