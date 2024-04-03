import {SafeAreaView, useColorScheme, Text, View} from "react-native";
import React from "react";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {createStackNavigator} from "@react-navigation/stack";

const rootStack = createStackNavigator()

const isDarkMode = useColorScheme() === 'dark';

const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
};

function Root(): React.JSX.Element{
    return (
        <SafeAreaView style={backgroundStyle}>
            <View>
                <Text>111</Text>
            </View>
        </SafeAreaView>
    );
}

export default Root
