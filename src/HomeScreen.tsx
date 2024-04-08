// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知
// 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加

import React from "react";
import moment from "moment";
import {
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {FloatingAction} from "react-native-floating-action";
import Toast from 'react-native-toast-message';
import {logi} from "./utils/logutil";
import DatePicker from "react-native-date-picker";
import {showToast} from "./utils/toastUtil";
import {DeviceStorage} from "./utils/deviceStorage";
import {AndroidPermissions} from "./utils/permissionUtils";
import {SwipeListView} from "react-native-swipe-list-view";
import {Share} from "react-native/Libraries/Share/Share";
import {BarChart, LineChart} from 'echarts/charts';
import * as echarts from 'echarts/core';
import SvgChart, {SVGRenderer} from '@wuba/react-native-echarts/svgChart';
import {EChartsType} from "echarts/core";
import {GridComponent, TitleComponent, TooltipComponent} from "echarts/components";
import {screenW} from "./utils/until";
import PagerView from 'react-native-pager-view';
import {Checkbox} from "native-base";
import {
    mainData,
    milkTemplateData,
    poopTemplateData,
    peeTemplateData,
    otherTemplateData
} from "./mainData";

const typeMapList = mainData.typeMapList // 类型列表
const commonActions = mainData.commonActions // 放在主页的主要使用的类型action

// 测试用数据json，用来存储本地的数据，比如typeMap可以通过动态进行添加存储在本地
const tempJsonData = {dataList: []}
// 存储本地数据的key
const KEY_LOCAL_DATA = "key_local_key"

echarts.use([SVGRenderer, LineChart, BarChart, TitleComponent,
    TooltipComponent,
    GridComponent])


export default class HomeScreen extends React.Component<any, any> {
    private currentAddType = null; // 当前的添加类型
    private floatingActionRef = null; // 悬浮按钮引用
    private cloneType = null; // 临时保存type的数据
    private oldMilkData = null // 已经有的最新的喝牛奶的数据，用来保存默认数据
    private milkDoseList = [] // 牛奶的最新3个量数据列表
    private oldPoopData = null // 已经有的最新的拉屎的数据，用来保存默认数据
    private poopTagList = [] // 拉屎的最新3个量数据列表
    private oldPeeData = null // 已经有的最新的撒尿的数据，用来保存默认数据
    private peeTagList = [] // 撒尿的最新3个量数据列表
    private oldJaundiceData = null // 已经有的最新的黄疸的数据，用来保存默认数据
    private jaundiceList = [] // 黄疸的最新3个量数据列表
    private isTypeEdit: boolean = false // 是否是编辑模式
    private last24HourChartRef: any; // 统计数据的渲染引用
    private last24HourCharts: EChartsType; // 统计图表
    private todayChartRef: any; // 统计数据的渲染引用
    private todayCharts: EChartsType; // 统计图表

    constructor(props) {
        super(props);
        this.state = {
            dataList: tempJsonData.dataList, // 本地的存储的数据列表
            showAddModal: false,
            datepickerOpen: false
        }
    }

    componentDidMount() {
        this._initEcharts()
        AndroidPermissions.checkStoragePermissions(() => {
            // 获取本地的数据
            DeviceStorage.get(KEY_LOCAL_DATA)
                .then((data) => {
                    logi("get data ", typeof data)
                    if (data) {
                        logi("get my datalist ", data)
                        this._refreshDataList(data)
                        this._refreshStaticsCharts()
                    }
                })
                .catch(error => {
                    logi("get data error ", error)
                })
        }, () => {
            // 没有存储权限
        })
    }

    // 获取最近使用的3个牛奶量来组成常用的
    _getCommonMilkDose(dataList: any) {
        if (dataList) {
            let oldDataList = []
            dataList.forEach(value => {
                if (value.typeId === typeMapList[0].id) {
                    oldDataList.push(value)
                }
            })
            if (oldDataList.length > 0) {
                this.oldMilkData = JSON.parse(JSON.stringify(oldDataList[0]))
                // 拿到最新的3个
                if (this.milkDoseList.length > 5) {

                }
                oldDataList.forEach(value => {
                    // 取最近的5个数据
                    if (this.milkDoseList.length < 5) {
                        if (this.milkDoseList.indexOf(value.dose) >= 0) {

                        } else {
                            this.milkDoseList.push(value.dose)
                        }
                    }
                })
            }
            logi("dose list", this.oldMilkData)
        }
    }

    _getCommonPoopDose(dataList: any) {
        if (dataList) {
            let oldDataList = []
            dataList.forEach(value => {
                if (value.typeId === typeMapList[1].id) {
                    oldDataList.push(value)
                }
            })
            if (oldDataList.length > 0) {
                this.oldPoopData = JSON.parse(JSON.stringify(oldDataList[0]))
                // 拿到最新的3个
                let subList = oldDataList.slice(0, 3)
                subList.forEach(value => {
                    this.poopTagList.push(value.dose)
                })
            }
            logi("dose list", this.poopTagList)
        }
    }

    _getCommonPeeDose(dataList: any) {
        if (dataList) {
            let oldDataList = []
            dataList.forEach(value => {
                if (value.typeId === typeMapList[2].id) {
                    oldDataList.push(value)
                }
            })
            if (oldDataList.length > 0) {
                this.oldPeeData = JSON.parse(JSON.stringify(oldDataList[0]))
                // 拿到最新的3个
                let subList = oldDataList.slice(0, 3)
                subList.forEach(value => {
                    this.peeTagList.push(value.dose)
                })
            }
            logi("dose list", this.oldPeeData)
        }
    }

    _refreshDataList(dataList) {
        dataList.forEach(value => {
            if (!value.key) {
                value.key = value.time
            }
        })
        this._getCommonMilkDose(dataList)
        this._getCommonPoopDose(dataList)
        this._getCommonPeeDose(dataList)
        this.setState({
            dataList: dataList
        })
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

    // 标签列表，区分单选和多选
    _renderTagViewList(tags, selectedTags, callback, isView = false) {
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

    // 添加喝牛奶
    _renderMilkContent(typeData) {
        // 拷贝一个新的数据
        if (!this.cloneType) {
            if (this.oldMilkData) {
                this.cloneType = JSON.parse(JSON.stringify(this.oldMilkData))
            } else {
                this.cloneType = JSON.parse(JSON.stringify(milkTemplateData))
                this.cloneType.name = typeData.name
            }
            this.cloneType.time = moment().valueOf()
        }
        let tagView = this._renderTagViewList(this.cloneType.tags, this.cloneType.selectedTags, (tag) => {
            let tagIndex = this.cloneType.selectedTags.indexOf(tag)
            logi("tag index", tagIndex + " # " + tag)
            // 单选
            this.cloneType.selectedTags.splice(0, this.cloneType.selectedTags.length)
            this.cloneType.selectedTags.push(tag)
            this.forceUpdate()
        })
        let formatTime = moment(this.cloneType.time).format("yyyy-MM-DD HH:mm")
        // 常用的喝奶量，用之前已经输入过的最新的牛奶的量来组成列表
        let commonDoseTagView = this._renderTagViewList(this.milkDoseList, [], (dose) => {
            logi("select milk dose", dose)
            this.cloneType.dose = dose
            this.forceUpdate()
        })
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
                        value={this.cloneType.dose.toString()}
                        onChangeText={(text) => {
                            let dose
                            if (text) {
                                dose = parseInt(text)
                            } else {
                                dose = ""
                            }
                            this.cloneType.dose = dose
                            this.forceUpdate()
                        }}
                        keyboardType={'number-pad'}
                        placeholderTextColor={"#bbbbbb"}
                        placeholder={"请输入喝奶量"}/>
                </View>
                <View>
                    {commonDoseTagView}
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
                        placeholderTextColor={"#bbbbbb"}
                        keyboardType={'default'}
                        placeholder={"请输入备注"}/>
                </View>
            </View>
        );
    }

    // 拉屎的添加view
    _renderPoopContent(typeData) {
        // 拷贝一个新的数据
        if (!this.cloneType) {
            if (this.oldPoopData) {
                this.cloneType = JSON.parse(JSON.stringify(this.oldPoopData))
            } else {
                this.cloneType = JSON.parse(JSON.stringify(poopTemplateData))
                this.cloneType.name = typeData.name
            }
            this.cloneType.time = moment().valueOf()
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
                        placeholderTextColor={"#bbbbbb"}
                        keyboardType={'default'}
                        placeholder={"请输入备注"}/>
                </View>
            </View>
        );
    }


    _renderPeeContent(typeData) {
        // 拷贝一个新的数据
        if (!this.cloneType) {
            if (this.oldPeeData) {
                this.cloneType = JSON.parse(JSON.stringify(this.oldPeeData))
            } else {
                this.cloneType = JSON.parse(JSON.stringify(peeTemplateData))
                this.cloneType.name = typeData.name
            }
            this.cloneType.time = moment().valueOf()
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
                        placeholderTextColor={"#bbbbbb"}
                        keyboardType={'default'}
                        placeholder={"请输入备注"}/>
                </View>
            </View>
        );
    }

    _renderOtherContent(typeData) {
        // 拷贝一个新的数据
        if (!this.cloneType) {
            this.cloneType = JSON.parse(JSON.stringify(otherTemplateData))
            this.cloneType.name = typeData.name
            this.cloneType.time = moment().valueOf()
        }
        let formatTime = moment(this.cloneType.time).format("yyyy-MM-DD HH:mm")
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
                        value={this.state.newTag}
                        onChangeText={(text) => {
                            this.setState({
                                newTag: text
                            })
                        }}
                        keyboardType={'default'}
                        placeholderTextColor={"#bbbbbb"}
                        placeholder={"请输入标签"}/>
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
                        placeholderTextColor={"#bbbbbb"}
                        keyboardType={'default'}
                        placeholder={"请输入备注"}/>
                </View>
                <View style={{height: 40, marginTop: 12}}>
                    <Checkbox value={this.state.addNewTag}>添加新标签</Checkbox>
                </View>
            </View>
        );
    }

    // 检查是否填写必须的数据
    _checkAddTypeData(typeData) {
        logi("check type ", typeData)
        logi("type id", typeData.typeId + " # " + typeMapList[0].id)
        switch (typeData.typeId) {
            case typeMapList[0].id:
                // 牛奶必须输入毫升数量
                return typeData.dose > 0
        }
        return true
    }

    _refreshLocalData() {
        DeviceStorage.save(KEY_LOCAL_DATA, this.state.dataList)
            .then(data => {
                logi("save data ", data)
            })
    }

    // 其他类型
    _confirmOtherNewLife(callback) {
        if (this.isTypeEdit) {
            if (this._checkAddTypeData(this.cloneType)) {
                // 根据时间排序
                this.state.dataList.sort((a, b) => b.time - a.time)
                this._refreshLocalData()
                if (callback) {
                    callback()
                }
            }
        } else {
            // 判断是否添加新的标签，可以添加标签也可以不添加标签


            if (this._checkAddTypeData(this.cloneType)) {
                logi("add milk check true")
                this.cloneType.key = this.cloneType.time
                // 插入到最新的数据，这里还是根据时间进行设置
                let dataList = this._insertItemByResortTime(this.state.dataList, this.cloneType)
                this.setState({
                    dataList: dataList
                })
                // this.state.dataList.unshift(this.cloneType)
                this._refreshLocalData()
                if (callback) {
                    callback()
                }
            } else {
                logi("add milk check false")
            }
        }
    }

    _confirmAddNewLife(callback) {
        if (this.isTypeEdit) {
            if (this._checkAddTypeData(this.cloneType)) {
                // 根据时间排序
                this.state.dataList.sort((a, b) => b.time - a.time)
                this._refreshLocalData()
                if (callback) {
                    callback()
                }
            }
        } else {
            // 判断是否添加新的标签，可以添加标签也可以不添加标签


            if (this._checkAddTypeData(this.cloneType)) {
                logi("add milk check true")
                this.cloneType.key = this.cloneType.time
                // 插入到最新的数据，这里还是根据时间进行设置
                let dataList = this._insertItemByResortTime(this.state.dataList, this.cloneType)
                this.setState({
                    dataList: dataList
                })
                // this.state.dataList.unshift(this.cloneType)
                this._refreshLocalData()
                if (callback) {
                    callback()
                }
            } else {
                logi("add milk check false")
            }
        }
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
            case typeMapList[5].id:
                contentView = this._renderOtherContent(this.currentAddType)
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
                    if (typeMapList[5].id === this.currentAddType.id) {
                        // 渲染其他的类型，需要判断是否添加新的tag
                        this._confirmOtherNewLife(() => {
                            this.setShowModal(false)
                            this._refreshStaticsCharts()
                        })
                    } else {
                        this._confirmAddNewLife(() => {
                            this.setShowModal(false)
                            this._refreshStaticsCharts()
                        })
                    }

                }
            }
        )
    }

    // 添加牛奶
    _addMilk(item) {
        this.currentAddType = item
        // 添加牛奶的弹窗
        this.setShowModal(true)
    }

    // 添加拉屎
    _addPoop(item) {
        this.currentAddType = item
        this.setShowModal(true)
    }

    // 添加撒尿
    _addPee(item) {
        this.currentAddType = item
        this.setShowModal(true)
    }

    // 获取过去24小时的数据
    _getLast24HoursData() {
        let dataList = this.state.dataList
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

    // 获取今天的数据
    _getTodayData() {
        let dataList = this.state.dataList
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

    _editLifeLine(item) {
        this.cloneType = item
        switch (item.name) {
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

    _addOther(item) {
        this.currentAddType = item
        this.setShowModal(true)
    }

    // 添加新的时间线
    _addNewLifeline(item) {
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
            case typeMapList[5].name:
                this._addOther(typeMapList[5])
                break;
        }
    }

    _renderTypeItem(item, index) {
        let typeName = item.name
        let time = moment(item.time).format("yyyy-MM-DD HH:mm")
        let tags = item.selectedTags

        let tagView = null
        if (tags && tags.length > 0) {
            tagView = this._renderTagViewList(tags, [], null, true)
        }

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    // 进入详情
                    this._gotoItemDetail(item)
                }}
                key={item.time} style={[styles.timelineItemContainer, {marginTop: index === 0 ? 12 : 0}]}>
                <View style={styles.timelineItemType}>
                    <Text>{typeName}</Text>
                </View>
                <View style={styles.timelineItemContent}>
                    <Text>时间：{time}</Text>
                    {item.dose ? <Text style={{marginTop: 12}}>剂量：{item.dose}ml</Text> : null}
                    {tagView ?
                        <View style={{display: "flex", flexDirection: "row"}}>
                            {tagView}
                        </View> : null}
                    {item.remark ? <Text style={{marginTop: 12}}>{item.remark}</Text> : null}
                </View>
            </TouchableOpacity>
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
                is24hourSource="locale"
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

    // 进入详情
    _gotoItemDetail(item) {
        logi("detail item", item)
        this.props.navigation.navigate("NewLifeDetailScreen", {data: item})
    }

    _renderListEmptyView() {
        return (
            <View style={styles.emptyViewContainer}><Text>空白数据</Text></View>
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

    deleteRow = (rowMap, rowKey) => {
        this.closeRow(rowMap, rowKey)
        logi("delete index ")
        let index = this.state.dataList.findIndex(value => value.key === rowKey)
        // 删除数据
        let dataList = this.state.dataList
        dataList.splice(index, 1)
        this.setState({
            dataList: dataList
        })
        this._refreshLocalData()
        this._refreshStaticsCharts()
    };

    // 重新排序记录，根据时间插入
    _insertItemByResortTime(dataList, newData) {
        if (!newData) {
            return dataList
        }
        if (dataList && dataList.length > 0) {
            if (dataList[0].time < newData.time) {
                dataList.unshift(newData)
            } else {
                for (let i = 0; i < dataList.length; i++) {
                    let value = dataList[i]
                    if (value.time < newData.time) {
                        logi("insert to index 1 ", dataList.length)
                        logi("insert to index 2 ", i)
                        dataList.splice(i, 0, newData)
                        return dataList
                    }
                }
                dataList.push(newData)
            }


        } else {
            dataList = [newData]
        }
        return dataList
    }

    _exportData() {
        // 将数据保存为文件，然后再分享
        Share.open({
            title: "分享文件"
        }, {})
    }

    _renderExportAction() {
        return (
            <View style={styles.exportActionsContainer}>
                <TouchableOpacity
                    onPress={() => {
                        this._exportData()
                    }}
                    style={styles.btnExportAction}>
                    <Text>导出</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _refreshLast24HourCharts() {
        let dataList = this._getLast24HoursData()
        logi("chart ref", this.last24HourChartRef)
        if (this.last24HourChartRef && dataList) {
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
            typeMapList.forEach(value => {
                if (dataMap.has(value.name)) {
                    sortedMap.set(value.name, dataMap.get(value.name))
                }
            })
            let titleList = Array.from(sortedMap.keys())
            let valueList = Array.from(sortedMap.values())

            const option = {
                title: {
                    text: "过去24小时数据"
                },
                xAxis: {
                    type: 'category',
                    data: titleList,
                },
                yAxis: {
                    minInterval: 1,
                    type: 'value',
                },
                series: [
                    {
                        data: valueList,
                        type: 'bar',
                        barWidth: 40,
                        sort: 'ascending',
                        label: {
                            show: true,
                            position: 'top',
                            color: "black",
                            fontSize: 12,
                            formatter: function (d) {
                                logi("label formater", d.data)
                                // 牛奶显示总量
                                if (d.data.name.indexOf("奶") >= 0) {
                                    logi("set milk dose 2 ", d.data.dose)
                                    return d.data.dose + "ml"
                                }
                                return ""
                            }
                        }
                    },
                ],
            };
            this.last24HourCharts.setOption(option);
        }
    }

    _refreshTodayCharts() {
        let dataList = this._getTodayData()
        if (this.todayChartRef && dataList) {
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
            typeMapList.forEach(value => {
                if (dataMap.has(value.name)) {
                    sortedMap.set(value.name, dataMap.get(value.name))
                }
            })
            let titleList = Array.from(sortedMap.keys())
            let valueList = Array.from(sortedMap.values())


            const option = {
                title: {
                    text: "今天的数据"
                },
                xAxis: {
                    type: 'category',
                    data: titleList,
                },
                yAxis: {
                    minInterval: 1,
                    type: 'value',
                },
                series: [
                    {
                        data: valueList,
                        type: 'bar',
                        barWidth: 40,
                        sort: 'ascending',
                        label: {
                            show: true,
                            position: 'top',
                            color: "black",
                            fontSize: 12,
                            formatter: function (d) {
                                logi("label formater", d.data)
                                // 牛奶显示总量
                                if (d.data.name.indexOf("奶") >= 0) {
                                    logi("set milk dose 2 ", d.data.dose)
                                    return d.data.dose + "ml"
                                }
                                return ""
                            }
                        }
                    },
                ],
            };
            this.todayCharts.setOption(option);
        }
    }

    // 刷新统计数据图标
    _refreshStaticsCharts() {
        setTimeout(() => {
            this._refreshLast24HourCharts()
            this._refreshTodayCharts()
        }, 0)
    }

    // 统计数据
    _renderSvgCharts() {
        return (
            <PagerView style={{width: screenW, height: screenW * 0.6, flex: 1}} initialPage={0}>
                <View style={{flex: 1, width: "100%", height: "100%"}} key="1">
                    <SvgChart ref={ref => this.todayChartRef = ref}/>
                </View>
                <View key="2">
                    <SvgChart ref={ref => this.last24HourChartRef = ref}/>
                </View>
            </PagerView>
        )
    }

    _initEcharts() {
        if (this.todayChartRef) {
            this.todayCharts = echarts.init(this.todayChartRef, "light", {
                renderer: "svg",
                width: screenW,
                height: screenW * 0.6
            })
        }
        if (this.last24HourChartRef) {
            this.last24HourCharts = echarts.init(this.last24HourChartRef, "light", {
                renderer: "svg",
                width: screenW,
                height: screenW * 0.6
            })
        }
    }

    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.scrollContainer}>
                        <View style={[styles.staticsContainer, {height: screenW * 0.6}]}>
                            {this._renderSvgCharts()}
                        </View>
                        <View style={styles.line}/>
                        <View style={styles.timelineContainer}>
                            <SwipeListView
                                data={this.state.dataList}
                                renderItem={({item, index}) => {
                                    return this._renderTypeItem(item, index)
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
                                                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                                                onPress={() => {
                                                    rowMap[data.item.key].closeRow()
                                                    // 打开弹窗，然后将当前的数据进行修改
                                                    this.isTypeEdit = true
                                                    this._editLifeLine(data.item)
                                                }}
                                            >
                                                <Text style={styles.backTextWhite}>编辑</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.backRightBtn, styles.backRightBtnRight]}
                                                onPress={() => {
                                                    this.deleteRow(rowMap, data.item.key)
                                                }}
                                            >
                                                <Text style={styles.backTextWhite}>删除</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                                leftOpenValue={75}
                                rightOpenValue={-150}
                                previewOpenValue={-40}
                                previewOpenDelay={1000}
                                onRowDidOpen={(rowKey, rowMap, toValue) => this.onRowDidOpen(rowKey, rowMap)}/>
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
                            this.isTypeEdit = false
                            this._addNewLifeline(item)
                        }}
                    />
                    {this._renderAddModal()}
                    {this._renderDatetimePicker()}
                    {/*{this._renderExportAction()}*/}
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