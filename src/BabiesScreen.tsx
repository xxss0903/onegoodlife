import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native';
import {GradientColors, mainData} from './mainData';
import {formatTimeToDate, isEmpty} from './utils/until';
import {commonStyles} from './commonStyle';
import EventBus from './utils/eventBus';
import {Colors} from './colors';
import {Avatar} from 'native-base';
import {Margin} from './space';
import BaseScreen from './BaseScreen.tsx';
import {DeviceStorage} from './utils/deviceStorage';
import {logi} from './utils/logutil';
import {deleteDataByBabyId} from './utils/dbService';
import {db} from './dataBase.ts';
import LinearGradient from 'react-native-linear-gradient';
import {SwipeListView} from 'react-native-swipe-list-view';

export default class BabiesScreen extends BaseScreen {
  private closeTimeoutMap = new Map();

  constructor(props: any) {
    super(props);
    this.state = {
      datepickerOpen: false,
      hideInsets: true,
    };
  }

  componentDidMount() {
    console.log('refresh babies', mainData.babies);
    this.refreshEvent = EventBus.addEventListener(
      EventBus.REFRESH_BABIES_SCREEN,
      () => {
        console.log('babies list', mainData.babies);
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

  async _deleteRow(baby, index) {
    mainData.babies.splice(index, 1);
    // 删除这个宝宝对应的所有数据
    await deleteDataByBabyId(db.database, baby.babyId);
    // 更新本地存储
    DeviceStorage.refreshMainData();
    this.forceUpdate();
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
            this._deleteRow(baby, index);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      },
    );
  }

  _renderDefaultAvatar(baby) {
    console.log('render baby sex', baby.sex);
    if (baby.sex === 'boy') {
      return (
        <Avatar
          key={baby.sex}
          size={'xl'}
          style={{width: Margin.avatarSize, height: Margin.avatarSize}}
          source={require('./assets/ic_baby_boy.png')}
        />
      );
    } else {
      return (
        <Avatar
          key={baby.sex}
          size={'xl'}
          style={{width: Margin.avatarSize, height: Margin.avatarSize}}
          source={require('./assets/ic_baby_girl.png')}
        />
      );
    }
  }

  _renderBabyItem(item: any, index: any) {
    let bgIndex = index % 4;
    let bgColor = GradientColors[`gradientColor${bgIndex}`];

    return (
      <TouchableHighlight
        underlayColor={Colors.grayEe}
        style={{
          marginTop: Margin.vertical,
          borderRadius: Margin.bigCorners,
        }}
        onPress={() => {
          this._editBaby(item);
        }}>
        <LinearGradient
          colors={item.bgColor ? item.bgColor : bgColor}
          start={{x: 0, y: 1}}
          style={[
            commonStyles.flexColumn,
            {
              borderRadius: Margin.bigCorners,
              height: 120,
              justifyContent: 'center',
              paddingHorizontal: Margin.horizontal,
            },
          ]}
          end={{x: 1, y: 0}}>
          <View style={[commonStyles.flexRow]}>
            {isEmpty(item.avatar) ? (
              this._renderDefaultAvatar(item)
            ) : (
              <Avatar
                size={'xl'}
                style={{width: Margin.avatarSize, height: Margin.avatarSize}}
                key={item.avatar}
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
                  小名：{item.nickname}
                </Text>
              ) : null}
              <Text style={[{fontSize: 18, marginTop: Margin.vertical}]}>
                生日：{formatTimeToDate(item.birthDay)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableHighlight>
    );
  }

  _addNewBaby() {
    this.props.navigation.navigate('BabyInfoScreen', {});
  }

  _pinBabyImpl(baby, index) {
    if (index === 0) {
      return;
    }
    let tempBabies = [baby];
    for (let i = 0; i < mainData.babies.length; i++) {
      if (i !== index) {
        tempBabies.push(mainData.babies[i]);
      }
    }
    mainData.refreshBabies = true;
    mainData.babies = tempBabies;
    mainData.babyInfo = mainData.babies[0];
    DeviceStorage.refreshMainData();
    EventBus.sendEvent(EventBus.REFRESH_GRADIENT_COLOR);
    this.forceUpdate();
  }

  _closeRow(rowMap, rowKey) {
    rowMap[rowKey]?.closeRow();
  }

  _scheduleCloseRow(rowKey, rowMap) {
    if (this.closeTimeoutMap.has(rowKey)) {
      clearTimeout(this.closeTimeoutMap.get(rowKey));
      this.closeTimeoutMap.delete(rowKey);
    }
    let closeTimeout = setTimeout(() => {
      this._closeRow(rowMap, rowKey);
      this.closeTimeoutMap.delete(rowKey);
    }, 3000);
    this.closeTimeoutMap.set(rowKey, closeTimeout);
  }

  renderScreen() {
    return (
      <View style={[{flex: 1}]}>
        <View style={[styles.container, {flex: 1}]}>
          <View
            style={[
              commonStyles.flexColumn,
              {
                flex: 1,
                paddingBottom: Margin.vertical,
              },
            ]}>
            <SwipeListView
              useFlatList={true}
              data={mainData.babies}
              renderItem={({item, index}) => {
                return this._renderBabyItem(item, index);
              }}
              keyExtractor={(rowData, index) => {
                return rowData?.babyId + '';
              }}
              style={{flex: 1, paddingHorizontal: Margin.horizontal}}
              renderHiddenItem={(data, rowMap) => {
                return this._renderHiddenItem(rowMap, data);
              }}
              leftOpenValue={75}
              rightOpenValue={-75}
              previewOpenValue={-40}
              previewOpenDelay={1000}
              onRowDidOpen={(rowKey, rowMap, toValue) => {
                console.log('open row ' + rowKey, rowMap);
                this._scheduleCloseRow(rowKey, rowMap);
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
      </View>
    );
  }

  _renderHiddenItem(rowMap, data) {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[
            styles.backLeftBtn,
            {
              backgroundColor: Colors.primary,
              borderTopLeftRadius: Margin.bigCorners,
              borderBottomLeftRadius: Margin.bigCorners,
              top: Margin.vertical,
            },
          ]}
          onPress={() => {
            // this.deleteRow(rowMap, data.item.key, data.item);
            this._closeRow(rowMap, data.item.babyId + '');
            setTimeout(() => {
              this._showRemoveBabyDialog(data.item, data.index);
            }, 300);
          }}>
          <Text style={styles.backTextWhite}>删除</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.backRightBtn,
            {
              backgroundColor: Colors.primary5,
              borderTopRightRadius: Margin.bigCorners,
              borderBottomRightRadius: Margin.bigCorners,
              top: Margin.vertical,
            },
          ]}
          onPress={() => {
            // this.deleteRow(rowMap, data.item.key, data.item);
            console.log('data item', data, rowMap);
            this._closeRow(rowMap, data.item.babyId + '');
            setTimeout(() => {
              this._pinBabyImpl(data.item, data.index);
            }, 300);
          }}>
          <Text style={styles.backTextWhite}>置顶</Text>
        </TouchableOpacity>
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
    right: Margin.midHorizontal,
  },
  backRightBtnLeft: {
    right: 75,
  },
  backRightBtnRight: {
    right: 0,
  },
  backLeftBtn: {
    left: Margin.midHorizontal,
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
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
