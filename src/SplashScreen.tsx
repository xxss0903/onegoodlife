import React from "react";
import {View} from "react-native";
import {DeviceStorage} from "./utils/deviceStorage";
var SQLite = require('react-native-sqlite-storage')


export default class SplashScreen extends React.Component<any, any>{

    componentDidMount() {
        setTimeout(() => {
            // 进入主页
            this.props.navigation.replace("MainScreen")
        }, 2000)
        this._initData()
    }

    render(){
        return (
            <View></View>
        )
    }

    _initData() {
        DeviceStorage.getMainData()
        SQLite.openDatabase({name: 'my.db', location: 'default'}, () => {

        }, () => {

        });
    }
}