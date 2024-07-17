// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知
// 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加

import React from 'react';
import {Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {commonStyles} from './commonStyle';
import {Colors} from './colors';
import HomeScreen from './HomeScreen';
import MemoryScreen from './MemoryScreen';
import MineScreen from './MineScreen';
import StaticsScreen from './StaticsScreen.tsx';
import {NavigationContainer} from "@react-navigation/native";
import {SafeAreaInsetsContext} from "react-native-safe-area-context";

const MainTab = createBottomTabNavigator();

function CustomTabBar({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const homeOptions = descriptors[state.routes[0].key].options;
  const momentOptions = descriptors[state.routes[1].key].options;
  const mineOptions = descriptors[state.routes[2].key].options;
  const homeFocused = state.index === 0;
  const momentFocused = state.index === 1;
  const mineFocused = state.index === 2;

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
            统计
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

          if (!mineFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[2].name);
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
        <SafeAreaInsetsContext.Consumer>
            {(insets) =>
                <View
                    style={{flex: 1, paddingBottom: insets?.bottom, backgroundColor: Colors.grayEe}}>
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
                            name={'统计'}
                            component={StaticsScreen}
                            options={{
                                tabBarLabel: '统计',
                                tabBarIcon: ({focused, color, size}) => {
                                    if (focused) {
                                        return (
                                            <Image
                                                source={require('./assets/ic_statics.png')}
                                                style={{width: 20, height: 20}}
                                            />
                                        );
                                    } else {
                                        return (
                                            <Image
                                                source={require('./assets/ic_statics_n.png')}
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
                </View>
            }
        </SafeAreaInsetsContext.Consumer>
    );
  }
}
