import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color="#1E293B" />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <LinearGradient
            colors={['#6366F1', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.iconBox}>
              <Feather name="settings" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Ajustes</Text>
            <Text style={styles.subtitle}>
              Ahora puedes gestionar todos tus ajustes directamente desde tu perfil.
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => router.replace('/profile')}
              activeOpacity={0.85}
            >
              <Feather name="user" size={16} color="#6366F1" />
              <Text style={styles.btnText}>Ir a mi perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              // Pasamos el parámetro "tab=ajustes"
              onPress={() => router.replace('/profile?tab=ajustes')}
              activeOpacity={0.85}
            >
              <Feather name="settings" size={16} color="#6366F1" />
              <Text style={styles.btnText}>Abrir ajustes en mi perfil</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </DashboardBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    borderRadius: 28,
    padding: 36,
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    marginTop: 8,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366F1',
  },
});
