import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [dayType, setDayType] = useState('school');
  const [totalAvailablePoints, setTotalAvailablePoints] = useState(0);

  const conversionRules = {
    school: { maxHours: 3 },
    weekend: { maxHours: 13 },
  };

  useEffect(() => {
    const currentDay = new Date().getDay();
    if (currentDay === 0 || currentDay === 6) {
      setDayType('weekend');
    } else {
      setDayType('school');
    }
  }, []);

  useEffect(() => {
    const tasksRef = ref(database, '/tasks');
    const unsubscribe = onValue(
      tasksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedTasks = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setTasks(formattedTasks);
          const totalPoints = formattedTasks.reduce((sum, task) => sum + task.points, 0);
          setTotalAvailablePoints(totalPoints);
        } else {
          setTasks([]);
          setTotalAvailablePoints(0);
        }
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const totalPointsEarned = tasks.filter((task) => task.completed).reduce((sum, task) => sum + task.points, 0);

  const { maxHours } = conversionRules[dayType];
  const freeHoursDecimal = Math.min(
    (totalPointsEarned / totalAvailablePoints) * maxHours || 0,
    maxHours
  );

  // Convert free hours decimal to total minutes, rounded to nearest 15 minutes
  const totalMinutes = Math.round(freeHoursDecimal * 60 / 15) * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const toggleTaskCompletion = async (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      try {
        await update(ref(database, `/tasks/${id}`), { completed: updatedTask.completed });
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === id ? updatedTask : t))
        );
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hi! Let's Earn Some Points Today!</Text>
      <Text style={styles.totalPoints}>Total Points Earned: {totalPointsEarned}</Text>
      <Text style={styles.freeHours}>
        Free Time Earned: {hours} hours and {minutes} minutes ({dayType === 'school' ? 'School Day' : 'Weekend'})
      </Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.task, item.completed && styles.completedTask]}
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
  totalPoints: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  freeHours: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
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