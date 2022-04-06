import 'dart:async';

import 'package:sqflite/sqflite.dart';
import 'package:todolist/queries.dart';

class ToDoList {
  List<ToDo> list = List.empty(growable: true);
  late String dbName;
  late List<Map> records;

  ToDoList(this.records, this.dbName) {
    buildToDoList(records);
  }

  void buildToDoList(List<Map> records) {
    for (final record in records) {
      var todo = ToDo(
        id: record["id"],
        text: record["description"],
        time: DateTime.parse(record["date"]),
        isDone: record["isDone"] != 0,
      );
      list.add(todo);
    }
    ;
  }

  Future<void> updateToDo() async {
    var db = await openDatabase(dbName);
    List<Map> temp_records = await db.rawQuery(selectRecordsQuery);
    db.close();
    list.clear();
    buildToDoList(temp_records);
  }

  Future<void> deleteAllTasks() async {
    var db = await openDatabase(dbName);
    await db.execute(deleteRecordsQuery);
    db.close();
  }

  Future<void> deleteTask(int id) async {
    var db = await openDatabase(dbName);
    await db.execute(deleteRecordQuery.format(<String, dynamic>{
      'id': id,
    }));
    db.close();
  }

  int count() {
    return list.length;
  }
}

class ToDo {
  ToDo(
      {required this.id,
      required this.text,
      required this.time,
      required this.isDone});

  int id;
  String text;
  DateTime time;
  bool isDone = false;
}
