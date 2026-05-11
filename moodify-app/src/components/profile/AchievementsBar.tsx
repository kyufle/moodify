import React from 'react';
import { View, Text, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface AchievementsBarProps {
  unlockedIds: string[];
}

export const AchievementsBar = ({ unlockedIds = [] }: AchievementsBarProps) => {
  
  const badgeDefinitions = [
    { id: '1', title: 'Principiante', desc: 'Tu primer hábito', icon: 'award', color: '#6366F1' },
    { id: '2', title: 'Multitarea', desc: '5+ hábitos activos', icon: 'layers', color: '#06B6D4' },
    { id: '9', title: 'Día Perfecto', desc: 'Todo hecho hoy', icon: 'check-circle', color: '#10B981' },
    { id: '13', title: 'Explorador', desc: '3 iconos distintos', icon: 'compass', color: '#84cc16' },
    { id: '14', title: 'Arcoíris', desc: '4 colores usados', icon: 'droplet', color: '#A855F7' },
    { id: '19', title: 'Intelectual', desc: 'Hábito de lectura', icon: 'book', color: '#6366F1' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Logros</Text>
        <View style={styles.badgeCountContainer}>
          <Text style={styles.countText}>
            {unlockedIds.length} de {badgeDefinitions.length}
          </Text>
        </View>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {badgeDefinitions.map((badge) => {
          const isUnlocked = unlockedIds.includes(badge.id);
          
          return (
            <View key={badge.id} style={[styles.badgeCard, !isUnlocked && styles.locked]}>
              <View style={[
                styles.iconCircle, 
                { backgroundColor: isUnlocked ? badge.color + '20' : '#F1F5F9' }
              ]}>
                <Feather 
                  name={badge.icon as any} 
                  size={24} 
                  color={isUnlocked ? badge.color : '#CBD5E1'} 
                />
              </View>
              <Text style={[styles.badgeTitle, !isUnlocked && { color: '#94A3B8' }]}>
                {badge.title}
              </Text>
              {!isUnlocked && (
                <View style={styles.lockIcon}>
                  <Feather name="lock" size={10} color="#94A3B8" />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  badgeCountContainer: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, borderRadius: 12, justifyContent: 'center' },
  countText: { fontSize: 12, fontWeight: '700', color: '#6366F1' },
  scroll: { paddingLeft: 20 },
  badgeCard: { 
    width: 100, 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 15, 
    marginRight: 12, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2
  },
  locked: { opacity: 0.6, elevation: 0 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  badgeTitle: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  lockIcon: { position: 'absolute', top: 10, right: 10 }
});