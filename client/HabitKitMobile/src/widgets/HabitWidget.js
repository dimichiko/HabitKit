import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SyncService from '../services/SyncService';

const HabitWidget = ({ habit, onPress }) => {
  const handleCheckin = async () => {
    try {
      await SyncService.checkinHabit(habit._id);
      onPress && onPress();
    } catch (error) {
      console.error('Error checking in habit:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: habit.color }]}
      onPress={handleCheckin}
    >
      <Text style={styles.name}>{habit.name}</Text>
      <Text style={styles.count}>x{habit.timesPerDay}/día</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  count: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
});

export default HabitWidget; 