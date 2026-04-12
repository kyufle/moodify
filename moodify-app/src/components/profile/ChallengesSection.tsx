import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CHALLENGES = [
  { id: '1', name: '30 Días sin Azúcar', days: '12/30', color: '#F472B6', icon: 'coffee' },
  { id: '2', name: 'Caminar 10k Pasos', days: '5/7', color: '#60A5FA', icon: 'trending-up' },
  { id: '3', name: 'Dormir 8 Horas', days: '20/30', color: '#818CF8', icon: 'moon' },
];

export const ChallengesSection = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mis Retos</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CHALLENGES.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.challengeCard}
            onPress={() => router.push(`/challenge/${item.id}`)}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
              <Feather name={item.icon as any} size={20} color={item.color} />
            </View>
            <Text style={styles.challengeName}>{item.name}</Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>{item.days} Días</Text>
              <Feather name="chevron-right" size={14} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  challengeCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    height: 40,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  }
});
