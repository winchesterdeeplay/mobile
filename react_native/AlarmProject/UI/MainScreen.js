/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  Button,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createTable, deleteAlarm, getAlarms} from '../lib/db';

import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({
  name: 'alarm_base',
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
          {item.status ? 'Will alarm' : 'No alarm'}
        </Text>
        <Text style={styles.item}>{item.notificationIN}</Text>
        <Text style={styles.item}>{item.radio}</Text>
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
            onPress={() => deleteAlarm(db, item.id, setAlarms)}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'red',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  item: {
    marginRight: 9,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    margin: 0,
  },
});

export {MainScreen, db, styles};
