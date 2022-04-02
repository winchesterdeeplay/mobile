import 'package:flutter/material.dart';
import 'package:flutter_datetime_picker/flutter_datetime_picker.dart';
import 'package:sqflite/sqflite.dart';
import 'package:todolist/main.dart';
import 'package:intl/intl.dart';
import 'package:timezone/data/latest.dart';

import 'package:timezone/timezone.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

final localNotifications = FlutterLocalNotificationsPlugin();

class AddToDoScreen extends StatefulWidget {
  int? taskID;
  String toDoText;
  DateTime time;
  bool? isDone;

  AddToDoScreen(this.taskID, this.toDoText, this.time, this.isDone);

  @override
  State<StatefulWidget> createState() =>
      AddToDoScreenState(taskID, toDoText, time, isDone);
}

class AddToDoScreenState extends State<AddToDoScreen> {
  static const String id = "add";
  int? taskID;
  String toDoText;
  DateTime time;
  bool? isDone;

  AddToDoScreenState(this.taskID, this.toDoText, this.time, this.isDone);

  Future<void> apply(
      BuildContext context, String toDoText, DateTime time) async {
    AlertDialog alert = AlertDialog(
      title: Text("Empty event description"),
      content: Text("Please add description first."),
      actions: [
        TextButton(
          child: Text("Ok, bro"),
          onPressed: () {
            Navigator.pop(context);
          },
        )
      ],
    );

    if (toDoText == "") {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return alert;
        },
      );
    } else {
      var db = await openDatabase('ToDoList.db');
      int isDoneINT = isDone == false ? 0: 1;
      String timeString = time.toString().substring(0, 19);
      String toDoTextString = toDoText.toString();
      // start queries
      String create_table_query = """
  CREATE TABLE IF NOT EXISTS ToDoList 
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    description TEXT,
    date TEXT,
    isDone INTEGER
  ); """;
      String insert_new_task_query = """
  INSERT INTO ToDoList (description, date, isDone) 
  VALUES ('$toDoTextString', '$timeString', $isDoneINT)""";
      String update_task_query = """
  UPDATE ToDoList SET 
    description = '$toDoTextString',
    date = '$timeString',
    isDone = $isDoneINT
  WHERE id=$taskID""";
      // end queries

      await db.execute(create_table_query);
      if (taskID != null) {
        await db.execute(update_task_query);
      } else {
        await db.execute(insert_new_task_query);
      }
      db.close();
      Navigator.pop(context);
      showNotification(taskID, toDoText, time);
    }
  }

  Color getColor(Set<MaterialState> states) {
    const Set<MaterialState> interactiveStates = <MaterialState>{
      MaterialState.pressed,
      MaterialState.hovered,
      MaterialState.focused,
    };
    if (states.any(interactiveStates.contains)) {
      return Colors.blue;
    }
    return Colors.red;
  }

  void showNotification(int? id, String title, DateTime time) async {
    int notifyID = id == null ? -1 : id;
    var notificationDetails = const NotificationDetails(
        android: AndroidNotificationDetails(
      'ToDoList id',
      'ToDoList',
      channelDescription: 'ToDoList channel',
      channelShowBadge: true,
      priority: Priority.high,
      importance: Importance.max,
      icon: 'done',
    ));
    String body = DateFormat.yMMMd().format(time);

    await localNotifications.schedule(
        notifyID, title, body, time, notificationDetails,
        androidAllowWhileIdle: true);

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("Add ToDo task"),
          backgroundColor: Colors.pink,
        ),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Text("Description", style: TextStyle(fontSize: 20.0)),
            TextField(
              onChanged: (value) => {toDoText = value},
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18.0),
              maxLength: 15,
              autofocus: true,
              // enabled: true,
              decoration: InputDecoration(
                labelText: toDoText,
              ),
            ),
            Row(children: [
              Text("Done?"),
              Checkbox(
                checkColor: Colors.white,
                fillColor: MaterialStateProperty.resolveWith(getColor),
                value: isDone,
                onChanged: (value) {
                  setState(() {
                    isDone = value!;
                  });
                },
              ),
            ], mainAxisAlignment: MainAxisAlignment.center),
            Row(children: [
              TextButton(
                  onPressed: () {
                    DatePicker.showDateTimePicker(context,
                        showTitleActions: true,
                        minTime: DateTime(2022, 1, 1, 00, 00),
                        maxTime: DateTime(2030, 12, 31, 23, 59),
                        onChanged: (date) {},
                        onConfirm: (date) => {time = date},
                        locale: LocaleType.en);
                  },
                  child: Text(
                    'pick a date for notification',
                    style: TextStyle(color: Colors.blue),
                  )),
              TextButton(
                  onPressed: () {
                    time = DateTime(1970, 1, 1);
                  },
                  child: Text(
                    'drop date (without notify)',
                    style: TextStyle(color: Colors.blue),
                  )),
            ], mainAxisAlignment: MainAxisAlignment.center),
            Row(children: [
              FloatingActionButton.extended(
                heroTag: "btn2_1",
                onPressed: () {
                  apply(context, toDoText, time);
                },
                label: const Text('Save'),
                icon: const Icon(Icons.save),
                backgroundColor: Colors.pink,
              ),
              SizedBox(width: 10),
              FloatingActionButton.extended(
                heroTag: "btn2_2",
                onPressed: () {
                  Navigator.pop(context);
                },
                label: const Text('Home page'),
                icon: const Icon(Icons.home),
                backgroundColor: Colors.pink,
              )
            ], mainAxisAlignment: MainAxisAlignment.center)
          ],
        ));
  }
}
