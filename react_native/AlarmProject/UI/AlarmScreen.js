import {
    Button,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import React, { useState } from "react";

import { Alarm } from "../lib/AlarmClass";

const AlarmScreen = ({ navigation, route }) => {
    const [textStatus, onChangeStatus] = React.useState("Enter AlarmStatus");
    const [textTime, onChangeTime] = React.useState("Enter AlarmTime");
    const [textRadio, onChangeRadio] = React.useState("Enter AlarmRadio");

    return (
        <View>
            <TextInput
                style={styles.input}
                onChangeText={onChangeStatus}
                value={textStatus}
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeTime}
                value={textTime}
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeRadio}
                value={textRadio}
            />
            <Button
                title='Add new Alarm'
                onPress={() => {
                    const new_alarm = new Alarm(textStatus, textTime, textRadio);
                    route.params.alarm_storage.insert_alarm(new_alarm);
                    navigation.navigate('Home', {toUpdate: true});
                }
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export { AlarmScreen };