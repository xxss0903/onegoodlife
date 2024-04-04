// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知
// 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加

import React from "react";
import moment from "moment";
import {FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {FloatingAction} from "react-native-floating-action";
import Toast from 'react-native-toast-message';
import {logi} from "./utils/logutil";
import DatePicker from "react-native-date-picker";

// 常用的按钮列表，比如牛奶、拉屎、撒尿等快捷添加
const milkTags = ["纯奶粉", "母乳", "混合喂养"] // 牛奶类型
const poopTags = ["黄色", "褐色", "胎便", "墨绿色", "奶瓣", "稀便", "干便", "正常"] // 拉屎类型
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
// 牛奶的模板数据
const milkTemplateData = {
    name: "牛奶",
    type: 1, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
    time: moment().valueOf(), // 时间戳
    remark: "", // 备注
    tags: milkTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
    selectedTags: [], // 选中的类型
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
// 拉屎的模板数据
const poopTemplateData = {
    name: "拉屎",
    type: 1, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
    time: moment().valueOf(), // 时间戳
    remark: "", // 备注
    tags: poopTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
    selectedTags: [], // 选中的类型
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
// 撒尿的模板
const peeTemplateData = {
    name: "拉屎",
    type: 1, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
    time: moment().valueOf(), // 时间戳
    remark: "", // 备注
    tags: peeTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
    selectedTags: [], // 选中的类型
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
// 测试用数据json，用来存储本地的数据，比如typeMap可以通过动态进行添加存储在本地
const tempJsonData = {
    dataList: [milkTemplateData]
}

export default class MainScreen extends React.Component<any, any> {
    private currentAddType: null; // 当前的添加类型
    private floatingActionRef: null; // 悬浮按钮引用
    private cloneType: null; // 临时保存type的数据

    constructor(props) {
        super(props);
        this.state = {
            dataList: tempJsonData.dataList, // 本地的存储的数据列表
            showAddModal: false,
            datepickerOpen: false
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
                        {contentView ? <View style={{flex: 1, padding: 12}}>
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

    // 标签列表
    _renderTagViewList(tags, selectedTags, callback) {
        let tagView = tags.map((value, index) => {
            let selected = selectedTags.indexOf(value) >= 0
            let bgColor = selected ? "#ff0000" : "#ffffff"
            return (
                <TouchableOpacity
                    onPress={() => {
                        if (callback) {
                            callback(value)
                        }
                    }}
                    key={value}
                    style={{padding: 8, backgroundColor: bgColor, borderRadius: 12, marginRight: 12, marginTop: 12}}>
                    <Text>{
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

    // 添加喝牛奶
    _renderMilkContent(type) {
        // 拷贝一个新的数据
        if (!this.cloneType) {
            this.cloneType = JSON.parse(JSON.stringify(milkTemplateData))
            this.cloneType.name = type.name
        }
        let tagView = this._renderTagViewList(this.cloneType.tags, this.cloneType.selectedTags, (tag) => {
            let tagIndex = this.cloneType.selectedTags.indexOf(tag)
            logi("tag index", tagIndex + " # " + tag)
            if (tagIndex >= 0) {
                // 选中了要去掉
                this.cloneType.selectedTags.splice(tagIndex, 1)
            } else {
                // 需要添加
                this.cloneType.selectedTags.push(tag)
            }
            logi("selected tags", this.cloneType.selectedTags)
            this.forceUpdate()
        })
        let formatTime = moment(this.cloneType.time).format("yyyy-MM-DD HH:mm")
        logi("formattime ", formatTime)
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this._toggleDatetimePicker(true)
                    }}>
                    <Text>{formatTime}</Text>
                </TouchableOpacity>
                <View style={{height: 40, backgroundColor: "#ff00ff", marginTop: 12}}>
                    <TextInput
                        style={[{
                            textAlign: 'left',
                            fontSize: 16,
                            flex: 1,
                            backgroundColor: "#eeeeee",
                            color: "#333333",
                        }]}
                        value={this.cloneType.dose}
                        onChangeText={(text) => {
                            let dose = parseInt(text)
                            this.cloneType.dose = dose
                        }}
                        keyboardType={'number-pad'}
                        placeholderTextColor={"#ff0000"}
                        placeholder={"请输入喝奶量"}/>
                </View>
                <View>
                    {tagView}
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
                        value={this.cloneType.remark}
                        onChangeText={(text) => {
                            this.cloneType.remark = text
                            this.forceUpdate()
                        }}
                        keyboardType={'default'}
                        placeholder={"请输入备注"}/>
                </View>
            </View>
        );
    }

    // 拉屎的添加view
    _renderPoopContent(type) {
        // 拷贝一个新的数据
        if (!this.cloneType) {
            this.cloneType = JSON.parse(JSON.stringify(poopTemplateData))
            this.cloneType.name = type.name
        }
        let tagView = this._renderTagViewList(this.cloneType.tags, this.cloneType.selectedTags, (tag) => {
            let tagIndex = this.cloneType.selectedTags.indexOf(tag)
            logi("tag index", tagIndex + " # " + tag)
            if (tagIndex >= 0) {
                // 选中了要去掉
                this.cloneType.selectedTags.splice(tagIndex, 1)
            } else {
                // 需要添加
                this.cloneType.selectedTags.push(tag)
            }
            this.forceUpdate()
        })
        let formatTime = moment(this.cloneType.time).format("yyyy-MM-DD HH:mm")
        logi("formattime ", formatTime)
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this._toggleDatetimePicker(true)
                    }}>
                    <Text>{formatTime}</Text>
                </TouchableOpacity>
                <View>
                    {tagView}
                </View>
                <View>
                    <TextInput
                        style={[{
                            textAlign: 'left',
                            fontSize: 16,
                            flex: 1,
                            paddingLeft: 60,
                        }]}
                        value={this.cloneType.remark}
                        onChangeText={(text) => {
                            this.cloneType.remark = text
                        }}
                        keyboardType={'default'}
                        placeholder={"请输入备注"}/>
                </View>
            </View>
        );
    }


    _renderPeeContent(type) {
        // 拷贝一个新的数据
        if (!this.cloneType) {
            this.cloneType = JSON.parse(JSON.stringify(poopTemplateData))
            this.cloneType.name = type.name
        }
        let tagView = this._renderTagViewList(this.cloneType.tags, this.cloneType.selectedTags, (tag) => {
            let tagIndex = this.cloneType.selectedTags.indexOf(tag)
            logi("tag index", tagIndex + " # " + tag)
            if (tagIndex >= 0) {
                // 选中了要去掉
                this.cloneType.selectedTags.splice(tagIndex, 1)
            } else {
                // 需要添加
                this.cloneType.selectedTags.push(tag)
            }
            this.forceUpdate()
        })
        let formatTime = moment(this.cloneType.time).format("yyyy-MM-DD HH:mm")
        logi("formattime ", formatTime)
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this._toggleDatetimePicker(true)
                    }}>
                    <Text>{formatTime}</Text>
                </TouchableOpacity>
                <View>
                    {tagView}
                </View>
                <View>
                    <TextInput
                        style={[{
                            textAlign: 'left',
                            fontSize: 16,
                            flex: 1,
                            paddingLeft: 60,
                        }]}
                        value={this.cloneType.remark}
                        onChangeText={(text) => {
                            this.cloneType.remark = text
                        }}
                        keyboardType={'default'}
                        placeholder={"请输入备注"}/>
                </View>
            </View>
        );
    }

    _renderOtherContent(type) {
        return (
            <View></View>
        );
    }

    // 新增类型弹窗
    _renderAddModal() {
        if (!this.currentAddType) {
            return
        }
        let contentView = null;
        // 根据类型id渲染不同的内容界面
        switch (this.currentAddType.id) {
            case typeMapList[0].id:
                contentView = this._renderMilkContent(this.currentAddType)
                break;
            case typeMapList[1].id:
                contentView = this._renderPoopContent(this.currentAddType)
                break;
            case typeMapList[2].id:
                contentView = this._renderPeeContent(this.currentAddType)
                break;
            default:
                contentView = this._renderOtherContent(this.currentAddType)
                break;
        }

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
                    this.state.dataList.push(this.cloneType)
                }
            }
        )
    }

    // 添加牛奶
    private _addMilk(item) {
        this.currentAddType = item
        // 添加牛奶的弹窗
        this.setShowModal(true)
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
        logi("add life line ", item)
        this.cloneType = null
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
        logi("render item", item)

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

    _toggleDatetimePicker(open) {
        this.setState({
            datepickerOpen: open
        })
    }

    _renderDatetimePicker() {
        let datetime = this.cloneType ? new Date(this.cloneType.time) : new Date()
        return (
            <DatePicker
                open={this.state.datepickerOpen}
                date={datetime}
                modal={true}
                mode={"datetime"}
                onConfirm={(date) => {
                    // 确认选择，将日期转为时间戳
                    this.cloneType.time = moment(date).valueOf()
                    let formatTime = moment(this.cloneType.time).format("yyyy-MM-DD HH:mm")
                    logi("confirm date", date + " # " + formatTime)
                    this._toggleDatetimePicker(false)

                }}
                onCancel={() => {
                    this.setState({
                        datepickerOpen: false
                    })
                }}/>
        )
    }

    render() {
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
                    {this._renderDatetimePicker()}
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
        width: "80%",
        minHeight: 400,
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