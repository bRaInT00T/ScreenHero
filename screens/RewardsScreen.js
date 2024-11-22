import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RewardsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>You've Earned:</Text>
      <Text style={styles.points}>30 Minutes of Screen Time!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold' },
  points: { fontSize: 32, fontWeight: 'bold', color: '#007BFF' },
});

export default RewardsScreen;
