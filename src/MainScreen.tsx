// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知

import React from "react";
import moment from "moment";
import {FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button, Modal} from "native-base";

const milkTags = ["纯奶粉", "母乳", "混合喂养"] // 牛奶类型
const poopTags = ["黄色", "褐色", "胎便", "墨绿色", "奶瓣"] // 拉屎类型
const peeTags = ["少量", "中量", "多量", "黄色", "白色"] // 撒尿类型
const typeMap = {
    1: "吃奶", // 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加
    2: "拉屎",
    3: "撒尿",
    4: "测黄疸",
    5: "吐奶",
}

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

    constructor(props) {
        super(props);
        this.state = {
            dataList: tempJsonData.dataList // 本地的存储的数据列表
        }
    }

    componentDidMount() {
        // 获取本地的数据

    }

    setShowModal(show){
        this.setState({
            showAddModal: show
        })
    }

    // 新增类型弹窗
    _renderAddModal() {
        return (
            <Modal isOpen={this.state.showAddModal} onClose={() => this.setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>Contact Us</Modal.Header>
                    <Modal.Body>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onPress={() => {
                        }}>
                            Cancel
                        </Button>
                        <Button onPress={() => {
                        }}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
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
                                let typeName = typeMap[item.type]
                                let time = moment(item.time).format("yyyy-MM-DD HH:mm")
                                let tags = item.selectedTags
                                let tagView = tags.map(value => {
                                    return (
                                        <View key={value}
                                              style={{padding: 8, backgroundColor: "#ff0000", borderRadius: 12}}>
                                            <Text style={{fontSize: 12}}>{value}</Text>
                                        </View>
                                    )
                                })
                                return (
                                    <View key={item.time} style={styles.timelineItemContainer}>
                                        <View style={styles.timelineItemType}>
                                            <Text>{typeName}</Text>
                                        </View>
                                        <View style={styles.timelineItemContent}>
                                            <Text>{time}</Text>
                                            <View style={{display: "flex", flexDirection: "row", marginTop: 12}}>
                                                {tagView}
                                            </View>
                                            {item.dose ? <View>{item.dose}</View> : null}
                                            {item.remark ? <Text style={{marginTop: 12}}>{item.remark}</Text> : null}
                                        </View>
                                    </View>
                                )
                            }}/>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={this._addNewLifeline}
                        style={styles.btnCreate}>
                        <Text>添加</Text>
                    </TouchableOpacity>
                    {this._renderAddModal()}
                </View>
            </SafeAreaView>
        )
    }

    // 添加新的时间线
    private _addNewLifeline() {
        console.log("add new timeline")
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
        backgroundColor: "#0000ff"
    },
    timelineItemContainer: {
        margin: 12,
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
    }
})