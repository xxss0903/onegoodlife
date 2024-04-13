import React, {Component} from "react";
import {Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {mainData} from "../mainData";
import {commonStyles} from "../commonStyle";
import moment from "moment";
import {logi} from "../utils/logutil";

// 统计独立界面
export default class StaticsView extends Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            showAddModal: false,
            datepickerOpen: false,
            todayDataMap: new Map(),
            last24Data: new Map()
        }
    }

    _getStaticsDataView(dataList, callback) {
        // 获取分类数据
        let dataMap = new Map()
        for (let i = 0; i < dataList.length; i++) {
            let data = dataList[i]
            if (dataMap.has(data.name)) {
                let value = dataMap.get(data.name)
                // 统计次数
                value.value += 1
                // 如果是牛奶就添加牛奶总量
                if (data.name.indexOf("奶") >= 0) {
                    value.dose += data.dose
                }

                dataMap.set(data.name, value)
            } else {
                let obj = {value: 1, name: data.name}
                if (data.name.indexOf("奶") >= 0) {
                    obj.dose = data.dose
                }
                dataMap.set(data.name, obj)
            }
        }
        let sortedMap = new Map()
        mainData.typeMapList.forEach(value => {
            if (dataMap.has(value.name)) {
                sortedMap.set(value.name, dataMap.get(value.name))
            }
        })
        callback && callback(sortedMap)
    }

    componentDidMount() {
        this.refreshData()
    }

    refreshData(){
        let todayData = this._getTodayData()
        this._getStaticsDataView(todayData, (data) => {
            this.setState({
                todayDataMap: data
            }, () => {
            })
        })
        let last24Data = this._getLast24HoursData()
        this._getStaticsDataView(last24Data, (data) => {
            this.setState({
                last24Data: data
            }, () => {
            })
        })
    }
    
    // 获取今天的数据
    _getTodayData() {
        let dataList = this.props.dataList
        let tempDataList = []
        let todayMoment = moment().startOf('day').valueOf()
        for (let i = 0; i < dataList.length; i++) {
            let data = dataList[i]
            if (data.time > todayMoment) {
                // 常用的数据
                mainData.commonActions.forEach(value => {
                    if (value.id === data.typeId) {
                        tempDataList.push(data)
                    }
                })
            }
        }
        return JSON.parse(JSON.stringify(tempDataList))
    }

    // 获取过去24小时的数据
    _getLast24HoursData() {
        let dataList = this.props.dataList
        let tempDataList = []
        // 过去24小时的时间戳
        let last24HourMoment = moment().subtract(1, "day").valueOf()
        for (let i = 0; i < dataList.length; i++) {
            let data = dataList[i]
            if (data.time > last24HourMoment) {
                // 常用的数据
                mainData.commonActions.forEach(value => {
                    if (value.id === data.typeId) {
                        tempDataList.push(data)
                    }
                })
            }
        }
        return JSON.parse(JSON.stringify(tempDataList))
    }

    _renderDataMap(dataMap) {
        let keyArray = Array.from(dataMap.keys())
        let mapView = keyArray.map(key => {
            let data = dataMap.get(key)
            return (
                <View style={commonStyles.flexRow}>
                    <Text>{key}:{data.value}次</Text>
                    {data.dose > 0 ? <Text style={{}}>，共{data.dose}ml</Text> : null}
                </View>
            )
        })

        return (
            <View>
                {mapView}
            </View>
        )
    }

    render() {
        return (
            <View style={[commonStyles.flexColumn, {flex: 1, padding: 12}]}>
                {/*用户信息*/}
                <View style={{flex: 1}}>
                    <Text>{mainData.babyInfo.nickname}</Text>
                </View>
                {/*统计的数字信息*/}
                <View style={[commonStyles.flexRow, {flex: 1}]}>
                    {/*最近24小时统计*/}
                    <View style={[commonStyles.flexColumn, {flex: 1}]}>
                        <Text>最近24小时</Text>
                        {this._renderDataMap(this.state.last24Data)}
                    </View>
                    {/*当天的统计*/}
                    <View style={[commonStyles.flexColumn, {flex: 1}]}>
                        <Text>当天数据</Text>
                        {this._renderDataMap(this.state.todayDataMap)}
                    </View>
                </View>
            </View>

        )
    }
}


const styles = StyleSheet.create({})