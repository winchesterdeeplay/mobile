import { Component } from 'react';
import { Text, View, Button } from 'react-native';

class Counter extends Component {

  constructor(props) {
    super(props);
    console.log('constructor');

    this.increaseCounter = this.increaseCounter.bind(this);
  }

  state = {
    counter: 0
  }

  componentDidMount() {
    //console.log('componentDidMount');
  }

  componentDidUpdate() {
    //console.log('componentDidUpdate');
  }

  componentWillUnmount() {
    //console.log('componentWillUnmount');
  }

  increaseCounter() {
    this.setState({ counter: this.state.counter + 1 });
  }

  render() {
    return (
      <View>
        <Text>Counter: {this.state.counter}</Text>
        <Button title='Press me' onPress={this.increaseCounter} />
      </View>
    );
  }
}

export { Counter };