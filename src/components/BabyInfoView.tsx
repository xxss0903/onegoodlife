import React, {Component} from "react";
import {View, Text} from "react-native";
import {mainData} from "../mainData";

export default class BabyInfoView extends Component<any, any> {
    render() {
        return (
           <View>
               <Text>{mainData.babyInfo.nickname}</Text>
           </View>
        )
    }
}