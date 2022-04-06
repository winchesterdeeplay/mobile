import 'package:todolist/TemplateString.dart';

const String createTableQuery = """
  CREATE TABLE IF NOT EXISTS ToDoList 
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    description TEXT,
    date TEXT,
    isDone INTEGER
  ); """;

const String selectRecordsQuery =
    'SELECT id, description, date, isDone FROM ToDoList';

const String deleteRecordsQuery = 'DELETE FROM ToDoList';

final deleteRecordQuery = TemplateString('DELETE FROM ToDoList WHERE id={id}');

final insertNewTaskQuery = TemplateString("""
  INSERT INTO ToDoList (description, date, isDone) 
  VALUES ('{toDoTextString}', '{timeString}', {isDoneINT})""");

final updateTaskQuery = TemplateString("""
  UPDATE ToDoList SET 
    description = '{toDoTextString}',
    date = '{timeString}',
    isDone = {isDoneINT}
  WHERE id={taskID}""");
