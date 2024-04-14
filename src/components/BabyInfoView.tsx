import React, {Component} from "react";
import {View, Text, Image} from "react-native";
import {mainData} from "../mainData";
import moment from "moment";
import {commonStyles} from "../commonStyle";
import EventBus from "../utils/eventBus";
import {logi} from "../utils/logutil";

export default class BabyInfoView extends Component<any, any> {

    componentDidMount() {
        logi("baby name ", this.props.baby)
        EventBus.addEventListener(EventBus.REFRESH_BABY_INFO, () => {
            this.forceUpdate()
        })
    }

    _getBirthDay(){
        return moment().diff(moment(mainData.babyInfo.birthDay), "day")
    }

    render() {
        return (
            <View style={[{flex: 1, padding: 12}, commonStyles.center]}>
                <Image style={{width: 48, height: 48, borderRadius: 24}}
                       source={{
                           uri: mainData.babyInfo.avatar,
                       }}/>
                <Text>昵称：{this.props.baby.nickname}</Text>
                <Text>宝宝出生：{this._getBirthDay()}天啦</Text>
            </View>
        )
    }
}