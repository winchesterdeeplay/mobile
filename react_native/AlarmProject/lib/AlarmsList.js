import { FlatList, Text, View } from 'react-native';

import { AlarmStorage } from './StorageClass';
import React from 'react';

const alarm_storage = new AlarmStorage;

const AlarmList = () => {
    // const test_alarm = new Alarm('Alarm1', 'Alarm2', 'Alarm');
    // alarm_storage.insert_alarm(test_alarm);
    // alarm_storage.remove_all_alarms();
    var alarms_ids = alarm_storage.retrieve_alarms_ids();
    if (alarm_storage.retrieve_num_records() > 0){
        return (
            <View>
           <FlatList
        data={alarms_ids}
        renderItem={({ item }) => <Text>{alarm_storage.select_alarm(item).status}</Text>}
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