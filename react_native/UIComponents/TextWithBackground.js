import { View, Text } from 'react-native';

function TextWithBackground({ text }) {
  return (
    <View style={{ backgroundColor: 'yellow' }}>
      <Text>{text}</Text>
    </View>
  );
}

export { TextWithBackground };