import { StyleSheet, Text, View } from 'react-native';

import { AlarmList } from './lib/AlarmsList';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  
  return (
    <View style={ styles.container }>
      <AlarmList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
