import 'package:flutter/material.dart';
import 'package:sqflite/sqflite.dart';
import 'package:todolist/todolist.dart';
import 'package:todolist/AddToDoScreen.dart';
import 'package:intl/intl.dart';
import 'dart:io';
import 'package:timezone/data/latest.dart';

void main() async {
  // init
  const String create_table_query = """
  CREATE TABLE IF NOT EXISTS ToDoList 
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    description TEXT,
    date TEXT,
    isDone INTEGER
  ); """;
  const String selectRecordsQuery = 'SELECT * FROM ToDoList';
  const String dbName = 'ToDoList.db';
  WidgetsFlutterBinding.ensureInitialized();
  var db = await openDatabase(dbName);
  await db.execute(create_table_query);
  List<Map> records = await db.rawQuery(selectRecordsQuery);
  db.close();
  ToDoList list = ToDoList(records, dbName);
  initializeTimeZones();
  // init
  runApp(MaterialApp(
    title: "hw1",
    home: MainScreen(list, dbName),
    routes: {
      MainScreen.id: (context) => MainScreen(list, dbName),
      "add": (context) =>
          AddToDoScreen(null, '', DateTime(1970, 1, 1), false, dbName)
    },
  ));
}

class MainScreen extends StatefulWidget {
  late ToDoList list;
  late String dbName;

  MainScreen(this.list, this.dbName);

  static const String id = "main";

  @override
  State<StatefulWidget> createState() => MainScreenState(list, dbName);
}

class MainScreenState extends State<MainScreen> {
  ToDoList list;
  late String dbName;

  MainScreenState(this.list, this.dbName);

  @override
  void initState() {
    super.initState();
    list.updateToDo();
  }

  Future<void> addToDo(
      int? id, String text, DateTime time, bool isDone, String dbName) async {
    var ats = AddToDoScreen(id, text, time, isDone, dbName);
    await Navigator.push(context, MaterialPageRoute(builder: (context) {
      return ats;
    })).then((value) => list.updateToDo());

    setState(() {
      list.updateToDo();
    });
  }

  Future<void> deleteAllTasks() async {
    await list.deleteAllTasks();
    setState(() {
      list.updateToDo();
    });
  }

  Future<void> deleteTask(int id) async {
    await list.deleteTask(id);
    setState(() {
      list.updateToDo();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Crutch ToDoList"),
        backgroundColor: Colors.pink,
      ),
      body: ListView.builder(
        itemCount: list.count(),
        itemBuilder: (context, index) {
          double IconSize = 26;
          double FontSize = 15;
          double PaddingSize = 2;

          String DateTimeFormat =
              DateFormat.MMMd().format(list.list[index].time) +
                  ', ' +
                  DateFormat.Hm().format(list.list[index].time);
          DateTimeFormat = DateTimeFormat == 'Jan 1, 00:00'
              ? 'without notify'
              : 'in ' + DateTimeFormat;
          String Status =
              list.list[index].isDone == false ? 'not done' : 'done';
          var TextStyle_title = TextStyle(
              color: Colors.grey[800],
              fontWeight: FontWeight.bold,
              fontSize: FontSize);
          var TextStyle_italic =
              TextStyle(fontStyle: FontStyle.italic, fontSize: FontSize);

          return ListTile(
            title: Row(
              children: [
                Text(list.list[index].text, style: TextStyle_title),
                Text(" | ", style: TextStyle_italic),
                Text(DateTimeFormat, style: TextStyle_italic),
                Text(" | ", style: TextStyle_italic),
                Text(Status, style: TextStyle_italic),
                IconButton(
                  icon: Icon(Icons.edit),
                  iconSize: IconSize,
                  padding: EdgeInsets.all(PaddingSize),
                  constraints: BoxConstraints(),
                  onPressed: () {
                    addToDo(list.list[index].id, list.list[index].text,
                        list.list[index].time, list.list[index].isDone, dbName);
                  },
                ),
                IconButton(
                  icon: Icon(Icons.delete),
                  iconSize: IconSize,
                  padding: EdgeInsets.all(PaddingSize),
                  constraints: BoxConstraints(),
                  onPressed: () {
                    deleteTask(list.list[index].id);
                    setState(() {
                      list.updateToDo();
                    });
                  },
                ),
              ],
            ),
          );
        },
      ),
      persistentFooterButtons: [
        FloatingActionButton.extended(
          heroTag: "btn1_1",
          onPressed: () {
            deleteAllTasks();
            setState(() {
              list.updateToDo();
            });
          },
          label: Text('Delete all tasks'),
          icon: Icon(Icons.delete),
          backgroundColor: Colors.pink,
        ),
        FloatingActionButton.extended(
          heroTag: "btn1_2",
          onPressed: () {
            addToDo(null, '', DateTime(1970, 1, 1), false, dbName);
          },
          label: Text('New task'),
          icon: Icon(Icons.add),
          backgroundColor: Colors.pink,
        ),
      ],
    );
  }
}
