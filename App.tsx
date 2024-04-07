/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {Component} from 'react';
import moment from "moment";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import MainScreen from "./src/MainScreen";
import SplashScreen from "./src/SplashScreen";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HomeScreen from "./src/HomeScreen";
import {NavigationContainer} from "@react-navigation/native";
import MineScreen from "./src/MineScreen";
import CommonKnowedgeScreen from "./src/CommonKnowedgeScreen";
import MemoryScreen from "./src/MemoryScreen";
import {Image, TouchableWithoutFeedback, View} from "react-native";
import {logi} from "./src/utils/logutil";
import {Colors} from "./src/colors";
import {commonStyles} from "./src/commonStyle";
import {NativeBaseProvider} from "native-base";

const Stack = createNativeStackNavigator()
const BottomTab = createBottomTabNavigator()

function CustomTabBar({state, descriptors, navigation}) {
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    if (focusedOptions.tabBarVisible === false) {
        return null;
    }

    const homeOptions = descriptors[state.routes[0].key].options;
    const mineOptions = descriptors[state.routes[1].key].options;
    const homeFocused = state.index === 0;
    const mineFocused = state.index === 1;

    return (
        <View style={[{flexDirection: 'row', height: 60, justifyContent: "center", alignItems: "center"}]}>
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
                    <Text style={{fontSize: 12, color: homeFocused ? Colors.loginTouch : Colors.black333}}>首页</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
                style={{flex: 1}}
                onPress={() => {

                }}>
                <View style={[{flex: 1}, commonStyles.center]}>
                    <Image style={{width: 55, height: 55, marginBottom: 10}} source={require('./src/assets/ic_scan.png')}/>
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

                    if (!mineFocused && !event.defaultPrevented) {
                        navigation.navigate(state.routes[1].name);
                    }
                }}>
                <View style={[{flex: 1}, commonStyles.center]}>
                    {mineOptions.tabBarIcon({focused: mineFocused})}
                    <Text style={{fontSize: 12, color: mineFocused ? Colors.loginTouch : Colors.black333}}>我的</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

function BottomTabs() {
    return (
        <BottomTab.Navigator>
            {/*首页，添加喂奶等记录，主要功能*/}
            <BottomTab.Screen name={"Home"} component={HomeScreen}/>
            {/*养娃常用知识*/}
            <BottomTab.Screen name={"CommonKnowedge"} component={CommonKnowedgeScreen}/>
            {/*回忆点滴界面，保存图片视频等*/}
            <BottomTab.Screen name={"Memory"} component={MemoryScreen}/>
            {/*我的界面，用来登录，设置等*/}
            <BottomTab.Screen name={"Mine"} component={MineScreen}/>
        </BottomTab.Navigator>
    )
}


function MainStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={"SplashScreen"}>
            <Stack.Screen name={"SplashScreen"} component={SplashScreen}/>
            <Stack.Screen name={"MainScreen"} component={MainScreen}/>
        </Stack.Navigator>
    )
}


// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知


export default class App extends React.Component<any, any> {

    render() {
        return (
            <NativeBaseProvider>
                <NavigationContainer>
                    {MainStack()}
                </NavigationContainer>
            </NativeBaseProvider>
        )
    }
}
