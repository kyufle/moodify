import React from 'react';
import { View, Text, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface BadgeProps {
  unlockedIds: string[]; // Usaremos esto como fuente de verdad
}

export const AchievementsBar = ({ unlockedIds = [] }: BadgeProps) => {
  const {t} = useTranslation();
  const badges = [
    { id: '1', title: t('profile.beginner'), desc: t('profile.yourFirstHabit'), icon: 'award', color: '#6366F1' },
    { id: '2', title: t('profile.multitask'), desc: t('profile.activeHabits'), icon: 'layers', color: '#06B6D4' },
    { id: '3', title: t('profile.ambitious'), desc: t('profile.activeChallenges'), icon: 'target', color: '#EC4899' },
    { id: '4', title: t('profile.collector'), desc: t('profile.habitsCreated'), icon: 'grid', color: '#F43F5E' },
    { id: '5', title: t('profile.survivor'), desc: t('profile.challenge50'), icon: 'trending-up', color: '#8B5CF6' },
    { id: '6', title: t('profile.unstoppable'), desc: t('profile.challengeCompleted'), icon: 'zap', color: '#F59E0B' },
    { id: '13', title: t('profile.explorer'), desc: t('profile.differentIcons'), icon: 'compass', color: '#84cc16' },
    { id: '14', title: t('profile.rainbow'), desc: t('profile.colorsUsed'), icon: 'droplet', color: '#A855F7' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile.myAchievements')}</Text>
        <View style={styles.badgeCountContainer}>
            <Feather name="unlock" size={12} color="#6366F1" style={{marginRight: 4}} />
            <Text style={styles.countText}>
                {unlockedIds.length} / {badges.length}
            </Text>
        </View>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {badges.map(badge => {
          // LA CLAVE: Si el ID está en el array que viene de Laravel, se ilumina.
          const isUnlocked = unlockedIds.includes(badge.id);

          return (
            <View 
              key={badge.id} 
              style={[styles.badgeCard, !isUnlocked && styles.locked] as ViewStyle[]}
            >
              <View style={[
                  styles.iconCircle, 
                  { backgroundColor: isUnlocked ? badge.color + '15' : '#F1F5F9' },
                  isUnlocked && { borderColor: badge.color + '40', borderWidth: 1 }
              ]}>
                <Feather 
                  name={badge.icon as any} 
                  size={22} 
                  color={isUnlocked ? badge.color : '#CBD5E1'} 
                />
              </View>
              <Text 
                  numberOfLines={1} 
                  style={[styles.badgeTitle, !isUnlocked && { color: '#94A3B8' }] as TextStyle[]}
              >
                  {badge.title}
              </Text>
              <Text style={styles.badgeDesc}>{badge.desc}</Text>
              
              {!isUnlocked && (
                  <View style={styles.lockBadge}>
                      <Feather name="lock" size={10} color="#CBD5E1" />
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