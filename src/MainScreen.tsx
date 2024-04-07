// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知
// 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加

import React from "react";
import {Image, Text, TouchableWithoutFeedback, View} from "react-native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {commonStyles} from "./commonStyle";
import {Colors} from "./colors";
import HomeScreen from "./HomeScreen";
import CommonKnowedgeScreen from "./CommonKnowedgeScreen";
import MemoryScreen from "./MemoryScreen";
import MineScreen from "./MineScreen";
import {Icon} from "native-base";


const Stack = createNativeStackNavigator()
const MainTab = createBottomTabNavigator()

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
                    <Image style={{width: 55, height: 55, marginBottom: 10}} source={require('./assets/ic_scan.png')}/>
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
        <MainTab.Navigator>
            {/*首页，添加喂奶等记录，主要功能*/}
            <MainTab.Screen name={"Home"} component={HomeScreen}/>
            {/*养娃常用知识*/}
            <MainTab.Screen name={"CommonKnowedge"} component={CommonKnowedgeScreen}/>
            {/*回忆点滴界面，保存图片视频等*/}
            <MainTab.Screen name={"Memory"} component={MemoryScreen}/>
            {/*我的界面，用来登录，设置等*/}
            <MainTab.Screen name={"Mine"} component={MineScreen}/>
        </MainTab.Navigator>
    )
}


export default class MainScreen extends React.Component<any, any> {

    render(){
        return (
            <MainTab.Navigator
                screenOptions={{
                    headerShown: false
                }}
                tabBar={props => <CustomTabBar {...props} />}
                tabBarOptions={{
                    activeTintColor: Colors.loginTouch,
                    inactiveTintColor: Colors.black333,
                }}>
                <MainTab.Screen
                    name={'首页'} component={HomeScreen}
                    options={{
                        tabBarLabel: '首页',
                        tabBarIcon: ({focused, color, size}) => {
                            if (focused) {
                                return (
                                    <Icon name={'home'} type={'Entypo'} style={{color: Colors.loginTouch}}/>
                                );
                            } else {
                                return (
                                    <Icon name={'home'} type={'Entypo'} style={{color: Colors.black333}}/>
                                );
                            }
                        },
                    }}/>
                <MainTab.Screen
                    name={'我的'} component={MineScreen}
                    options={{
                        tabBarLabel: '我的',
                        tabBarIcon: ({focused, color, size}) => {
                            if (focused) {
                                return (
                                    <Icon name={'user'} type={'FontAwesome'} style={{color: Colors.loginTouch}}/>
                                );
                            } else {
                                return (
                                    <Icon name={'user'} type={'FontAwesome'} style={{color: Colors.black333}}/>
                                );
                            }
                        },
                    }}/>
            </MainTab.Navigator>
        )
    }
}