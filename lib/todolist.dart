import 'package:sqflite/sqflite.dart';

class ToDoList {
  static const String select_records_query = 'SELECT * FROM ToDoList';
  static const String delete_records_query = 'DELETE FROM ToDoList';
  List<ToDo> list = List.empty(growable: true);

  Future<void> updateToDo() async {
    var db = await openDatabase('ToDoList.db');
    List<Map> records = await db.rawQuery(select_records_query);
    list = List.empty(growable: true);
    for (final record in records) {
      var todo = ToDo(
        id: record["id"],
        text: record["description"],
        time: DateTime.parse(record["date"]),
        isDone: record["isDone"] == 0 ? false : true,
      );
      list.add(todo);
    };
    await db.close();
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
