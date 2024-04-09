import React from "react";
import {TouchableOpacity, View, Text, StyleSheet, Image} from "react-native";
import {commonStyles} from "./commonStyle";
import {Margin} from "./space";
import {Colors} from "./colors";
import moment from "moment";
import {logi} from "./utils/logutil";
import DatePicker from "react-native-date-picker";
import {DeviceStorage} from "./utils/deviceStorage";
import {mainData} from "./mainData";

const ItemRow = (img, title, callback, showLine = true) => {
    return (
        <View>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: Margin.bigTop,
                    paddingHorizontal: Margin.horizontal,
                    alignItems: 'center',
                }}
                onPress={callback}>
                <View style={{flexDirection: 'row'}}>
                    {img}
                    <Text style={{marginLeft: 8, color: Colors.black333, fontSize: 15}}>{title}</Text>
                </View>
                <View>
                </View>
            </TouchableOpacity>
            {showLine ? <View style={commonStyles.lineWithMargin}/> : null}
        </View>

    );
};

// 所有类型界面，选择类型然后添加
export default class AllTypeScreen extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            datepickerOpen: false,
            birthDay: moment(mainData.babyInfo.birthDay).valueOf()
        }
    }

    _renderItem(value){
        return (
            <TouchableOpacity
                onPress={() => {
                    // 添加类型
                    this._addNewLifeline()
                }}
                style={[{width: "30%", height: 60, marginBottom: 12, backgroundColor: "#ff0000", marginHorizontal: 6}, commonStyles.center]}>
                <Text>{value.name}</Text>
            </TouchableOpacity>
        )
    }

    _renderCommonItem() {
        let view = mainData.commonActions.map(value => {
            return this._renderItem(value)
        })
        return (
            <View style={[{display: "flex", flexDirection: "row", flexWrap: "wrap", backgroundColor: "#ff00ff", justifyContent: "flex-start"}]}>
                {view}
            </View>
        )
    }

    setShowModal(show) {
        this.setState({
            showAddModal: show
        })
    }

    _addNewLifeline() {
        
    }

    _renderOtherItem() {
        let otherType = []
        mainData.typeMapList.forEach(value => {
            let isCommon = false
            mainData.commonActions.forEach(value2 => {
                if (value.id === value2.id) {
                    isCommon = true
                }
            })
            if (!isCommon) {
                otherType.push(value)
            }
        })
        let view = otherType.map(value => {
            return this._renderItem(value)
        })
        return (
            <View style={[{display: "flex", flexDirection: "row", flexWrap: "wrap", backgroundColor: "#ff00ff", justifyContent: "flex-start"}]}>
                {view}
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Text>常用类型</Text>
                    <View>
                        {this._renderCommonItem()}
                    </View>
                </View>
                <View>
                    <Text>全部类型</Text>
                    <View>
                        {this._renderOtherItem()}
                    </View>
                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({
    userInfoContainer: {
        height: 200,
        backgroundColor: "#ff0000"
    },
    container: {
        padding: 12
    },
    titleImg: {
        width: 20,
        height: 20,
    },
})