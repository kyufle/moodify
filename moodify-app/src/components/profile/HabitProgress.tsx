import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const WEEK_DAYS = [
  { day: 'L', date: '1', completed: true },
  { day: 'M', date: '2', completed: true },
  { day: 'X', date: '3', completed: false },
  { day: 'J', date: '4', completed: true },
  { day: 'V', date: '5', completed: true },
  { day: 'S', date: '6', completed: true },
  { day: 'D', date: '7', completed: false },
];

const INITIAL_HABITS = [
  { id: '1', name: 'Meditación', time: 'Mañana', done: true, color: '#8B5CF6', icon: 'zap' },
  { id: '2', name: 'Beber Agua (2L)', time: 'Todo el día', done: false, color: '#3B82F6', icon: 'droplet' },
  { id: '3', name: 'Lectura 15 min', time: 'Noche', done: true, color: '#10B981', icon: 'book' },
  { id: '4', name: 'Ejercicio', time: 'Tarde', done: false, color: '#F59E0B', icon: 'activity' },
];

export const HabitProgress = () => {
  const [habits, setHabits] = useState(INITIAL_HABITS);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  const completedCount = habits.filter(h => h.done).length;
  const progressPercent = Math.round((completedCount / habits.length) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Progreso Diario</Text>
        <Text style={styles.dateText}>Hoy, 06 Abr</Text>
      </View>

      {/* Weeklystrip */}
      <View style={styles.weeklyStrip}>
        {WEEK_DAYS.map((item, index) => (
          <View key={index} style={styles.dayCol}>
            <Text style={styles.dayLabel}>{item.day}</Text>
            <View style={[
              styles.dayCircle, 
              item.completed && styles.dayCircleCompleted,
              index === 5 && styles.dayCircleToday
            ]}>
              {item.completed ? (
                <Feather name="check" size={12} color="#FFF" />
              ) : (
                <Text style={[styles.dayDate, index === 5 && { color: '#6366F1' }]}>{item.date}</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Summary Card */}
      <LinearGradient
        colors={['#6366F1', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.summaryCard}
      >
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryTitle}>¡Vas por buen camino!</Text>
          <Text style={styles.summarySubtitle}>Has completado {completedCount} de {habits.length} bjetivos hoy.</Text>
        </View>
        <View style={styles.progressCircle}>
          <Text style={styles.progressValue}>{progressPercent}%</Text>
        </View>
      </LinearGradient>

      {/* Habits List */}
      <View style={styles.habitsList}>
        {habits.map((habit) => (
          <TouchableOpacity 
            key={habit.id} 
            style={[styles.habitItem, habit.done && styles.habitItemDone]}
            onPress={() => toggleHabit(habit.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.habitIcon, { backgroundColor: habit.color + '20' }]}>
              <Feather name={habit.icon as any} size={18} color={habit.color} />
            </View>
            <View style={styles.habitText}>
              <Text style={[styles.habitName, habit.done && styles.textDone]}>{habit.name}</Text>
              <Text style={styles.habitTime}>{habit.time}</Text>
            </View>
            <View style={[styles.checkbox, habit.done && { backgroundColor: habit.color, borderColor: habit.color }]}>
              {habit.done && <Feather name="check" size={14} color="#FFF" />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  dateText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  weeklyStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dayCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  dayCircleToday: {
    borderColor: '#6366F1',
    borderWidth: 2,
  },
  dayDate: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  summaryCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  summarySubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    lineHeight: 16,
  },
  progressCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  progressValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  habitsList: {
    gap: 12,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  habitItemDone: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.8,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  habitText: {
    flex: 1,
  },
  habitName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  habitTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
