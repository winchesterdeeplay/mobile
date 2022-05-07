/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
import {
  createTableQuery,
  deleteQuery,
  insertQuery,
  selectLastIDQuery,
  selectQuery,
  updateAlarmQuery,
  updateStatusQuery,
} from './queries';
const createTable = db => {
  db.transaction(txn => {
    txn.executeSql(
      createTableQuery,
      [],
      () => {
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
      () => {
        console.log(`alarm deleted successfully`);
        getAlarms(db, setAlarms);
      },
      error => {
        console.log('error on deleting alarm ' + error.message);
      },
    );
  });
};

const addAlarm = (db, alarmID, alarmStatus, alarmNotification, alarmRadio) => {
  db.transaction(txn => {
    txn.executeSql(
      insertQuery,
      [alarmID, alarmStatus, alarmNotification, alarmRadio],
      () => {
        console.log(`alarm added successfully`);
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
        let len = res.rows.length;
        let results = [];
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            let item = res.rows.item(i);
            results.push({
              id: item.id,
              status: item.status,
              notificationIN: item.notificationIN,
              radio: item.radio,
            });
          }
        }
        setAlarms(results);
        let alarmsStates = [];
        for (var i = 0; i < results.length; i++) {
          alarmsStates.push(results[i].status);
        }
        console.log('alarms retrieved successfully');
      },
      error => {
        console.log('error on getting alarms ' + error.message);
      },
    );
  });
};

const getNewID = (db, setAlarmID) => {
  db.transaction(txn => {
    txn.executeSql(selectLastIDQuery, [], (sqlTxn, res) => {
      let len = res.rows.length;
      let item = 0;
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          item = res.rows.item(i).ID + 1;
        }
      }
      setAlarmID(item);
    });
  });
};

const updateStatus = (db, id, status) => {
  db.transaction(txn => {
    txn.executeSql(
      updateStatusQuery,
      [status, id],
      () => {
        console.log(`status updated successfully`);
      },
      error => {
        console.log('error on updating status' + error.message);
      },
    );
  });
};

const updateAlarm = (db, alarmStatus, alarmNotification, alarmRadio, id) => {
  db.transaction(txn => {
    txn.executeSql(
      updateAlarmQuery,
      [alarmStatus, alarmNotification, alarmRadio, id],
      () => {
        console.log(`alarm updated successfully`);
      },
      error => {
        console.log('error on updating alarm ' + error.message);
      },
    );
  });
};
export {
  addAlarm,
  getAlarms,
  createTable,
  deleteAlarm,
  getNewID,
  updateStatus,
  updateAlarm,
};
