/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {Component} from 'react';
import {FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moment from "moment";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import MainScreen from "./src/MainScreen";
import SplashScreen from "./src/SplashScreen";

const Stack = createNativeStackNavigator()


function MainStack(){
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: 'tomato' },
            }}
            initialRouteName={"SplashScreen"}>
            <Stack.Screen name={"SplashScreen"} component={SplashScreen}/>
            <Stack.Screen name={"MainScreen"} component={MainScreen}/>
        </Stack.Navigator>
    )
}


// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知



const milkTags = ["纯奶粉", "母乳", "混合喂养"] // 牛奶类型
const poopTags = ["黄色", "褐色", "胎便", "墨绿色", "奶瓣"] // 拉屎类型
const peeTags = ["少量", "中量", "多量", "黄色", "白色"] // 撒尿类型
const typeMap = {
    1: "吃奶", // 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加
    2: "拉屎",
    3: "撒尿",
    4: "测黄疸",
    5: "吐奶",
}

// 测试用数据json，用来存储本地的数据，比如typeMap可以通过动态进行添加存储在本地
const tempJsonData = {
    dataList: [
        {
            type: 1, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
            time: moment().valueOf(), // 时间戳
            remark: "", // 备注
            tags: milkTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
            selectedTags: ["母乳"], // 选中的类型
            dose: 0, // 剂量，母乳多少毫升
            pictures: [{
                time: moment().valueOf(), // 时间戳
                name: "", // 名称：使用类型和时间戳来标记
                url: "" // 图片在地址/远程地址
            }], // 图片
            yellowValue: {
                header: 0, // 头的黄疸
                chest: 0 // 胸的黄疸
            }
        }
    ]
}

export default class App extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            dataList: tempJsonData.dataList // 本地的存储的数据列表
        }
    }

    componentDidMount() {
        // 获取本地的数据

    }

    render() {
        console.log("datalist", this.state.dataList)
        return (
            <SafeAreaView>
                <MainScreen/>
            </SafeAreaView>
        )
    }
}
