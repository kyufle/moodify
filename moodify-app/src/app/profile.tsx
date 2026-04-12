import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { UserContext } from '@/components/user-provider';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { StaticBottomNavBar } from '@/components/StaticBottomNavBar';

import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { HabitProgress } from '@/components/profile/HabitProgress';
import { ChallengesSection } from '@/components/profile/ChallengesSection';
import { AchievementsBar } from '@/components/profile/AchievementsBar';

export default function ProfileScreen() {
  const { user, logout } = useContext(UserContext);
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Configuración</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
            <Feather name="settings" size={20} color="#1E293B" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Contenedor principal con fondo blanco para legibilidad */}
          <View style={styles.mainCard}>
            <ProfileHeader name={user.name} email={user.email} />
            
            <View style={styles.divider} />
            
            <HabitProgress />
            <ChallengesSection />
            <AchievementsBar />

            <View style={styles.footerActions}>
              <TouchableOpacity 
                style={styles.settingsButton} 
                onPress={() => router.push('/settings')}
              >
                <Feather name="settings" size={18} color="#64748B" />
                <Text style={styles.settingsText}>Ajustes de la cuenta</Text>
                <Feather name="chevron-right" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </DashboardBackground>

      <StaticBottomNavBar activeTab="user" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 110,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 32,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  footerActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  settingsText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  }
});
