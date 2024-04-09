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
            todayDataMap: new Map()
        }
    }

    _getStaticsDataView(dataList) {
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
                logi("set milk dose ", obj)
                dataMap.set(data.name, obj)
            }
        }
        let sortedMap = new Map()
        mainData.typeMapList.forEach(value => {
            if (dataMap.has(value.name)) {
                sortedMap.set(value.name, dataMap.get(value.name))
            }
        })

        this.setState({
            todayDataMap: sortedMap
        }, () => {
            logi("data map", this.state.todayDataMap)
            logi("data map", this.state.todayDataMap)
        })
    }

    componentDidMount() {
        this.refreshData()
    }

    refreshData(){
        let todayData = this._getTodayData()
        this._getStaticsDataView(todayData)


        let last24Data = this._getLast24HoursData()
        logi("today data ", todayData)
    }
    
    // 获取今天的数据
    _getTodayData() {
        let dataList = this.props.dataList
        let tempDataList = []
        let todayMoment = moment().startOf('day').valueOf()
        for (let i = 0; i < dataList.length; i++) {
            let data = dataList[i]
            if (data.time > todayMoment) {
                tempDataList.push(data)
            }
        }
        logi("last day data ", tempDataList)
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
                tempDataList.push(data)
            }
        }
        logi("last 24 hour data ", tempDataList)
        return JSON.parse(JSON.stringify(tempDataList))
    }

    _renderDataMap(dataMap) {
        for (const key in dataMap) {
            let data = dataMap[key]

        }
        let keyArray = Array.from(dataMap.keys)
        let mapView = keyArray.map(key => {
            return (
                <View>
                    <Text>{key}:{dataMap[key].value}</Text>
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
            <View style={[commonStyles.flexColumn, {flex: 1}]}>
                {/*用户信息*/}
                <View style={{flex: 1}}>
                    <Text>{mainData.babyInfo.nickname}</Text>
                </View>
                {/*统计的数字信息*/}
                <View style={[commonStyles.flexRow, {flex: 1}]}>
                    {/*最近24小时统计*/}
                    <View style={[commonStyles.flexColumn, {flex: 1}]}>
                        <Text>最近24小时</Text>
                        {this._renderDataMap(this.state.todayDataMap)}
                    </View>
                    {/*当天的统计*/}
                    <View style={[commonStyles.flexColumn, {flex: 1}]}>
                        <Text>当天数据</Text>
                    </View>
                </View>
            </View>

        )
    }
}


const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column"
    },
    staticsContainer: {
        height: 200,
    },
    timelineContainer: {
        backgroundColor: '#dddddd',
        flex: 1,
    },
    timelineItemContainer: {
        marginBottom: 12,
        marginHorizontal: 12,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#ffffff",
        padding: 12,
        borderRadius: 12
    },
    timelineItemContent: {
        display: "flex",
        flexDirection: "column",
    },
    timelineItemType: {
        width: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100%"
    },
    btnCreate: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 48,
        bottom: 128,
        backgroundColor: "#ff0000",
        width: 80,
        height: 80,
        borderRadius: 40
    },
    addModalContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#00000033"
    },
    addContentContainer: {
        width: "80%",
        minHeight: 400,
        backgroundColor: "#ffffff",
        shadowColor: "#bbbbbb",
        borderRadius: 12,
        padding: 12
    },
    modalFooter: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    },
    btnModalFooter: {
        height: 48,
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    line: {
        height: 1,
        backgroundColor: "#bbbbbb"
    },
    emptyViewContainer: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 100
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#dddddd',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    photoLeftBtn: {
        alignItems: 'center',
        bottom: 0,
        left: 0,
        top: 0,
        justifyContent: 'center',
        position: 'absolute',
        width: 75,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        right: 75,
    },
    backRightBtnRight: {
        right: 0,
    },
    backTextWhite: {
        color: '#ffffff',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    exportActionsContainer: {
        position: "absolute",
        bottom: 180,
        right: 48,
        width: 60,
        height: 148,
        display: "flex",
        flexDirection: "column"
    },
    btnExportAction: {
        width: 60,
        color: "white",
        height: 60,
        borderRadius: 30,
        display: "flex",
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "blue"
    }
})