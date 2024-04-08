import React from "react";
import {View, Text, Image} from "react-native";
import moment from "moment";
import {formatTime, formatTimeToDate} from "./utils/until";

// 记录的记录详情
export default class NewLifeDetailScreen extends React.Component<any, any> {

    constructor(props) {
        super(props);
        let data = this.props.route.params?.data
        this.state = {
            data: data
        }

    }

    componentDidMount() {

    }


    render() {
        const {time, remark, name, selectedTags} = this.state.data
        return (
            <View>
                {/*记录内容*/}
                <View>
                    <Text>类型：{name}</Text>
                    <Text>时间：{formatTime(time)}</Text>
                    {selectedTags ? <Text>标签：{selectedTags}</Text> : null}
                    {remark ? <Text>备注：{remark}</Text> : null}
                </View>
                {/*记录图片*/}
                <View>
                    <Image/>
                </View>
            </View>
        )
    }
}