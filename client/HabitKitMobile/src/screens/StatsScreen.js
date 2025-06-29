import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import apiClient from '../api';

const StatsScreen = () => {
  const [stats, setStats] = useState({});
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: habitsData } = await apiClient.get('/habits');
      setHabits(habitsData);

      const statsData = {};
      for (const habit of habitsData) {
        const { data: habitStats } = await apiClient.get(`/habits/${habit._id}/stats`);
        statsData[habit._id] = habitStats;
      }
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const renderHabitStats = (habit) => {
    const habitStats = stats[habit._id] || {};
    return (
      <View key={habit._id} style={[styles.statsCard, { backgroundColor: habit.color }]}>
        <Text style={styles.habitName}>{habit.name}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{habitStats.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>Racha Actual</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{habitStats.longestStreak || 0}</Text>
            <Text style={styles.statLabel}>Mejor Racha</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{habitStats.totalDays || 0}</Text>
            <Text style={styles.statLabel}>Días Total</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Estadísticas</Text>
        {habits.map(renderHabitStats)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
});

export default StatsScreen; 