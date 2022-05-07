/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
import {Button, Switch, Text, View} from 'react-native';
import React, {useState} from 'react';
import {addAlarm, getNewID, updateAlarm} from '../lib/db';

import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import {db} from './MainScreen';
import {onCreateTriggerNotification} from '../lib/notifications';
import {styles} from '../lib/styles';

const AlarmScreen = navigation => {
  const [alarmStatus, setAlarmStatus] = useState(0);
  const [alarmNotification, setAlarmNotification] = useState(new Date());
  const [alarmRadio, setAlarmRadio] = useState(1);
  const [alarmID, setAlarmID] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);

  if (navigation.route.params) {
    setAlarmID(navigation.route.params.editId);
    setAlarmStatus(navigation.route.params.editStatus === 1);
    setAlarmNotification(new Date(navigation.route.params.editNotificationIn));
    setAlarmRadio(navigation.route.params.editRadio);
    setIsUpdate(true);
    navigation.route.params = false;
  } else {
    if (typeof navigation.route.params === 'undefined') {
      getNewID(db, setAlarmID);
    }
  }
  return (
    <View>
      <View style={[styles.row, {justifyContent: 'center'}]}>
        <DatePicker
          style={{backgroundColor: 'transparent', alignItems: 'center'}}
          date={alarmNotification}
          onDateChange={setAlarmNotification}
          androidVariant="nativeAndroid"
          locale="ru"
          is24hourSource="locale"
        />
      </View>

      <View style={[styles.row, {justifyContent: 'center'}]}>
        <Picker
          selectedValue={alarmRadio}
          style={{width: '80%'}}
          onValueChange={(itemValue, itemIndex) => setAlarmRadio(itemValue)}>
          <Picker.Item label="Radio 1" value="1" style={styles.item} />
          <Picker.Item label="Radio 2" value="2" style={styles.item} />
          <Picker.Item label="Radio 3" value="3" style={styles.item} />
        </Picker>
      </View>
      <View style={[styles.row, {justifyContent: 'center'}]}>
        <Text>Alarm?</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={alarmStatus ? 'green' : '#f4f3f4'}
          value={alarmStatus}
          onValueChange={setAlarmStatus}
        />
      </View>

      <Button
        title="Save alarm"
        onPress={() => {
          if (!isUpdate) {
            addAlarm(db, alarmID, alarmStatus, +alarmNotification, +alarmRadio);
          } else {
            updateAlarm(
              db,
              alarmStatus,
              +alarmNotification,
              alarmRadio,
              alarmID,
            );
          }
          const stringAlarmID = alarmID.toString();
          onCreateTriggerNotification(
            stringAlarmID,
            alarmRadio,
            +alarmNotification,
            alarmStatus,
          );
          navigation.navigation.navigate('Home', {refresh: true});
        }}
      />
    </View>
  );
};

export {AlarmScreen};
