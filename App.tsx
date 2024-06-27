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
import TypeMangeScreen from './src/TypeMangeScreen';
import NewLifeDetailScreen from './src/NewLifeDetailScreen';
import AllTypeScreen from './src/AllTypeScreen';
import BabyInfoScreen from './src/BabyInfoScreen';
import BabiesScreen from './src/BabiesScreen';

const Stack = createNativeStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'SplashScreen'}>
      <Stack.Screen name={'SplashScreen'} component={SplashScreen} />
      <Stack.Screen name={'MainScreen'} component={MainScreen} />
      <Stack.Screen name={'TypeMangeScreen'} component={TypeMangeScreen} />
      <Stack.Screen
        name={'NewLifeDetailScreen'}
        component={NewLifeDetailScreen}
      />
      <Stack.Screen name={'AllTypeScreen'} component={AllTypeScreen} />
      <Stack.Screen name={'BabyInfoScreen'} component={BabyInfoScreen} />
      <Stack.Screen name={'BabiesScreen'} component={BabiesScreen} />
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
        <NavigationContainer>{MainStack()}</NavigationContainer>
      </NativeBaseProvider>
    );
  }
}
