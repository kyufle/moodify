import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BADGES = [
  { id: '1', icon: 'moon', label: 'Dormir 8h', color: '#8B5CF6' },
  { id: '2', icon: 'zap', label: 'Racha 7d', color: '#F59E0B' },
  { id: '3', icon: 'heart', label: 'Zen', color: '#EF4444' },
  { id: '4', icon: 'shield', label: 'Guardián', color: '#10B981' },
];

export const AchievementsBar = () => {
  const router = useRouter();

  const handlePress = (badgeName: string) => {
    if (badgeName === 'Dormir 8h') {
      router.push('/calendar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logros</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BADGES.map(badge => (
          <TouchableOpacity 
            key={badge.id} 
            style={styles.badgeItem}
            onPress={() => handlePress(badge.label)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: badge.color + '20' }]}>
              <Feather name={badge.icon as any} size={20} color={badge.color} />
            </View>
            <Text style={styles.badgeLabel}>{badge.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  badgeItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  }
});
