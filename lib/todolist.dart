import 'package:sqflite/sqflite.dart';
import 'dart:async';
import 'dart:io';

String select_records_query = 'SELECT * FROM ToDoList';
String delete_records_query = 'DELETE FROM ToDoList';

class ToDoList {
  List<ToDo> list = List.empty(growable: true);
  late List<Map> records;

  void buildToDoList(List<Map> records) {
    for (final record in records) {
      var todo = ToDo(
        id: record["id"],
        text: record["description"],
        time: DateTime.parse(record["date"]),
        isDone: record["isDone"] == 0 ? false : true,
      );
      list.add(todo);
    }
    ;
  }

  ToDoList(this.records) {
    buildToDoList(records);
  }

  Future<void> updateToDo() async {
    var db = await openDatabase('ToDoList.db');
    List<Map> temp_records = await db.rawQuery(select_records_query);
    db.close();
    list.clear();
    buildToDoList(temp_records);
  }

  Future<void> deleteAllTasks() async {
    var db = await openDatabase('ToDoList.db');
    await db.execute(delete_records_query);
    db.close();
  }

  Future<void> deleteTask(int id) async {
    var db = await openDatabase('ToDoList.db');
    await db.execute('DELETE FROM ToDoList WHERE id=$id');
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
