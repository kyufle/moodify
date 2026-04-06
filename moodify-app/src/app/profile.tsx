import React, { use } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '@/components/user-provider';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { StaticBottomNavBar } from '@/components/StaticBottomNavBar';

export default function ProfileScreen() {
  const { user, logout } = use(UserContext);

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarLarge}>
                <Feather name="user" size={50} color="#94A3B8" />
              </View>
              <TouchableOpacity style={styles.editBadge}>
                <Feather name="edit-2" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuenta</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.iconWrapper, { backgroundColor: '#E0F2FE' }]}>
                <Feather name="settings" size={20} color="#0EA5E9" />
              </View>
              <Text style={styles.menuText}>Configuración</Text>
              <Feather name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.iconWrapper, { backgroundColor: '#F0F9FF' }]}>
                <Feather name="shield" size={20} color="#0369A1" />
              </View>
              <Text style={styles.menuText}>Privacidad</Text>
              <Feather name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seguridad</Text>
            <TouchableOpacity 
              style={[styles.menuItem, styles.logoutItem]} 
              onPress={logout}
            >
              <View style={[styles.iconWrapper, { backgroundColor: '#FEE2E2' }]}>
                <Feather name="log-out" size={20} color="#EF4444" />
              </View>
              <Text style={[styles.menuText, { color: '#EF4444' }]}>Cerrar Sesión</Text>
            </TouchableOpacity>
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
    paddingTop: 80,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#334155',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F8FAFC',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  logoutItem: {
    borderColor: '#FEE2E2',
    borderWidth: 1,
  }
});
