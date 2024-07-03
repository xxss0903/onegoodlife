import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {mainData} from './mainData';
import {SwipeListView} from 'react-native-swipe-list-view';
import {formatTimeToDate} from './utils/until';
import {commonStyles} from './commonStyle';
import EventBus from './utils/eventBus';
import {Colors} from './colors';
import {Avatar} from 'native-base';
import {Margin} from './space';
import BaseScreen from './BaseScreen.tsx';

export default class UserInfoScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      datepickerOpen: false,
    };
  }

  _editBaby(baby) {
    this.props.navigation.navigate('BabyInfoScreen', {
      baby: baby,
      callback: () => {
        this.forceUpdate();
      },
    });
  }

  _renderBabyItem(item, index) {
    let bgColor = '#ffffff';
    if (index === 0) {
      bgColor = Colors.primary5;
    } else if (index % 1 === 0) {
      bgColor = Colors.primary2;
    } else if (index % 2 === 0) {
      bgColor = Colors.primary3;
    } else if (index % 3 === 0) {
      bgColor = Colors.primary4;
    } else {
    }
    return (
      <TouchableOpacity
        onLongPress={() => {
          // 刪除寶寶
        }}
        onPress={() => {
          this._editBaby(item);
        }}
        style={[
          commonStyles.flexColumn,
          {
            backgroundColor: bgColor,
            padding: 12,
            borderRadius: 12,
            marginTop: 12,
          },
        ]}>
        <View style={[commonStyles.flexColumn]}>
          <View style={[commonStyles.flexRow]}>
            {!(item && item.avatar) ? (
              <Avatar
                size={'xl'}
                source={require('./assets/ic_about_us.png')}
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
                {item.nickname}
              </Text>
              <Text style={[{fontSize: 18, marginTop: Margin.vertical}]}>
                {formatTimeToDate(item.birthDay)}
              </Text>
            </View>
          </View>
          <View></View>
        </View>
      </TouchableOpacity>
    );
  }

  onRowDidOpen = (rowKey, rowMap) => {};

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  deleteRow = (rowMap, rowKey, data) => {
    this.closeRow(rowMap, rowKey);
    let index = mainData.babies.indexOf(data);
    mainData.babies.splice(index, 1);
    EventBus.sendEvent(EventBus.REFRESH_BABY_LIST);
    this.forceUpdate();
  };

  _addNewBaby() {
    this.props.navigation.navigate('BabyInfoScreen');
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
