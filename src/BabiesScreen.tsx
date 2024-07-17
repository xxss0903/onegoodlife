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
} from 'react-native';
import {GradientColors, mainData} from './mainData';
import {formatTimeToDate} from './utils/until';
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
    if (baby.sex === 'boy') {
      return (
        <Avatar size={'xl'} source={require('./assets/ic_baby_boy.png')} />
      );
    } else {
      return (
        <Avatar size={'xl'} source={require('./assets/ic_baby_girl.png')} />
      );
    }
  }

  _renderBabyItem(item: any, index: any) {
    let bgIndex = index % 4;
    let bgColor = GradientColors[`gradientColor${bgIndex}`];

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this._editBaby(item);
        }}>
        <View>
          <LinearGradient
            colors={bgColor}
            start={{x: 0, y: 1}}
            style={[
              commonStyles.flexColumn,
              {
                padding: Margin.horizontal,
                borderRadius: Margin.bigCorners,
                marginTop: Margin.vertical,
                height: 140,
                marginHorizontal: Margin.horizontal,
              },
            ]}
            end={{x: 1, y: 0}}>
            <View style={[commonStyles.flexRow]}>
              {!(item && item.avatar) ? (
                this._renderDefaultAvatar(item)
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
                    小名：{item.nickname}
                  </Text>
                ) : null}
                <Text style={[{fontSize: 18, marginTop: Margin.vertical}]}>
                  生日：{formatTimeToDate(item.birthDay)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _addNewBaby() {
    this.props.navigation.navigate('BabyInfoScreen', {});
  }

  _pinBabyImpl(baby, index) {
    let tempBabies = [baby];
    for (let i = 0; i < mainData.babies.length; i++) {
      if (i !== index) {
        tempBabies.push(mainData.babies[i]);
      }
    }
    mainData.refreshBabies = true;
    mainData.babies = tempBabies;
    DeviceStorage.refreshMainData();
    this.forceUpdate();
  }

  _closeRow(rowMap, rowKey) {
    rowMap[rowKey]?.closeRow();
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
              renderHiddenItem={(data, rowMap) => {
                return (
                  <View style={styles.rowBack}>
                    <TouchableOpacity
                      style={[
                        styles.backLeftBtn,
                        {
                          backgroundColor: Colors.primary,
                          height: 140,
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
                          backgroundColor: data.item.bgColor,
                          height: 140,
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
              }}
              leftOpenValue={75}
              rightOpenValue={-75}
              previewOpenValue={-40}
              previewOpenDelay={1000}
              onRowDidOpen={(rowKey, rowMap, toValue) => {
                console.log('open row ' + rowKey, rowMap);
                setTimeout(() => {
                  this._closeRow(rowMap, rowKey);
                }, 3000);
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
    right: Margin.horizontal,
  },
  backRightBtnLeft: {
    right: 75,
  },
  backRightBtnRight: {
    right: 0,
  },
  backLeftBtn: {
    left: Margin.horizontal,
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
