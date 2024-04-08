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

// 标签管理界面
export default class TagMangeScreen extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            datepickerOpen: false,
            birthDay: moment(mainData.babyInfo.birthDay).valueOf()
        }
    }

    componentDidMount() {

    }

    // 设置出生日期等信息
    _setBirthInfo() {
        this.setState({
            datepickerOpen: true
        }, () => {
            // 更新本地数据
            DeviceStorage.refreshMainData()
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.userInfoContainer}>

                </View>
                <View>
                    <View>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: Margin.bigTop,
                                paddingHorizontal: Margin.horizontal,
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                this._setBirthInfo()
                            }}>
                            <View style={{flexDirection: 'row'}}>
                                <Image style={styles.titleImg}
                                       source={require('./assets/ic_version.png')}/>
                                <Text style={{marginLeft: 8, color: Colors.black333, fontSize: 15}}>出生日期</Text>
                            </View>
                            <View>
                                <Text>{moment(this.state.birthDay).format("yyyy-MM-DD")}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={commonStyles.lineWithMargin}/>
                    </View>
                    {ItemRow(<Image style={styles.titleImg}
                                    source={require('./assets/ic_version.png')}/>, '应用设置', () => {
                        this.props.navigation.navigate('VersionScreen');
                    })}
                    {ItemRow(<Image style={styles.titleImg}
                                    source={require('./assets/ic_version.png')}/>, '版本信息', () => {
                        this.props.navigation.navigate('VersionScreen');
                    })}
                </View>
                <DatePicker
                    is24hourSource="locale"
                    open={this.state.datepickerOpen}
                    date={new Date(this.state.birthDay)}
                    modal={true}
                    mode={"date"}
                    onConfirm={(date) => {
                        // 确认选择，将日期转为时间戳
                        this.setState({
                            datepickerOpen: false,
                            birthDay: moment(date).valueOf()
                        })
                        mainData.babyInfo.birthDay = moment(date).valueOf()
                        DeviceStorage.refreshMainData()
                    }}
                    onCancel={() => {
                        this.setState({
                            datepickerOpen: false
                        })
                    }}/>
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