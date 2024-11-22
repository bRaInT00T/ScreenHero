import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import tasksData from '../data/tasks';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState(tasksData);

  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const totalPoints = tasks
    .filter((task) => task.completed)
    .reduce((sum, task) => sum + task.points, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hi! Let's Earn Some Points Today!</Text>
      <ProgressBar progress={totalPoints / 100} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.task, item.completed && styles.completedTask]}
            onPress={() => toggleTaskCompletion(index)}
          >
            <Text>{item.name}</Text>
            <Text>{item.points} pts</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.totalPoints}>Total Points: {totalPoints}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Rewards')}
      >
        <Text style={styles.buttonText}>View Rewards</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
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
  totalPoints: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: { color: '#fff', textAlign: 'center' },
});

export default HomeScreen;
