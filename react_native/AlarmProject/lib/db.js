/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
import {
  createTableQuery,
  deleteQuery,
  insertQuery,
  selectQuery,
} from './queries';
const createTable = db => {
  db.transaction(txn => {
    txn.executeSql(
      createTableQuery,
      [],
      (sqlTxn, res) => {
        console.log('table created successfully');
      },
      error => {
        console.log('error on creating table ' + error.message);
      },
    );
  });
};

const deleteAlarm = (db, id, setAlarms) => {
  db.transaction(txn => {
    txn.executeSql(
      deleteQuery,
      [id],
      (sqlTxn, res) => {
        console.log(`alarm deleted successfully`);
        getAlarms(db, setAlarms);
        setAlarms('');
      },
      error => {
        console.log('error on deleting alarm ' + error.message);
      },
    );
  });
};

const addAlarm = (
  db,
  alarmStatus,
  setAlarmStatus,
  alarmNotification,
  setAlarmNotification,
  alarmRadio,
  setAlarmRadio,
  setAlarms,
) => {
  //   if (!alarm) {
  //     alert('Enter alarm name');
  //     return false;
  //   }

  db.transaction(txn => {
    txn.executeSql(
      insertQuery,
      [alarmStatus, alarmNotification, alarmRadio],
      (sqlTxn, res) => {
        console.log(`alarm added successfully`);
        getAlarms(db, setAlarms);
        setAlarms('');
      },
      error => {
        console.log('error on adding alarm ' + error.message);
      },
    );
  });
};

const getAlarms = (db, setAlarms) => {
  db.transaction(txn => {
    txn.executeSql(
      selectQuery,
      [],
      (sqlTxn, res) => {
        console.log('alarms retrieved successfully');
        let len = res.rows.length;

        if (len > 0) {
          let results = [];
          for (let i = 0; i < len; i++) {
            let item = res.rows.item(i);
            results.push({
              id: item.id,
              status: item.status,
              notificationIN: item.notificationIN,
              radio: item.radio,
            });
          }

          setAlarms(results);
        }
      },
      error => {
        console.log('error on getting alarms ' + error.message);
      },
    );
  });
};

export {addAlarm, getAlarms, createTable, deleteAlarm};
