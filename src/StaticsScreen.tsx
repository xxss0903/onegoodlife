// 统计界面，整体的统计数据

import React from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {Colors} from './colors';
import {commonStyles} from './commonStyle';
import BaseScreen from './BaseScreen.tsx';
import {Margin} from './space';
import DrinkMilkStaticsCard from './components/DrinkMilkStaticsCard.tsx';
import {StaticsType, mainData, staticsTypeList} from './mainData.ts';
import {screenH} from './utils/until';
import EventBus from './utils/eventBus';
import {FloatingAction} from 'react-native-floating-action';
import MixMilkStaticsCard from './components/MixMilkStaticsCard.tsx';
import MotherMilkStaticsCard from './components/MotherMilkStaticsCard.tsx';
import WeightStaticsCard from './components/WeightStaticsCard.tsx';
import HeightStaticsCard from './components/HeightStaticsCard.tsx';

export default class StaticsScreen extends BaseScreen {
  private milkCardRef = null; // 喝奶统计卡片
  private growthCardRef = null; // 成长统计
  private cardRefList: any[] = []; // 统计卡片的引用列表

  constructor(props) {
    super(props);
    this.state = {
      staticsType: StaticsType.DAY,
      refreshing: false,
      staticsList: [], // 统计列表，统计比如喝奶次数，拉屎次数等，可以自行配置
      dataList: [], // 所有的数据
      dataType: StaticsType.DAY, // 统计类型，按天还是按周统计
    };
  }

  componentDidMount() {
    this._getDataList();
    this._initListeners();
  }

  _initListeners() {
    let colorListener = EventBus.addEventListener(
      EventBus.REFRESH_GRADIENT_COLOR,
      () => {
        console.log('refresh statics screen color change');
        this.forceUpdate();
      },
    );
    console.log('statics listen color change ', colorListener);
  }

  async _getDataList() {
    this.setState({
      refreshing: true,
    });
    setTimeout(() => {
      this.setState({
        refreshing: false,
      });
    }, 1000);
    this.cardRefList.forEach(ref => {
      ref.refreshData();
    });
  }

  _addStaticsCard(typeName: string) {
    staticsTypeList.forEach(value => {
      if (value.name === typeName) {
        if (mainData.staticsCardList.indexOf(value) >= 0) {
        } else {
          mainData.staticsCardList.push(value);
        }
      }
    });
    this.forceUpdate(() => {
      this._getDataList();
    });
  }

  _renderHealthTip() {}

  // 统计卡片列表
  _renderStaticsList() {
    let staticsListView = mainData.staticsCardList.map((value, index) => {
      let view = null;
      switch (value.type) {
        case StaticsType.MIX:
          view = (
            <MixMilkStaticsCard
              key={`id_${value.id}`}
              ref={ref => this.cardRefList.push(ref)}
            />
          );
          break;
        case StaticsType.MOTHERMILK:
          view = (
            <MotherMilkStaticsCard
              key={`id_${value.id}`}
              ref={ref => this.cardRefList.push(ref)}
            />
          );
          break;
        case StaticsType.POWDER:
          view = (
            <DrinkMilkStaticsCard
              key={`id_${value.id}`}
              ref={ref => this.cardRefList.push(ref)}
            />
          );
          break;
        case StaticsType.WEIGHT:
          view = (
            <WeightStaticsCard
              key={`id_${value.id}`}
              ref={ref => this.cardRefList.push(ref)}
            />
          );
          break;
        case StaticsType.HEIGHT:
          view = (
            <HeightStaticsCard
              key={`id_${value.id}`}
              ref={ref => this.cardRefList.push(ref)}
            />
          );
          break;
      }
      if (view) {
        return (
          <View key={`id_${value.id}`} style={{marginBottom: Margin.vertical}}>
            {view}
          </View>
        );
      }
    });
    console.log('render card list', staticsListView);
    return <View style={[commonStyles.flexColumn]}>{staticsListView}</View>;
  }

  renderScreen() {
    return (
      <View style={[commonStyles.flexColumn, {flex: 1}]}>
        <ScrollView
          style={{
            flex: 1,
            height: screenH,
            display: 'flex',
            flexDirection: 'column',
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                // 刷新数据
                this._getDataList();
              }}
            />
          }>
          <View
            style={[
              commonStyles.flexColumn,
              {
                flex: 1,
                paddingTop: Margin.horizontal,
                paddingBottom: Margin.horizontal,
              },
            ]}>
            <View>{this._renderHealthTip()}</View>
            <View>{this._renderStaticsList()}</View>
          </View>
        </ScrollView>
        <FloatingAction
          distanceToEdge={{vertical: 50, horizontal: 40}}
          buttonSize={60}
          ref={ref => {
            this.floatingActionRef = ref;
          }}
          actions={staticsTypeList}
          onPressItem={typeName => {
            console.log('click item', typeName);
            this._addStaticsCard(typeName);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activeTab: {
    height: 2,
    backgroundColor: Colors.black333,
    width: 20,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
    height: 30,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  btnFloating: {
    position: 'absolute',
    bottom: 50,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.loginTouch,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#dddddd',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  photoLeftBtn: {
    alignItems: 'center',
    bottom: 0,
    left: 0,
    top: 0,
    justifyContent: 'center',
    position: 'absolute',
    width: 75,
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
});
