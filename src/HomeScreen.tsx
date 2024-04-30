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
    commonActions,
    commonTypeList,
    mainData
} from "./mainData";
import EventBus from "./utils/eventBus";
import BabyLifeListView from "./components/BabyLifeListView";
import {FloatingAction} from "react-native-floating-action";

export default class HomeScreen extends React.Component<any, any> {

    private floatingActionRef = null; // 悬浮按钮引用

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this._initListeners()
    }

    _initListeners() {
        EventBus.addEventListener(EventBus.REFRESH_BABY_LIST, () => {
            logi("refresh baby list")
            this.forceUpdate()
        })
    }

    componentWillUnmount() {
        logi("remove all listeners")
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

    // 添加新的时间线
    _addNewLifeline(item) {
        logi("add life line ", item)
        this.cloneType = null
        this.currentAddType = item
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
            case "全部":
                this._toAllTypeScreen()
                break;
        }
    }

    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <PagerView style={{flex: 1}} initialPage={0}>
                        {this._renderBabyPages()}
                    </PagerView>
                    <FloatingAction
                        distanceToEdge={{vertical: 50, horizontal: 40}}
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