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
import TypeMangeScreen from "./src/TypeMangeScreen";
import NewLifeDetailScreen from "./src/NewLifeDetailScreen";
import AllTypeScreen from "./src/AllTypeScreen";
import {createLifeRecordTable, deleteTable, getDataList, getDBConnection, saveDataList} from "./src/utils/dbService";

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

function MainStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={"SplashScreen"}>
            <Stack.Screen name={"SplashScreen"} component={SplashScreen}/>
            <Stack.Screen name={"MainScreen"} component={MainScreen}/>
            <Stack.Screen name={"TypeMangeScreen"} component={TypeMangeScreen}/>
            <Stack.Screen name={"NewLifeDetailScreen"} component={NewLifeDetailScreen}/>
            <Stack.Screen name={"AllTypeScreen"} component={AllTypeScreen}/>
        </Stack.Navigator>
    )
}


// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知


export default class App extends React.Component<any, any> {

    static db = null

    constructor(props) {
        super(props);
        this._initDb()
    }

    // 初始化数据库，首先连接本地数据库，然后如果没有表则创建表
    async _initDb() {
        try {
            // 首先创建数据库链接
            App.db = await getDBConnection()
            logi("connect db ", App.db)
            // await deleteTable(App.db)
            await createLifeRecordTable(App.db)
            // const localDataList = await getDataList(db)
            // logi("get localdata list ", localDataList)
            // let dataList = [{id: 1, typeId: 1, name: "喝奶"}]
            // if (localDataList && localDataList.length > 0) {
            //     logi("get datalist result ", localDataList)
            // } else {
            //     logi("insert data to table", dataList)
            //     // 存入本地数据库
            //     await saveDataList(db, dataList)
            //
            //     const localDataList2 = await getDataList(db)
            //     logi("get localdata list 2", localDataList2)
            // }
        } catch (e) {
            logi("init db error ", e)
        }
    }

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
