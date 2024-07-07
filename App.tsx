/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {Component} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from './src/MainScreen';
import SplashScreen from './src/SplashScreen';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import TypeManageScreen from './src/TypeManageScreen';
import NewLifeDetailScreen from './src/NewLifeDetailScreen';
import AllTypeScreen from './src/AllTypeScreen';
import BabyInfoScreen from './src/BabyInfoScreen';
import BabiesScreen from './src/BabiesScreen';
import UserInfoScreen from './src/UserInfoScreen.tsx';
import {RootSiblingParent} from 'react-native-root-siblings';
import PrivacyScreen from './src/PrivacyScreen.tsx';
import VersionScreen from './src/VersionScreen.tsx';

const Stack = createNativeStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName={'SplashScreen'}
      screenOptions={{headerTitleAlign: 'center'}}>
      <Stack.Screen
        name={'SplashScreen'}
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'MainScreen'}
        component={MainScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name={'类型管理'} component={TypeManageScreen} />
      <Stack.Screen
        name={'NewLifeDetailScreen'}
        component={NewLifeDetailScreen}
        options={{title: '类型'}}
      />
      <Stack.Screen
        name={'AllTypeScreen'}
        component={AllTypeScreen}
        options={{title: '全部类型'}}
      />
      <Stack.Screen name={'BabyInfoScreen'} component={BabyInfoScreen} />
      <Stack.Screen
        name={'BabiesScreen'}
        component={BabiesScreen}
        options={{title: '宝宝列表'}}
      />
      <Stack.Screen
        name={'UserInfoScreen'}
        component={UserInfoScreen}
        options={{title: '我的信息'}}
      />
      <Stack.Screen
        name={'PrivacyScreen'}
        component={PrivacyScreen}
        options={{title: '隐私和协议'}}
      />
      <Stack.Screen
        name={'VersionScreen'}
        component={VersionScreen}
        options={{title: '应用信息'}}
      />
    </Stack.Navigator>
  );
}

// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知

export default class App extends Component<any, any> {
  static db = null;

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <NativeBaseProvider>
        <RootSiblingParent>
          <NavigationContainer>{MainStack()}</NavigationContainer>
        </RootSiblingParent>
      </NativeBaseProvider>
    );
  }
}
