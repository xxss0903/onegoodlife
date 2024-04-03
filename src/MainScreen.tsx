// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知
// 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加

import React from "react";
import moment from "moment";
import {FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FloatingAction} from "react-native-floating-action";
import Toast from 'react-native-toast-message';
import {logi} from "./utils/logutil";

// 常用的按钮列表，比如牛奶、拉屎、撒尿等快捷添加
const milkTags = ["纯奶粉", "母乳", "混合喂养"] // 牛奶类型
const poopTags = ["黄色", "褐色", "胎便", "墨绿色", "奶瓣"] // 拉屎类型
const peeTags = ["少量", "中量", "多量", "黄色", "白色"] // 撒尿类型
const typeMapList = [{id: 1, name: "牛奶", value: "type_1", text: "牛奶", position: 1}, {
    id: 2,
    name: "拉屎",
    value: "type_2", text: "拉屎", position: 2
}, {
    id: 3,
    name: "撒尿",
    value: "type_3", text: "撒尿", position: 3
}, {
    id: 4,
    name: "测黄疸",
    value: "type_4", text: "测黄疸", position: 4
}, {
    id: 5,
    name: "吐奶",
    value: "type_5", text: "吐奶", position: 5
}] // 类型列表
const commonActions = [typeMapList[0], typeMapList[1], typeMapList[2]] // 放在主页的主要使用的类型action
// 测试用数据json，用来存储本地的数据，比如typeMap可以通过动态进行添加存储在本地
const tempJsonData = {
    dataList: [
        {
            type: 1, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
            time: moment().valueOf(), // 时间戳
            remark: "", // 备注
            tags: milkTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
            selectedTags: ["母乳"], // 选中的类型
            dose: 0, // 剂量，母乳多少毫升
            pictures: [{
                time: moment().valueOf(), // 时间戳
                name: "", // 名称：使用类型和时间戳来标记
                url: "" // 图片在地址/远程地址
            }], // 图片
            yellowValue: {
                header: 0, // 头的黄疸
                chest: 0 // 胸的黄疸
            }
        }
    ]
}

export default class MainScreen extends React.Component<any, any> {
    private currentAddType: null; // 当前的添加类型
    private floatingActionRef: null; // 悬浮按钮引用

    constructor(props) {
        super(props);
        this.state = {
            dataList: tempJsonData.dataList, // 本地的存储的数据列表
            showAddModal: false
        }
    }

    componentDidMount() {
        // 获取本地的数据

    }

    setShowModal(show) {
        this.setState({
            showAddModal: show
        })
    }

