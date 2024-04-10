import React, {Component} from "react";
import {Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {
    heightTemplateData,
    jaundiceTemplateData,
    mainData,
    milkTemplateData,
    peeTemplateData,
    poopTemplateData,
    spitMilkTemplateData, weightTemplateData
} from "../mainData";
import moment from "moment";
import {logi} from "../utils/logutil";
import DatePicker from "react-native-date-picker";
import {commonStyles} from "../commonStyle";

// 添加类型的弹窗
export default class AddNewLifeModal extends Component<any, any> {
    private cloneType = null;
    private oldMilkData = null;
    private oldHeightData = null;
    private oldWeightData = null;
    private oldSpitMilkData = null;
    private oldPoopData = null;
    private oldPeeData = null;
    private oldJaundiceData = null;
    private milkDoseList = [30, 50, 60, 70]
    private currentAddType = null;

    constructor(props) {
        super(props);
        this.state = {
            showAddModal: false,
            datepickerOpen: false
        }
    }

    // 新增类型
    addNewType(currentAddType){
        logi("add type", currentAddType)
        this.currentAddType = currentAddType
        this.cloneType = null
        this.showModal(true)
    }

    // 编辑类型
    editType(currentAddType, cloneType){
        logi("add type", currentAddType)
        this.cloneType = cloneType
        this.currentAddType = currentAddType
        this.showModal(true)
    }

    showModal(show) {
        this.setState({
            showAddModal: show
        })
    }

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

    _toggleDatetimePicker(open){
        this.setState({
            datepickerOpen: open
        })
    }

    _renderMilkContent(type){
        // 拷贝一个新的数据
        if (!this.cloneType) {
            if (this.oldMilkData) {
                this.cloneType = JSON.parse(JSON.stringify(this.oldMilkData))
            } else {
                this.cloneType = JSON.parse(JSON.stringify(milkTemplateData))
                this.cloneType.name = this.currentAddType.name
            }
            this.cloneType.time = moment().valueOf()
            this.cloneType.key = moment().valueOf()
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
                <View style={[{height: 40, marginTop: 12}, commonStyles.flexRow, commonStyles.center]}>
                    <Text>喝奶量：</Text>
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

    _renderWeightContent(type){
        // 拷贝一个新的数据
        if (!this.cloneType) {
            if (this.oldWeightData) {
                this.cloneType = JSON.parse(JSON.stringify(this.oldWeightData))
            } else {
                this.cloneType = JSON.parse(JSON.stringify(weightTemplateData))
                this.cloneType.name = this.currentAddType.name
            }
            this.cloneType.time = moment().valueOf()
            this.cloneType.key = moment().valueOf()
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
                <View style={[{height: 40, marginTop: 12}, commonStyles.flexRow, commonStyles.center]}>
                    <Text>体重：</Text>
                    <TextInput
                        style={[{
                            textAlign: 'left',
                            fontSize: 16,
                            flex: 1,
                            backgroundColor: "#eeeeee",
                            color: "#333333",
                        }]}
                        value={this.cloneType.weight.toString()}
                        onChangeText={(text) => {
                            this.cloneType.weight = text
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

    _renderHeightContent(type){
        // 拷贝一个新的数据
        if (!this.cloneType) {
            if (this.oldHeightData) {
                this.cloneType = JSON.parse(JSON.stringify(this.oldHeightData))
            } else {
                this.cloneType = JSON.parse(JSON.stringify(heightTemplateData))
                this.cloneType.name = this.currentAddType.name
            }
            this.cloneType.time = moment().valueOf()
            this.cloneType.key = moment().valueOf()
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
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this._toggleDatetimePicker(true)
                    }}>
                    <Text>{formatTime}</Text>
                </TouchableOpacity>
                <View style={[{height: 40, marginTop: 12}, commonStyles.flexRow, commonStyles.center]}>
                    <Text>身高：</Text>
                    <TextInput
                        style={[{
                            textAlign: 'left',
                            fontSize: 16,
                            flex: 1,
                            backgroundColor: "#eeeeee",
                            color: "#333333",
                        }]}
                        value={this.cloneType.height.toString()}
                        onChangeText={(text) => {
                            this.cloneType.height = text
                            this.forceUpdate()
                        }}
                        keyboardType={'number-pad'}
                        placeholderTextColor={"#bbbbbb"}
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
                        placeholderTextColor={"#bbbbbb"}
                        keyboardType={'default'}
                        placeholder={"请输入备注"}/>
                </View>
            </View>
        );
    }

    _renderPoopContent(type){
        // 拷贝一个新的数据
        if (!this.cloneType) {
            if (this.oldPoopData) {
                this.cloneType = JSON.parse(JSON.stringify(this.oldPoopData))
            } else {
                this.cloneType = JSON.parse(JSON.stringify(poopTemplateData))
                this.cloneType.name = this.currentAddType.name
            }
            this.cloneType.time = moment().valueOf()
            this.cloneType.key = moment().valueOf()
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

    _renderPeeContent(type){
        // 拷贝一个新的数据
        if (!this.cloneType) {
            if (this.oldPeeData) {
                this.cloneType = JSON.parse(JSON.stringify(this.oldPeeData))
            } else {
                this.cloneType = JSON.parse(JSON.stringify(peeTemplateData))
                this.cloneType.name = this.currentAddType.name
            }
            this.cloneType.time = moment().valueOf()
            this.cloneType.key = moment().valueOf()
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

    _renderJaundiceContent(type){
        // 拷贝一个新的数据
        if (!this.cloneType) {
            if (this.oldJaundiceData) {
                this.cloneType = JSON.parse(JSON.stringify(this.oldJaundiceData))
            } else {
                this.cloneType = JSON.parse(JSON.stringify(jaundiceTemplateData))
                this.cloneType.name = this.currentAddType.name
            }
            this.cloneType.time = moment().valueOf()
            this.cloneType.key = moment().valueOf()
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
                <View style={[{height: 40, marginTop: 12}, commonStyles.flexRow, commonStyles.center]}>
                    <Text style={{width: 60}}>头：</Text>
                    <TextInput
                        style={[{
                            textAlign: 'left',
                            fontSize: 16,
                            flex: 1,
                            backgroundColor: "#eeeeee",
                            color: "#333333",
                        }]}
                        value={this.cloneType.jaundiceValue.header.toString()}
                        onChangeText={(text) => {
                            let dose
                            if (text) {
                                dose = parseInt(text)
                            } else {
                                dose = ""
                            }
                            this.cloneType.jaundiceValue.header = dose
                            this.forceUpdate()
                        }}
                        keyboardType={'number-pad'}
                        placeholderTextColor={"#bbbbbb"}
                        placeholder={"请输入额头黄疸值"}/>
                </View>
                <View style={[{height: 40, marginTop: 12, alignItems: "center", justifyContent: "flex-end"}, commonStyles.flexRow]}>
                    <Text style={{width: 60}}>胸口：</Text>
                    <TextInput
                        style={[{
                            textAlign: 'left',
                            fontSize: 16,
                            flex: 1,
                            backgroundColor: "#eeeeee",
                            color: "#333333",
                        }]}
                        value={this.cloneType.jaundiceValue.chest.toString()}
                        onChangeText={(text) => {
                            let dose
                            if (text) {
                                dose = parseInt(text)
                            } else {
                                dose = ""
                            }
                            this.cloneType.jaundiceValue.chest = dose
                            this.forceUpdate()
                        }}
                        keyboardType={'number-pad'}
                        placeholderTextColor={"#bbbbbb"}
                        placeholder={"请输入胸口黄疸值"}/>
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

    _renderOtherContent(type){
        return (
            <View></View>
        )
    }

    _renderSpitMilkContent(type){
        // 拷贝一个新的数据
        if (!this.cloneType) {
            if (this.oldSpitMilkData) {
                this.cloneType = JSON.parse(JSON.stringify(this.oldSpitMilkData))
            } else {
                this.cloneType = JSON.parse(JSON.stringify(spitMilkTemplateData))
                this.cloneType.name = this.currentAddType.name
            }
            this.cloneType.time = moment().valueOf()
            this.cloneType.key = moment().valueOf()
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

    _renderContentView(){
        let contentView = null;
        // 根据类型id渲染不同的内容界面
        switch (this.currentAddType?.id) {
            case mainData.typeMapList[0].id:
                contentView = this._renderMilkContent(this.currentAddType)
                break;
            case mainData.typeMapList[1].id:
                contentView = this._renderPoopContent(this.currentAddType)
                break;
            case mainData.typeMapList[2].id:
                contentView = this._renderPeeContent(this.currentAddType)
                break;
            case mainData.typeMapList[3].id:
                contentView = this._renderJaundiceContent(this.currentAddType)
                break;
            case mainData.typeMapList[5].id:
                contentView = this._renderOtherContent(this.currentAddType)
                break;
            case mainData.typeMapList[4].id:
                contentView = this._renderSpitMilkContent(this.currentAddType)
                break;
            case mainData.typeMapList[6].id:
                contentView = this._renderHeightContent(this.currentAddType)
                break;
            case mainData.typeMapList[7].id:
                contentView = this._renderWeightContent(this.currentAddType)
                break;
            default:
                contentView = this._renderOtherContent(this.currentAddType)
                break;
        }

        return contentView
    }

    // 检查是否填写必须的数据
    _checkAddTypeData(typeData) {
        logi("check type ", typeData)
        switch (typeData.typeId) {
            case mainData.typeMapList[0].id:
                // 牛奶必须输入毫升数量
                return typeData.dose > 0
        }
        return true
    }

    render() {
        let datetime = this.cloneType ? new Date(this.cloneType.time) : new Date()
        return (
            <>
                <Modal
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {
                        this.showModal(!this.state.showAddModal)
                    }}
                    visible={this.state.showAddModal}>
                    <View style={styles.addModalContainer}>
                        <View style={styles.addContentContainer}>
                            <View style={{height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}>
                                <Text>添加{this.currentAddType?.name}</Text>
                            </View>
                            <View style={{flex: 1}}>
                                {this._renderContentView()}
                            </View>
                            <View style={styles.line}/>
                            <View style={styles.modalFooter}>
                                <TouchableOpacity style={styles.btnModalFooter} onPress={() => {
                                    this.showModal(false)
                                }}>
                                    <Text>取消</Text>
                                </TouchableOpacity>
                                <View style={{width: 1, backgroundColor: "#bbbbbb"}}></View>
                                <TouchableOpacity style={styles.btnModalFooter} onPress={() => {
                                    if(this._checkAddTypeData(this.cloneType)){
                                        this.showModal(false)
                                        logi("this.pros", this.cloneType)
                                        // 添加数据
                                        this.props.addNewLifeline(this.cloneType)
                                    } else {

                                    }
                                }}>
                                    <Text>确认</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <DatePicker
                    is24hourSource="locale"
                    open={this.state.datepickerOpen}
                    date={datetime}
                    modal={true}
                    mode={"datetime"}
                    onConfirm={(date) => {
                        // 确认选择，将日期转为时间戳
                        this.cloneType.time = moment(date).valueOf()
                        this.cloneType.key = this.cloneType.time
                        let formatTime = moment(this.cloneType.time).format("yyyy-MM-DD HH:mm")
                        logi("confirm date", date + " # " + formatTime)
                        this._toggleDatetimePicker(false)

                    }}
                    onCancel={() => {
                        this.setState({
                            datepickerOpen: false
                        })
                    }}/>
            </>

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