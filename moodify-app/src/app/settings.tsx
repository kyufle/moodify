import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const SettingItem = ({ icon, label, type = 'chevron', value, onValueChange }: any) => (
    <TouchableOpacity style={styles.item} disabled={type === 'switch'}>
      <View style={styles.itemLeft}>
        <View style={styles.iconBox}>
          <Feather name={icon} size={20} color="#64748B" />
        </View>
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      {type === 'chevron' && <Feather name="chevron-right" size={20} color="#94A3B8" />}
      {type === 'switch' && (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: '#E2E8F0', true: '#6366F1' }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajustes</Text>
          <View style={{ width: 44 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.mainCard}>
            <Text style={styles.sectionTitle}>Cuenta</Text>
            <SettingItem icon="user" label="Información Personal" />
            <SettingItem icon="lock" label="Contraseña y Seguridad" />
            <SettingItem icon="eye-off" label="Privacidad" />
            
            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Preferencias</Text>
            <SettingItem 
              icon="bell" 
              label="Notificaciones Push" 
              type="switch" 
              value={notifications} 
              onValueChange={setNotifications} 
            />
            <SettingItem 
              icon="moon" 
              label="Modo Oscuro" 
              type="switch" 
              value={darkMode} 
              onValueChange={setDarkMode} 
            />
            <SettingItem icon="globe" label="Idioma" />

            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Soporte</Text>
            <SettingItem icon="help-circle" label="Centro de Ayuda" />
            <SettingItem icon="mail" label="Contactar Soporte" />
            <SettingItem icon="file-text" label="Términos y Condiciones" />

            <TouchableOpacity style={styles.logoutButton}>
              <Feather name="log-out" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.versionText}>Moodify v1.0.4 (Beta)</Text>
        </ScrollView>
      </DashboardBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 32,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    marginTop: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 30,
    fontWeight: '600',
  }
});
