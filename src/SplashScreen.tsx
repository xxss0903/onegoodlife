import React from "react";
import {View} from "react-native";
import {DeviceStorage} from "./utils/deviceStorage";


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
    }
}