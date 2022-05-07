import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
  TriggerType,
} from '@notifee/react-native';

import {Audio} from 'expo-av';
import {Vibration} from 'react-native';
import {radioSources} from './radioSources';

const channelId = 'important!';
const channelName = 'Default important';

const ONE_SECOND_IN_MS = 1000;
const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  3 * ONE_SECOND_IN_MS,
];

Audio.setAudioModeAsync({
  staysActiveInBackground: true,
  shouldDuckAndroid: true,
});
const playbackInstance = new Audio.Sound();

async function alarmNotify(type, detail) {
  const {notification, pressAction} = detail;

  if (type === EventType.DELIVERED) {
    console.log('vibration started');
    Vibration.vibrate(PATTERN, true);
    const source = {
      uri: radioSources[+notification.data.radioId],
    };
    try {
      await playbackInstance.loadAsync(source);
      await playbackInstance.playAsync();
    } catch (err) {
      console.log(err);
    }
  }
}
async function onCreateTriggerNotification(
  notificationId,
  radio,
  notificationTimeStamp,
  status,
) {
  if (status) {
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: notificationTimeStamp,
    };
    const channelID = await notifee.createChannel({
      id: channelId,
      name: channelName,
      importance: AndroidImportance.HIGH,
      NotificationManager: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });
    await notifee.createTriggerNotification(
      {
        id: notificationId,
        title: '!!!!Alarm!!!!',
        data: {radioId: radio.toString()},
        body: 'Open app and Switch toggle to stop Vibration and Radio:)',
        badge: true,
        android: {
          channelId: channelID,
          importance: AndroidImportance.HIGH,
          NotificationManager: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          actions: [
            {
              title: 'Open',
              pressAction: {
                id: 'open',
                launchActivity: 'default',
              },
            },
          ],
        },
      },
      trigger,
    );
  } else {
    Vibration.cancel();
    console.log('vibration ended');
    try {
      await playbackInstance.stopAsync();
      await playbackInstance.unloadAsync();
    } catch (err) {
      console.log(err);
    }
    await notifee.cancelNotification(notificationId);
  }
  await notifee
    .getTriggerNotificationIds()
    .then(ids => console.log('All trigger notifications: ', ids));
}

export {alarmNotify, onCreateTriggerNotification};
