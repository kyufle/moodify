import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Switch, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '@/components/user-provider';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { StaticBottomNavBar } from '@/components/StaticBottomNavBar';

import { HabitProgress } from '@/components/profile/HabitProgress';
import { ChallengesSection } from '@/components/profile/ChallengesSection';
import { AchievementsBar } from '@/components/profile/AchievementsBar';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://moodify_backend.test/api/';

export default function ProfileScreen() {
  const { userValue, logout } = useContext(UserContext);
  const user = userValue?.user ?? { name: 'Usuario', email: '', streak: 0, points: 0 };
  const token = userValue?.accessToken ?? null;

  const [activeTab, setActiveTab] = useState<'perfil' | 'ajustes'>('perfil');
  const [habitsData, setHabitsData] = useState<any[]>([]);
  const [challengesData, setChallengesData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  const authHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchUnlockedAchievements = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}achievements`, { method: 'GET', headers: authHeaders });
      const data = await res.json();
      if (res.ok) setUnlockedIds(data.unlocked_ids || []);
    } catch (e) { console.error(e); }
  }, [token]);

  useEffect(() => { fetchUnlockedAchievements(); }, [fetchUnlockedAchievements]);

  const syncLogros = (data: any, type: 'habits' | 'challenges' | 'weekly') => {
    if (type === 'habits') setHabitsData(data);
    if (type === 'challenges') setChallengesData(data);
    if (type === 'weekly') setWeeklyData(data);
    
 
    fetchUnlockedAchievements();
  };

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <View style={styles.topBar}><Text style={styles.topBarTitle}>Mi Perfil</Text></View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <LinearGradient colors={['#6366F1', '#8B5CF6', '#A855F7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarRing}><Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} /></View>
            </View>
            <Text style={styles.heroName}>{user.name}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}><Text style={styles.statNum}>{user.streak}</Text><Text style={styles.statLbl}>Racha</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}><Text style={styles.statNum}>{user.points}</Text><Text style={styles.statLbl}>Puntos</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}><Text style={styles.statNum}>{unlockedIds.length}</Text><Text style={styles.statLbl}>Logros</Text></View>
            </View>
          </LinearGradient>

          <View style={styles.tabBar}>
            {['perfil', 'ajustes'].map((tab: any) => (
              <TouchableOpacity key={tab} style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>{tab === 'perfil' ? 'Perfil' : 'Ajustes'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'perfil' && (
            <View style={styles.card}>
              <HabitProgress 
                onDataLoaded={(d) => syncLogros(d, 'habits')} 
                onWeeklyLoaded={(d) => syncLogros(d, 'weekly')} 
              />
              <ChallengesSection onDataLoaded={(d) => syncLogros(d, 'challenges')} />
              <AchievementsBar 
                habits={habitsData} 
                challenges={challengesData} 
                weeklyStatus={weeklyData}
                unlockedIds={unlockedIds} 
              />
            </View>
          )}
          {/* Ajustes... */}
        </ScrollView>
      </DashboardBackground>
      <StaticBottomNavBar activeTab="user" />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  topBarTitle: { fontSize: 26, fontWeight: '800', color: '#1E293B' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 110, gap: 12 },
  heroCard: { borderRadius: 28, paddingVertical: 28, paddingHorizontal: 24, alignItems: 'center' },
  avatarWrapper: { marginBottom: 10 },
  avatarRing: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: 'white', overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  heroName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  statsRow: { flexDirection: 'row', marginTop: 15, gap: 20, backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 20 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: 'white' },
  statLbl: { fontSize: 10, color: 'white' },
  statDivider: { width: 1, backgroundColor: 'white', opacity: 0.3 },
  tabBar: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: 5 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: { backgroundColor: '#EEF2FF' },
  tabBtnText: { color: '#94A3B8', fontWeight: '600' },
  tabBtnTextActive: { color: '#6366F1' },
  card: { backgroundColor: 'white', borderRadius: 25, padding: 10 }
});