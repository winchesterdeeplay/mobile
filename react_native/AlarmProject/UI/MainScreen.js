/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {Button, FlatList, StatusBar, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {addAlarm, createTable, deleteAlarm, getAlarms} from '../lib/db';

import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({
  name: 'alarm_base',
});
const MainScreen = ({}) => {
  const [alarmStatus, setAlarmStatus] = useState('');
  const [alarmNotification, setAlarmNotification] = useState('');
  const [alarmRadio, setAlarmRadio] = useState('');
  const [alarms, setAlarms] = useState([]);

  const renderAlarm = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          borderColor: '#ddd',
        }}>
        <Text style={{marginRight: 9}}>{item.id}</Text>
        <Text style={{marginRight: 9}}>{item.status}</Text>
        <Text style={{marginRight: 9}}>{item.notificationIN}</Text>
        <Text style={{marginRight: 9}}>{item.radio}</Text>
        <Button
          title="delete"
          onPress={() => deleteAlarm(db, item.id, setAlarms)}
        />
      </View>
    );
  };

  useEffect(() => {
    function loadData() {
      createTable(db);
      getAlarms(db, setAlarms);
    }
    loadData();
  }, []);

  return (
    <View>
      <StatusBar backgroundColor="#222" />

      <TextInput
        placeholder="Enter alarm status"
        value={alarmStatus}
        onChangeText={setAlarmStatus}
        style={{marginHorizontal: 8}}
      />

      <TextInput
        placeholder="Enter notification date"
        value={alarmNotification}
        onChangeText={setAlarmNotification}
        style={{marginHorizontal: 8}}
      />

      <TextInput
        placeholder="Enter radio"
        value={alarmRadio}
        onChangeText={setAlarmRadio}
        style={{marginHorizontal: 8}}
      />

      <Button
        title="Submit"
        onPress={() =>
          addAlarm(
            db,
            alarmStatus,
            setAlarmStatus,
            alarmNotification,
            setAlarmNotification,
            alarmRadio,
            setAlarmRadio,
            setAlarms,
          )
        }
      />

      <FlatList data={alarms} renderItem={renderAlarm} key={al => al.id} />
    </View>
  );
};

export {MainScreen};
