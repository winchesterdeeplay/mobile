/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
import {Button, Switch, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';

import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import {addAlarm} from '../lib/db';
import {db} from './MainScreen';
import {styles} from './MainScreen';

const AlarmScreen = navigation => {
  const [alarmStatus, setAlarmStatus] = useState(false);
  const [alarmNotification, setAlarmNotification] = useState(new Date());
  const [alarmRadio, setAlarmRadio] = useState('');

  if (navigation.route.params) {
    setAlarmStatus(navigation.route.params.editStatus);
    setAlarmNotification(new Date(navigation.route.params.editNotificationIn));
    setAlarmRadio(navigation.route.params.editRadio);
    navigation.route.params = false;
  }
  return (
    <View>
      <View style={[styles.row, {justifyContent: 'center'}]}>
        <DatePicker
          style={{backgroundColor: 'transparent', alignItems: 'center'}}
          date={alarmNotification}
          onDateChange={setAlarmNotification}
        />
      </View>

      <View style={[styles.row, {justifyContent: 'center'}]}>
        <Picker
          selectedValue={alarmRadio}
          style={{width: '80%'}}
          onValueChange={(itemValue, _) => setAlarmRadio(itemValue)}>
          <Picker.Item label="Radio 1" value="1" style={styles.item} />
          <Picker.Item label="Radio 2" value="2" style={styles.item} />
          <Picker.Item label="Radio 3" value="3" style={styles.item} />
        </Picker>
      </View>
      <View style={[styles.row, {justifyContent: 'center'}]}>
        <Text>Alarm?</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={alarmStatus ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          value={alarmStatus}
          onValueChange={setAlarmStatus}
        />
      </View>

      <Button
        title="Save alarm"
        onPress={() => {
          addAlarm(db, alarmStatus, +alarmNotification, alarmRadio);
          navigation.navigation.navigate('Home', {refresh: true});
        }}
      />
    </View>
  );
};

export {AlarmScreen};
