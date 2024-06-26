// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知
// 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加

import React from "react";
import {SafeAreaView, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Colors} from "./colors";
import {commonStyles} from "./commonStyle";
import {SwipeListView} from "react-native-swipe-list-view";
import {logi} from "./utils/logutil";
import {deleteDataByTime} from "./utils/dbService";
import App from "../App";

export default class MemoryScreen extends React.Component<any, any> {

    private isTypeEdit: boolean = false // 是否是编辑模式

    _renderItem(item, index){
        return (
            <View></View>
        )
    }

    onRowDidOpen = (rowKey, rowMap) => {
    };


    closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            logi("close row ", rowMap[rowKey].closeRow())
            rowMap[rowKey].closeRow()
        }
    };

    deleteRow = (rowMap, rowKey, data) => {
        this.closeRow(rowMap, rowKey)
        let index = this.state.dataList.findIndex(value => value.key === rowKey)
        logi("delete index ", index)
        // 删除数据
        let dataList = this.state.dataList
        dataList.splice(index, 1)
        this.setState({
            dataList: dataList
        })
        this._refreshLocalData()
        // 数据库删除数据
        this._refreshStaticsCharts()
        deleteDataByTime(App.db, data.time)
    };

    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <View>
                        <SwipeListView
                            data={[]}
                            renderItem={({item, index}) => {
                                return this._renderItem(item, index)
                            }}
                            renderHiddenItem={(data, rowMap) => {
                                return (
                                    <View style={styles.rowBack}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                // 拍照
                                            }}
                                            style={[styles.photoLeftBtn]}>
                                            <Text>拍照</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.backRightBtn, styles.backRightBtnRight]}
                                            onPress={() => {
                                                this.deleteRow(rowMap, data.item.key, data.item)
                                            }}
                                        >
                                            <Text style={styles.backTextWhite}>删除</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                            rightOpenValue={-150}
                            previewOpenValue={-40}
                            previewOpenDelay={1000}
                            onRowDidOpen={(rowKey, rowMap, toValue) => this.onRowDidOpen(rowKey, rowMap)}/>

                    </View>
                    <TouchableOpacity style={[styles.btnFloating, commonStyles.center]}>
                        <Text>Add</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100%"
    },
    btnFloating:{
        position: "absolute",
        bottom: 50,
        right: 40,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.loginTouch
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
})