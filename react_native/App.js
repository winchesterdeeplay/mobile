import { StatusBar } from 'expo-status-bar';
import { Component } from 'react';
import { Button, ScrollView, StyleSheet, Text, View, Switch } from 'react-native';
import { Counter, TextWithBackground, WorkScreen } from './UIComponents';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Work" component={WorkScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

class HomeScreen extends Component {
  state = {
    customText: null,
    isEnabled: false,
    data: [
      { id: 0, text: 'Hello' },
      { id: 1, text: 'Bye' }
    ]
  }

  componentDidUpdate() {
    if (this.props.route.params) {
      if (this.state.customText != this.props.route.params.workText || this.state.isEnabled != this.props.route.params.isChecked) {
        this.state.customText = this.props.route.params.workText;
        this.state.isEnabled = this.props.route.params.isChecked;
        this.setState(this.state);
      }
    }
  } 

  componentDidMount = async() => {
    var url = 'https://www.reddit.com/r/funny.json';
    const response = await fetch(url);
    const json = await response.json();
    var children = json.data.children;
    console.log(children);
    this.state.data = [];
    for (var i = 0; i < children.length; i++) {
      this.state.data.push({
        id: i,
        text: children[i].data.title
      });
    }

    this.setState(this.state);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextWithBackground text={this.state.customText ?? 'No text'} />
        <Switch
          disabled={ true }
          value={this.state.isEnabled}
        />
        <Counter />
        <Button title='Go to work 1' onPress={
          () => {
            this.props.navigation.navigate('Work', ({ title: 'FIRST' }));
          }
        } />
        <Button title='Go to work 2' onPress={
          () => {
            this.props.navigation.navigate('Work', ({ title: 'SECOND' }));
          }
        } />
        <ScrollView>
          {
            this.state.data.map(
              i => (
                <Text key={i.id}>{i.text}</Text>
              )
            )
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
});
