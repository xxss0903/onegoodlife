import React from 'react';
import {View} from 'react-native';
import {commonStyles} from "./commonStyle.js";
import {SafeAreaInsetsContext} from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import {mainData} from "./mainData.ts";


export default class BaseScreen extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <SafeAreaInsetsContext.Consumer>
                {(insets) =>
                    <LinearGradient
                        colors={mainData.gradientColor}
                        start={{x: 0, y: 1}}
                        end={{x: 1, y: 0}}
                        style={[commonStyles.flexColumn, {flex: 1, paddingTop: insets?.top}]}>
                        {this.renderScreen()}
                    </LinearGradient>
                }
            </SafeAreaInsetsContext.Consumer>

        );
    }

    renderScreen() {
        return <View></View>;
    }
}
