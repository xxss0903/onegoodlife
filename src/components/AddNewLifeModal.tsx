import React, {Component} from "react";
import {Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {mainData} from "../mainData";

// 添加类型的弹窗
export default class AddNewLifeModal extends Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            showAddModal: false
        }
    }

    showModal(show) {
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
                    this.showModal(!this.state.showAddModal)
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

    _renderMilkContent(type){
        return (
            <View></View>
        )
    }

    _renderPoopContent(type){
        return (
            <View></View>
        )
    }

    _renderPeeContent(type){
        return (
            <View></View>
        )
    }

    _renderOtherContent(type){
        return (
            <View></View>
        )
    }

    _renderContentView(){
        let contentView = null;
        // 根据类型id渲染不同的内容界面
        switch (this.props.currentAddType.id) {
            case mainData.typeMapList[0].id:
                contentView = this._renderMilkContent(this.props.currentAddType)
                break;
            case mainData.typeMapList[1].id:
                contentView = this._renderPoopContent(this.props.currentAddType)
                break;
            case mainData.typeMapList[2].id:
                contentView = this._renderPeeContent(this.props.currentAddType)
                break;
            case mainData.typeMapList[5].id:
                contentView = this._renderOtherContent(this.props.currentAddType)
                break;
            default:
                contentView = this._renderOtherContent(this.props.currentAddType)
                break;
        }

        return contentView
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    this.showModal(!this.state.showAddModal)
                }}
                visible={this.state.showAddModal}>
                <View style={styles.addContentContainer}>
                    <View style={{height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Text>添加{this.props.currentType?.name}</Text>
                    </View>
                    {this._renderContentView()}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.btnModalFooter} onPress={() => {
                            this.showModal(false)
                        }}>
                            <Text>取消</Text>
                        </TouchableOpacity>
                        <View style={{width: 1, backgroundColor: "#bbbbbb"}}></View>
                        <TouchableOpacity style={styles.btnModalFooter} onPress={() => {
                            this.showModal(false)
                        }}>
                            <Text>确认</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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