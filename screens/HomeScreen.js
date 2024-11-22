import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import tasksData from '../data/tasks';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState(tasksData);

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const totalPoints = tasks
    .filter((task) => task.completed)
    .reduce((sum, task) => sum + task.points, 0);

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
            <Text>{item.name}</Text>
            <Text>{item.points} pts</Text>
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
  navigationButtons: { marginTop: 20 },
});

export default HomeScreen;
