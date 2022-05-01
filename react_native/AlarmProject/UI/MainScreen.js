import {
    Button,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { AlarmList } from "../lib/AlarmsList";
import { AlarmStorage } from "../lib/StorageClass";
import  { useState } from "react";

const alarm_storage = new AlarmStorage;

const MainScreen = ({navigation, route}) => {
    console.log();
    return (
        <View style={[styles.container, {
            flexDirection: "column"
        }]}>

            <View style={{ flex: 8, backgroundColor: "skyblue" }}>
                <AlarmList alarm_storage={alarm_storage} />
            </View>
            <View style={{ flex: 1, backgroundColor: "steelblue" }}>
                <Button
                    style={{ fontSize: 1000 }}
                    title='Add new Alarm'
                    onPress={() =>
                        navigation.navigate('Alarm', {alarm_storage: alarm_storage} )
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 4,
        backgroundColor: "oldlace",
        fontSize: 100,
        alignSelf: "flex-start",
        marginHorizontal: "1%",
        marginBottom: 6,
        minWidth: "48%",
        textAlign: "center",
    },
});

export { MainScreen };