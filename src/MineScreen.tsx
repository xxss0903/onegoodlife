import React from "react";
import {TouchableOpacity, View, Text} from "react-native";


export default class MineScreen extends React.Component<any, any> {
    render() {
        return (
            <View>
                <View>

                </View>
                <View>
                    <TouchableOpacity
                    onPress={() => {
                        this._setBirthInfo()
                    }}>
                        <Text>出生设置</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    // 设置出生日期等信息
    _setBirthInfo() {

    }
}