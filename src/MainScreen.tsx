// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知
// 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加

import React from 'react';
import {Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {commonStyles} from './commonStyle';
import {Colors} from './colors';
import HomeScreen from './HomeScreen';
import CommonKnowedgeScreen from './CommonKnowedgeScreen';
import MemoryScreen from './MemoryScreen';
import MineScreen from './MineScreen';

const MainTab = createBottomTabNavigator();

function CustomTabBar({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const homeOptions = descriptors[state.routes[0].key].options;
  const momentOptions = descriptors[state.routes[1].key].options;
  const knowedgeOptions = descriptors[state.routes[2].key].options;
  const mineOptions = descriptors[state.routes[3].key].options;
  const homeFocused = state.index === 0;
  const momentFocused = state.index === 1;
  const knowedgeFocused = state.index === 2;
  const mineFocused = state.index === 3;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[0].key,
            canPreventDefault: true,
          });

          if (!homeFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[0].name);
          }
        }}>
        <View style={[{flex: 1}, commonStyles.center]}>
          {homeOptions.tabBarIcon({focused: homeFocused})}
          <Text
            style={{
              fontSize: 12,
              color: homeFocused ? Colors.loginTouch : Colors.black333,
            }}>
            首页
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[1].key,
            canPreventDefault: true,
          });

          if (!momentFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[1].name);
          }
        }}>
        <View style={[{flex: 1}, commonStyles.center]}>
          {momentOptions.tabBarIcon({focused: momentFocused})}
          <Text
            style={{
              fontSize: 12,
              color: momentFocused ? Colors.loginTouch : Colors.black333,
            }}>
            瞬间
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[2].key,
            canPreventDefault: true,
          });

          if (!knowedgeFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[2].name);
          }
        }}>
        <View style={[{flex: 1}, commonStyles.center]}>
          {knowedgeOptions.tabBarIcon({focused: knowedgeFocused})}
          <Text
            style={{
              fontSize: 12,
              color: knowedgeFocused ? Colors.loginTouch : Colors.black333,
            }}>
            知识
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[3].key,
            canPreventDefault: true,
          });

          if (!mineFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[3].name);
          }
        }}>
        <View style={[{flex: 1}, commonStyles.center]}>
          {mineOptions.tabBarIcon({focused: mineFocused})}
          <Text
            style={{
              fontSize: 12,
              color: mineFocused ? Colors.loginTouch : Colors.black333,
            }}>
            我的
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default class MainScreen extends React.Component<any, any> {
  render() {
    return (
      <MainTab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0c7ffc',
          tabBarInactiveTintColor: '#333333',
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
          ],
        }}
        tabBar={props => <CustomTabBar {...props} />}>
        <MainTab.Screen
          name={'首页'}
          component={HomeScreen}
          options={{
            tabBarLabel: '首页',
            tabBarIcon: ({focused, color, size}) => {
              if (focused) {
                return (
                  <Image
                    source={require('./assets/ic_home.png')}
                    style={{width: 20, height: 20}}
                  />
                );
              } else {
                return (
                  <Image
                    source={require('./assets/ic_home_n.png')}
                    style={{width: 20, height: 20}}
                  />
                );
              }
            },
          }}
        />
        <MainTab.Screen
          name={'瞬间'}
          component={MemoryScreen}
          options={{
            tabBarLabel: '瞬间',
            tabBarIcon: ({focused, color, size}) => {
              if (focused) {
                return (
                  <Image
                    source={require('./assets/ic_moment.png')}
                    style={{width: 20, height: 20}}
                  />
                );
              } else {
                return (
                  <Image
                    source={require('./assets/ic_moment_n.png')}
                    style={{width: 20, height: 20}}
                  />
                );
              }
            },
          }}
        />
        <MainTab.Screen
          name={'知识'}
          component={CommonKnowedgeScreen}
          options={{
            tabBarLabel: '知识',
            tabBarIcon: ({focused, color, size}) => {
              if (focused) {
                return (
                  <Image
                    source={require('./assets/ic_knowedge.png')}
                    style={{width: 20, height: 20}}
                  />
                );
              } else {
                return (
                  <Image
                    source={require('./assets/ic_knowedge_n.png')}
                    style={{width: 20, height: 20}}
                  />
                );
              }
            },
          }}
        />
        <MainTab.Screen
          name={'我的'}
          component={MineScreen}
          options={{
            tabBarLabel: '我的',
            tabBarIcon: ({focused, color, size}) => {
              if (focused) {
                return (
                  <Image
                    source={require('./assets/ic_mine.png')}
                    style={{width: 20, height: 20}}
                  />
                );
              } else {
                return (
                  <Image
                    source={require('./assets/ic_mine_n.png')}
                    style={{width: 20, height: 20}}
                  />
                );
              }
            },
          }}
        />
      </MainTab.Navigator>
    );
  }
}
