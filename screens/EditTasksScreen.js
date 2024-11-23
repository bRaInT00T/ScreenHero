import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue, push, remove, update } from 'firebase/database';

const EditTasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null); // Task being edited
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState('');

  // Fetch tasks from Firebase
  useEffect(() => {
    const tasksRef = ref(database, '/tasks');

    const unsubscribe = onValue(tasksRef, (snapshot) => {
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

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Add a new task or update an existing one
  const handleSaveTask = async () => {
    const points = parseInt(newTaskPoints, 10);

    if (!newTaskName.trim()) {
      Alert.alert('Error', 'Task name cannot be empty');
      return;
    }
    if (isNaN(points) || points <= 0) {
      Alert.alert('Error', 'Points must be a positive number');
      return;
    }

    if (editingTask) {
      // Update an existing task
      try {
        await update(ref(database, `/tasks/${editingTask.id}`), {
          name: newTaskName.trim(),
          points,
        });
        setEditingTask(null);
      } catch (error) {
        console.error('Failed to update task:', error);
        Alert.alert('Error', 'Failed to update task. Please try again.');
      }
    } else {
      // Add a new task
      try {
        await push(ref(database, '/tasks'), {
          name: newTaskName.trim(),
          points,
          completed: false,
        });
      } catch (error) {
        console.error('Failed to add task:', error);
        Alert.alert('Error', 'Failed to add task. Please try again.');
      }
    }

    setNewTaskName('');
    setNewTaskPoints('');
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      await remove(ref(database, `/tasks/${id}`));
    } catch (error) {
      console.error('Failed to delete task:', error);
      Alert.alert('Error', 'Failed to delete task. Please try again.');
    }
  };

  // Start editing a task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTaskName(task.name);
    setNewTaskPoints(task.points.toString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <View>
              <Text style={styles.taskName}>{item.name}</Text>
              <Text style={styles.taskPoints}>{item.points} pts</Text>
            </View>
            <View style={styles.taskActions}>
              <Button title="Edit" onPress={() => handleEditTask(item)} />
              <Button title="Delete" onPress={() => handleDeleteTask(item.id)} color="red" />
            </View>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Task Name"
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
      <Button title={editingTask ? 'Update Task' : 'Add Task'} onPress={handleSaveTask} />
      {editingTask && (
        <Button
          title="Cancel Editing"
          onPress={() => {
            setEditingTask(null);
            setNewTaskName('');
            setNewTaskPoints('');
          }}
          color="gray"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  taskName: { fontSize: 16 },
  taskPoints: { fontSize: 16, color: 'gray' },
  taskActions: { flexDirection: 'row', gap: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default EditTasksScreen;