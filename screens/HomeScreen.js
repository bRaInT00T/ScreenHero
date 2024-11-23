import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { database } from '../firebaseConfig'; // Import the initialized Firebase database
import { ref, onValue } from 'firebase/database';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from Firebase when the component mounts or updates
  useEffect(() => {
    const tasksRef = ref(database, '/tasks'); // Reference to the tasks in Firebase

    // Listener to update tasks dynamically
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedTasks = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTasks(formattedTasks);
      } else {
        setTasks([]); // If no tasks exist, reset state to an empty array
      }
    },
    (error) => {
      console.error('Error fetching tasks:', error); // Log any errors
    }
  );

  return () => unsubscribe(); // Cleanup the listener on unmount
}, []);

  // Calculate total points
  const totalPoints = tasks
    .filter((task) => task.completed) // Sum only completed tasks
    .reduce((sum, task) => sum + task.points, 0);

  // Toggle task completion
  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hi! Let's Earn Some Points Today!</Text>
      <Text style={styles.totalPoints}>Total Points: {totalPoints}</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.task,
              item.completed && styles.completedTask,
            ]}
            onPress={() => toggleTaskCompletion(item.id)}
          >
            <Text style={styles.taskName}>{item.name}</Text>
            <Text style={styles.taskPoints}>{item.points} pts</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.navigationButtons}>
        <Button title="Edit Tasks" onPress={() => navigation.navigate('Edit Tasks')} />
        <Button title="Point Conversion" onPress={() => navigation.navigate('Point Conversion')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  totalPoints: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    borderRadius: 5,
  },
  completedTask: { backgroundColor: '#d4f7d4' },
  taskName: { fontSize: 16 },
  taskPoints: { fontSize: 16, color: 'gray' },
  navigationButtons: { marginTop: 20 },
});

export default HomeScreen;
