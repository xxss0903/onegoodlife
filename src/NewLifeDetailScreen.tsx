import React from "react";
import {View, Text, Image, TouchableOpacity, TextInput} from "react-native";
import moment from "moment";
import {formatTime, formatTimeToDate} from "./utils/until";
import {logi} from "./utils/logutil";
import DatePicker from "react-native-date-picker";
import {commonStyles} from "./commonStyle";

// 记录的记录详情
export default class NewLifeDetailScreen extends React.Component<any, any> {

    constructor(props) {
        super(props);
        let data = JSON.parse(JSON.stringify(this.props.route.params?.data))
        this.state = {
            data: data,
            datepickerOpen: false
        }

    }

    componentDidMount() {

    }


    _toggleDatetimePicker(open) {
        this.setState({
            datepickerOpen: open
        })
    }

    // 确认修改
    _confirmEditData(){

    }

    _renderTagViewList(tags, selectedTags, callback, isView = false, isMultiSelect = false) {
        let tagView = tags.map((value, index) => {
            let selected = false
            if (isView) {
                selected = true
            } else {
                if (selectedTags && selectedTags.length > 0) {
                    selected = selectedTags.indexOf(value) >= 0
                }
            }
            let bgColor = selected ? "#ff0000" : "#ffffff"
            return (
                <TouchableOpacity
                    disabled={!callback}
                    onPress={() => {
                        let tagIndex = selectedTags.indexOf(value)
                        logi("tag index", tagIndex + " # " + value)
                        if (isMultiSelect) {
                            // 多选
                            if (tagIndex >= 0) {
                                // 选中了要去掉
                                selectedTags.splice(tagIndex, 1)
                            } else {
                                // 需要添加
                                selectedTags.push(value)
                            }
                        } else {
                            // 单选
                            selectedTags.splice(0, selectedTags.length)
                            selectedTags.push(value)
                        }


                        if (callback) {
                            callback(value)
                        }
                    }}
                    key={value}
                    style={{padding: 8, backgroundColor: bgColor, borderRadius: 12, marginRight: 12, marginTop: 12}}>
                    <Text style={{color: "#333333"}}>{
                        value
                    }</Text>
                </TouchableOpacity>
            )
        })

        return (
            <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                {tagView}
            </View>
        )
    }


    render() {
        const {time, remark, name, selectedTags, tags} = this.state.data
        return (
            <View style={[commonStyles.flexColumn, {flex: 1, padding: 12}]}>
                {/*记录内容*/}
                <View>
                    <Text>类型：{name}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            this._toggleDatetimePicker(true)
                        }}>
                        <Text>时间：{formatTime(time)}</Text>
                    </TouchableOpacity>
                    <View>
                        <Text>标签</Text>
                        {selectedTags ? this._renderTagViewList(tags, selectedTags, (tag) => {
                            this.forceUpdate()
                        }, false, name.indexOf("奶") < 0) : null}
                    </View>
                    <View style={{minHeight: 80, marginTop: 12}}>
                        <TextInput
                            style={[{
                                fontSize: 14,
                                flex: 1,
                                backgroundColor: "#eeeeee",
                                color: "#333333",
                            }]}
                            multiline={true}
                            value={remark}
                            onChangeText={(text) => {
                                this.state.data.remark = text
                                this.forceUpdate()
                            }}
                            placeholderTextColor={"#bbbbbb"}
                            keyboardType={'default'}
                            placeholder={"请输入备注"}/>
                    </View>
                </View>
                {/*记录图片*/}
                <View style={{flex: 1}}>
                    <Image/>
                </View>
                <View style={[commonStyles.flexRow, {height: 60}]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}
                        style={[{flex: 1}, commonStyles.center]}>
                        <Text>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[{flex: 1}, commonStyles.center]}
                        onPress={() => {
                            // 修改数据
                            this._confirmEditData()
                        }}>
                        <Text>确认</Text>
                    </TouchableOpacity>
                </View>
                <DatePicker
                    is24hourSource="locale"
                    open={this.state.datepickerOpen}
                    date={new Date(time)}
                    modal={true}
                    mode={"datetime"}
                    onConfirm={(date) => {
                        // 确认选择，将日期转为时间戳
                        this.state.data.time = moment(date).valueOf()
                        this.state.data.key = this.state.data.time
                        let formatTime = moment(this.state.data.time).format("yyyy-MM-DD HH:mm")
                        logi("confirm date", date + " # " + formatTime)
                        this._toggleDatetimePicker(false)
                    }}
                    onCancel={() => {
                        this.setState({
                            datepickerOpen: false
                        })
                    }}/>
            </View>
        )
    }
}