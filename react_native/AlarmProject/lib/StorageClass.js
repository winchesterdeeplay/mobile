import { MMKV } from 'react-native-mmkv';

class AlarmStorage{
    storage = new MMKV();
    meta_storage = new MMKV();

    retrieve_num_records(){
        const num_records = this.meta_storage.getString("num_records");
        return isNaN(num_records) ? 0 : +num_records
    }

    retrieve_index(){
        const index = this.meta_storage.getString("index");
        return isNaN(index) ? 0 : +index
    }

    insert_alarm(Alarm){
        const index = this.retrieve_index();
        const num_records = this.retrieve_num_records();
        
        this.storage.set(index, JSON.stringify(Alarm));
        

        this.meta_storage.set("num_records", num_records + 1);
        this.meta_storage.set("index", index + 1);
    }

    select_alarm(id){
        return JSON.parse(this.storage.getString(id))
    }

    remove_alarm(id){
        this.storage.delete(id);
        const num_records = this.meta_storage.getString("num_records");
        this.meta_storage.set("num_records", num_records - 1);
    }

    retrieve_alarms_ids(){
        var alarms_ids = this.storage.getAllKeys().slice()
        const num_records_idx = alarms_ids.indexOf('num_records');
        if (num_records_idx > -1) {
            alarms_ids.splice(num_records_idx, 1);
        }
        const index_idx = alarms_ids.indexOf('index');
        if (index_idx > -1){
            alarms_ids.splice(index_idx, 1);
        }
        return alarms_ids
    }

    remove_all_alarms(){
        this.storage.clearAll();
        this.meta_storage.set("num_records", 0);
        this.meta_storage.set("index", 0);
    }

}

export {AlarmStorage}