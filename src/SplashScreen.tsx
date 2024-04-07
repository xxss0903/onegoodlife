import React from "react";
import {View} from "react-native";


export default class SplashScreen extends React.Component<any, any>{

    componentDidMount() {
        setTimeout(() => {
            // 进入主页
            this.props.navigation.replace("MainScreen")
        }, 2000)
    }

    render(){
        return (
            <View></View>
        )
    }
}