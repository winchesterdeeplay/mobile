import { Button, FlatList, Text, View } from 'react-native';

import { Alarm } from './AlarmClass';
import React from 'react';
import { useState } from "react";

const AlarmList = ({ alarm_storage }) => {
    // const test_alarm = new Alarm('Alarm1', 'Alarm2', 'Alarm');
    // alarm_storage.insert_alarm(test_alarm);
    // alarm_storage.remove_all_alarms();
    // const [isUpdated, setIsUpdated] = useState(true);

    const alarms_ids = alarm_storage.retrieve_alarms_ids();
    if (alarm_storage.retrieve_num_records() > 0) {
        return (
            <View>
                <FlatList
                    data={alarms_ids}
                    renderItem={({ item }) =>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text>{alarm_storage.select_alarm(item).status}</Text>
                            <Button title='delete' onPress={() => {
                                alarm_storage.remove_alarm(item);
                                // setIsUpdated(false);
                                // setIsUpdated(true);
                            }} />
                        </View>}
                />
            </View>
        )
    }
    else {
        return (
            <View>
                <Text>No records</Text>
            </View>
        )
    }

}

export { AlarmList };