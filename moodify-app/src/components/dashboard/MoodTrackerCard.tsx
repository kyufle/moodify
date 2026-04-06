import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MOODS = [
  { emoji: '😔', label: 'Triste', color: '#60A5FA' },
  { emoji: '😐', label: 'Neutral', color: '#94A3B8' },
  { emoji: '😊', label: 'Bien', color: '#10B981' },
  { emoji: '🤩', label: 'Increíble', color: '#F59E0B' },
  { emoji: '🔥', label: 'Motivado', color: '#EF4444' },
];

export const MoodTrackerCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
      <View style={styles.moodRow}>
        {MOODS.map((mood, index) => (
          <TouchableOpacity key={index} style={styles.moodItem}>
            <View style={[styles.emojiBg, { backgroundColor: mood.color + '15' }]}>
              <Text style={styles.emoji}>{mood.emoji}</Text>
            </View>
            <Text style={styles.label}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 15,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodItem: {
    alignItems: 'center',
    gap: 6,
  },
  emojiBg: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  }
});
