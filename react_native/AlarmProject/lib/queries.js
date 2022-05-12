const createTableQuery =
  'CREATE TABLE IF NOT EXISTS alarms (id INTEGER PRIMARY KEY, status INT, notificationIN INT, radio INT);';

const insertQuery =
  'INSERT INTO alarms (id, status, notificationIN, radio) VALUES (?, ?, ?, ? )';

const selectQuery =
  'SELECT id, status, notificationIN, radio FROM alarms ORDER BY notificationIN';

const deleteQuery = 'DELETE FROM alarms WHERE id = ?';

const selectLastIDQuery = 'SELECT max(id) AS ID FROM alarms';

const updateAlarmQuery =
  'Update alarms SET (status, notificationIN, radio) = (?, ?, ?) WHERE id = ?';

const updateStatusQuery = 'Update alarms SET (status) = (?) WHERE id = ?';

export {
  createTableQuery,
  insertQuery,
  selectQuery,
  deleteQuery,
  selectLastIDQuery,
  updateAlarmQuery,
  updateStatusQuery,
};