    _renderModalFrame({headerView, contentView, footerView, cancelClick, confirmClick}) {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    this.setShowModal(!this.state.showAddModal)
                }}
                visible={this.state.showAddModal}>
                <View style={styles.addModalContainer}>

                    <View style={styles.addContentContainer}>
                        {headerView ? headerView : null}
                        {contentView ? <View style={{flex: 1}}>
                            {contentView}
                        </View> : null}
                        {footerView ? <View style={styles.line}></View> : null}
                        {footerView ? <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.btnModalFooter} onPress={() => {
                                if (cancelClick) {
                                    cancelClick()
                                }
                            }}>
                                <Text>取消</Text>
                            </TouchableOpacity>
                            <View style={{width: 1, backgroundColor: "#bbbbbb"}}></View>
                            <TouchableOpacity style={styles.btnModalFooter} onPress={() => {
                                if (confirmClick) {
                                    confirmClick()
                                }
                            }}>
                                <Text>确认</Text>
                            </TouchableOpacity>
                        </View> : null}
                    </View>
                </View>
            </Modal>
        )
    }

    // 新增类型弹窗
    _renderAddModal() {
        if (!this.currentAddType) {
            return
        }
        let contentView =
            <View>
                <Text>222</Text>
            </View>
        let headerView =
            <View style={{height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Text>添加{this.currentAddType.name}</Text>
            </View>
        return this._renderModalFrame(
            {
                headerView: headerView,
                contentView: contentView,
                footerView: true,
                cancelClick: () => {
                    this.setShowModal(false)
                },
                confirmClick: () => {
                    this.setShowModal(false)
                }
            }
        )
    }

    // 添加牛奶
    private _addMilk(item) {
        this.currentAddType = item
        // 添加牛奶的弹窗
        this.setShowModal(true)

        // // 根据之前添加的量默认添加dose剂量
        // let newData = {
        //     name: item.name,
        //     type: item.id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
        //     time: moment().valueOf(), // 时间戳
        //     remark: "", // 备注
        //     tags: [], // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
        //     selectedTags: [], // 选中的类型
        //     dose: 50, // 剂量，母乳多少毫升
        //     pictures: [{
        //         time: moment().valueOf(), // 时间戳
        //         name: "", // 名称：使用类型和时间戳来标记
        //         url: "" // 图片在地址/远程地址
        //     }], // 图片
        //     yellowValue: {
        //         header: 0, // 头的黄疸
        //         chest: 0 // 胸的黄疸
        //     }
        // }
        //
        // this.state.dataList.push(newData)
        // this.forceUpdate()
    }

    // 添加拉屎
    private _addPoop(item) {
        this.currentAddType = item
        this.setShowModal(true)
    }

    // 添加撒尿
    private _addPee(item) {
        this.currentAddType = item
        this.setShowModal(true)
    }

    // 添加新的时间线
    private _addNewLifeline(item) {
        console.log("add life line ", item)
        switch (item) {
            case typeMapList[0].name:
                this._addMilk(typeMapList[0])
                break;
            case typeMapList[1].name:
                this._addPoop(typeMapList[1])
                break;
            case typeMapList[2].name:
                this._addPee(typeMapList[2])
                break;
        }
    }

    _renderTypeItem(item) {
        let typeName = item.name
        let time = moment(item.time).format("yyyy-MM-DD HH:mm")
        let tags = item.selectedTags

        let tagView = null
        if (tags && tags.length > 0) {
            tagView = tags.map(value => {
                return (
                    <View key={value}
                          style={{padding: 8, backgroundColor: "#ff0000", borderRadius: 12}}>
                        <Text style={{fontSize: 12}}>{value}</Text>
                    </View>
                )
            })
        }

        console.log("list tagview", tagView)

        return (
            <View key={item.time} style={styles.timelineItemContainer}>
                <View style={styles.timelineItemType}>
                    <Text>{typeName}</Text>
                </View>
                <View style={styles.timelineItemContent}>
                    <Text>{time}</Text>
                    {tagView && tagView.length > 0 ?
                        <View style={{display: "flex", flexDirection: "row", marginTop: 12}}>
                            {tagView}
                        </View> : null}
                    {item.dose ? <Text>{item.dose}</Text> : null}
                    {item.remark ? <Text style={{marginTop: 12}}>{item.remark}</Text> : null}
                </View>
            </View>
        )
    }

    render() {
        console.log("datalist", this.state.dataList)
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.scrollContainer}>
                        <View style={styles.staticsContainer}>

                        </View>
                        <View style={styles.timelineContainer}>
                            <FlatList data={this.state.dataList} renderItem={({item, index}) => {
                                return this._renderTypeItem(item)
                            }}/>
                        </View>
                    </View>
                    <FloatingAction
                        distanceToEdge={{vertical: 100, horizontal: 40}}
                        buttonSize={60}
                        ref={(ref) => {
                            this.floatingActionRef = ref;
                        }}
                        actions={commonActions}
                        onPressItem={(item) => {
                            this._addNewLifeline(item)
                        }}
                    />
                    {this._renderAddModal()}
                </View>
            </SafeAreaView>
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
        flex: 1,
        Color: "#0000ff"
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
        width: 200,
        height: 200,
        backgroundColor: "#ffffff",
        shadowColor: "#bbbbbb",
        borderRadius: 12,
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
    }
})