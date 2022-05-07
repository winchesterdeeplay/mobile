/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  Button,
  FlatList,
  Pressable,
  StatusBar,
  Switch,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createTable, deleteAlarm, getAlarms, updateStatus} from '../lib/db';

import {alarmNotify} from '../lib/notifications';
import {convertTimeStamp} from '../lib/functions';
import notifee from '@notifee/react-native';
import {onCreateTriggerNotification} from '../lib/notifications';
import {openDatabase} from 'react-native-sqlite-storage';
import {styles} from '../lib/styles';

const db = openDatabase({
  name: 'alarm_base',
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  alarmNotify(type, detail);
});

notifee.onForegroundEvent(async ({type, detail}) => {
  alarmNotify(type, detail);
});

const MainScreen = ({navigation, route}) => {
  const [alarms, setAlarms] = useState([]);
  useEffect(() => {
    function loadData() {
      createTable(db);
      getAlarms(db, setAlarms);
    }
    loadData();
  }, []);
  if (route.params) {
    if (route.params.refresh) {
      getAlarms(db, setAlarms);
      route.params.refresh = false;
    }
  }
  const renderAlarm = ({item}) => {
    return (
      <View style={styles.row}>
        <Text style={styles.item}>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={item.status ? 'green' : '#f4f3f4'}
            value={item.status !== 0}
            onChange={() => {
              updateStatus(db, item.id, !item.status);
              onCreateTriggerNotification(
                item.id.toString(),
                item.radio,
                +item.notificationIN,
                !item.status,
              );
            }}
            onValueChange={() => getAlarms(db, setAlarms)}
          />
        </Text>
        <Text style={styles.item}>{convertTimeStamp(item.notificationIN)}</Text>
        <View style={{flexDirection: 'row'}}>
          <Pressable
            style={[styles.button, {backgroundColor: 'blue', marginRight: 5}]}
            onPress={() =>
              navigation.navigate('Alarm', {
                editId: item.id,
                editStatus: item.status,
                editNotificationIn: item.notificationIN,
                editRadio: item.radio,
              })
            }>
            <Text style={styles.text}>Edit</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              onCreateTriggerNotification(
                item.id.toString(),
                item.radio,
                +item.notificationIN,
                false,
              );
              deleteAlarm(db, item.id, setAlarms);
            }}>
            <Text style={styles.text}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: 'column',
        },
      ]}>
      <View style={{flex: 8}}>
        <StatusBar backgroundColor="#222" />
        <FlatList data={alarms} renderItem={renderAlarm} key={al => al.id} />
      </View>
      <View>
        <Button
          title="Add new Alarm"
          onPress={() => navigation.navigate('Alarm')}
        />
      </View>
    </View>
  );
};

export {MainScreen, db, notifee};
