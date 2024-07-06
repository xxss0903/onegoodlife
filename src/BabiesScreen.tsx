import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import {mainData} from './mainData';
import {formatTimeToDate} from './utils/until';
import {commonStyles} from './commonStyle';
import EventBus from './utils/eventBus';
import {Colors} from './colors';
import {Avatar} from 'native-base';
import {Margin} from './space';
import BaseScreen from './BaseScreen.tsx';
import {DeviceStorage} from './utils/deviceStorage';
import {logi} from './utils/logutil';

export default class BabiesScreen extends BaseScreen {
  constructor(props: any) {
    super(props);
    this.state = {
      datepickerOpen: false,
    };
  }

  componentDidMount() {
    this.refreshEvent = EventBus.addEventListener(
      EventBus.REFRESH_BABIES_SCREEN,
      () => {
        this.forceUpdate();
      },
    );
  }

  componentWillUnmount() {
    this.refreshEvent && this.refreshEvent.remove();
  }

  _editBaby(baby) {
    this.props.navigation.navigate('BabyInfoScreen', {
      baby: baby,
    });
  }

  _deleteRow(index) {
    mainData.babies.splice(index, 1);
    // 更新本地存储
    DeviceStorage.refreshMainData();
    this.forceUpdate();
    logi('send refresh babis home list');
    mainData.refreshBabies = true;
  }

  _showRemoveBabyDialog(baby: any, index: Number) {
    Alert.alert(
      '提示',
      '确认移除' + (baby.name ? baby.name : baby.nickname) + '吗？',
      [
        {
          text: '取消',
          onPress: () => {},
        },
        {
          text: '删除',
          onPress: () => {
            this._deleteRow(index);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      },
    );
  }

  _renderBabyItem(item: any, index: any) {
    if (!item.bgColor) {
      item.bgColor = Colors.grayEe;
      if (index === 0) {
        item.bgColor = Colors.primary5;
      } else if (index % 2 === 0) {
        item.bgColor = Colors.primary2;
      } else if (index % 3 === 0) {
        item.bgColor = Colors.primary3;
      } else if (index % 4 === 0) {
        item.bgColor = Colors.primary4;
      } else if (index % 5 === 0) {
        item.bgColor = Colors.primary6;
      }
    }

    return (
      <TouchableOpacity
        onLongPress={() => {
          // 移除
          this._showRemoveBabyDialog(item, index);
        }}
        onPress={() => {
          this._editBaby(item);
        }}
        style={[
          commonStyles.flexColumn,
          {
            backgroundColor: item.bgColor,
            padding: Margin.horizontal,
            borderRadius: Margin.corners,
            marginTop: index === 0 ? 0 : Margin.vertical,
          },
        ]}>
        <View style={[commonStyles.flexColumn]}>
          <View style={[commonStyles.flexRow]}>
            {!(item && item.avatar) ? (
              <Avatar
                bg={'transparent'}
                size={'xl'}
                source={require('./assets/ic_baby.png')}
              />
            ) : (
              <Avatar
                size={'xl'}
                source={{
                  uri: item.avatar,
                }}
              />
            )}
            <View
              style={[
                commonStyles.flexColumn,
                {marginLeft: Margin.horizontal, justifyContent: 'center'},
              ]}>
              <Text style={[{fontSize: 20, fontWeight: 'bold'}]}>
                姓名：{item.name}
              </Text>
              {item.nickname ? (
                <Text style={[{fontSize: 20, fontWeight: 'bold'}]}>
                  小名：{item.name}
                </Text>
              ) : null}
              <Text style={[{fontSize: 18, marginTop: Margin.vertical}]}>
                生日：{formatTimeToDate(item.birthDay)}
              </Text>
            </View>
          </View>
          <View></View>
        </View>
      </TouchableOpacity>
    );
  }

  _addNewBaby() {
    this.props.navigation.navigate('BabyInfoScreen', {});
  }

  renderScreen() {
    return (
      <View style={[styles.container, {flex: 1}]}>
        <View
          style={[
            commonStyles.flexColumn,
            {flex: 1, padding: Margin.horizontal},
          ]}>
          <FlatList
            data={mainData.babies}
            renderItem={({item, index}) => {
              return this._renderBabyItem(item, index);
            }}
          />
        </View>
        <View style={[commonStyles.bottomContainer]}>
          <TouchableOpacity
            onPress={() => {
              this._addNewBaby();
            }}
            style={[{flex: 1}, commonStyles.center]}>
            <Text>添加宝宝</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
