import {Text} from 'react-native';

class Alarm{
    constructor(status, time, radio){
        this.status = status;
        this.time = time;
        this.radio = radio;
    }

    render_alarm(){
        <Text>{ this.status }</Text>
    }
}

export {Alarm};