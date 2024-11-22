import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import database from '@react-native-firebase/database';

const EditTasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState('');

  // Fetch tasks from Firebase Realtime Database
  useEffect(() => {
    const tasksRef = database().ref('/tasks');
    const onValueChange = tasksRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedTasks = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTasks(formattedTasks);
      } else {
        setTasks([]);
      }
    });

    return () => tasksRef.off('value', onValueChange);
  }, []);

  // Add a new task
  const addTask = () => {
    if (newTaskName.trim() && newTaskPoints.trim()) {
      const newTask = {
        name: newTaskName,
        points: parseInt(newTaskPoints, 10),
        completed: false,
      };
      database().ref('/tasks').push(newTask);
      setNewTaskName('');
      setNewTaskPoints('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text style={styles.taskName}>{item.name}</Text>
            <Text style={styles.taskPoints}>{item.points} pts</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="New Task Name"
        value={newTaskName}
        onChangeText={setNewTaskName}
      />
      <TextInput
        style={styles.input}
        placeholder="Points"
        keyboardType="numeric"
        value={newTaskPoints}
        onChangeText={setNewTaskPoints}
      />
      <Button title="Add Task" onPress={addTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  taskName: { fontSize: 16 },
  taskPoints: { fontSize: 16, color: 'gray' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default EditTasksScreen;
