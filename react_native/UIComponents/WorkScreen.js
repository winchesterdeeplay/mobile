import { useState } from 'react';
import { Button, Switch, Text, View, TextInput } from 'react-native';

const myToggle = ( onToggle, value ) => {
    console.log('My toggle');
    onToggle(value);
}

function WorkScreen(props) {
    const [isChecked, onToggle] = useState(false);
    const [text, onChangeText] = useState('');

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{props.route.params.title}</Text>
            <Switch
                onValueChange={(value) => myToggle(onToggle, value)}
                value={isChecked}
            />
            <TextInput
                placeholder='Override me'
                onChangeText={(value) => {
                    onChangeText(value);
                }}
                value={ text }
            />
            <Button
                title='Submit'
                onPress={() => {
                    props.navigation.navigate('Home', ({ isChecked: isChecked, workText: text }));
                }}
            />
            <Button
                title='Cancel'
                onPress={() => {
                    props.navigation.goBack();
                }}
            />
        </View>
    );
}

export { WorkScreen };