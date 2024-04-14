// 特点: 动态添加日志类型（拉屎、撒尿、吃奶）
// 提醒吃伊可新、定时提醒喂奶等时间通知
// 区分混合喂养还是亲喂还是奶粉，奶粉的品牌可以添加

import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    View
} from "react-native";
import {logi} from "./utils/logutil";
import PagerView from 'react-native-pager-view';
import {
    mainData
} from "./mainData";
import EventBus from "./utils/eventBus";
import BabyLifeListView from "./components/BabyLifeListView";

export default class HomeScreen extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this._initListeners()
    }

    _initListeners() {
        EventBus.addEventListener(EventBus.REFRESH_DATA, (data) => {
            this._insertNewlifeLineImpl(data)
        })
        EventBus.addEventListener(EventBus.REFRESH_BABY_INFO, (data) => {
            this.forceUpdate()
        })
    }

    componentWillUnmount() {
        EventBus.clearAllListeners()
    }

    _renderBabyPages() {
        let babyView = mainData.babies.map((value, index) => {
            logi("init baby " + index, value)
            return (
                <View key={index} style={[{flex: 1}]}>
                    <BabyLifeListView navigation={this.props.navigation} baby={value}/>
                </View>
            )
        })
        return babyView
    }

    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <PagerView style={{flex: 1}} initialPage={0}>
                        {this._renderBabyPages()}
                    </PagerView>
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
})