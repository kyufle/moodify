import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { UserContext } from '../components/user-provider';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const [language, setLanguage] = React.useState('Español');
  const { logout, darkMode, setDarkMode } = React.useContext(UserContext);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/profile');
    }
  };

  const currentStyles = {
    cardBg: darkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    textColor: darkMode ? '#F8FAFC' : '#334155',
    subtextColor: darkMode ? '#94A3B8' : '#64748B',
    titleColor: darkMode ? '#FFFFFF' : '#1E293B',
    iconBg: darkMode ? '#334155' : '#F1F5F9',
    dividerBg: darkMode ? '#334155' : '#F1F5F9',
    navBg: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255, 255, 255, 0.5)',
  };

  const SettingItem = ({ icon, label, type = 'chevron', value, onValueChange, valueText, onPress }: any) => (
    <TouchableOpacity style={styles.item} disabled={type === 'switch' && !onPress} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconBox, { backgroundColor: currentStyles.iconBg }]}>
          <Feather name={icon} size={20} color={darkMode ? '#94A3B8' : '#64748B'} />
        </View>
        <Text style={[styles.itemLabel, { color: currentStyles.textColor }]}>{label}</Text>
      </View>
      {type === 'chevron' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {valueText && <Text style={{ color: currentStyles.subtextColor, fontSize: 14 }}>{valueText}</Text>}
          <Feather name="chevron-right" size={20} color={currentStyles.subtextColor} />
        </View>
      )}
      {type === 'switch' && (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: darkMode ? '#334155' : '#E2E8F0', true: '#6366F1' }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={[styles.backButton, { backgroundColor: currentStyles.navBg }]}>
            <Feather name="arrow-left" size={24} color={currentStyles.titleColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentStyles.titleColor }]}>Ajustes</Text>
          <View style={{ width: 44 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.mainCard, { backgroundColor: currentStyles.cardBg }]}>
            <Text style={styles.sectionTitle}>Cuenta</Text>
            <SettingItem icon="user" label="Información Personal" onPress={() => router.push('/settings/personal')} />
            <SettingItem icon="lock" label="Contraseña y Seguridad" onPress={() => router.push('/settings/security')} />
            <SettingItem icon="eye-off" label="Privacidad" onPress={() => router.push('/settings/privacy')} />
            
            <View style={[styles.divider, { backgroundColor: currentStyles.dividerBg }]} />
            
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
            <SettingItem 
              icon="globe" 
              label="Idioma" 
              valueText={language}
              onPress={() => setLanguage(language === 'Español' ? 'English' : 'Español')}
            />

            <View style={[styles.divider, { backgroundColor: currentStyles.dividerBg }]} />
            
            <Text style={styles.sectionTitle}>Soporte</Text>
            <SettingItem icon="help-circle" label="Centro de Ayuda" onPress={() => router.push('/settings/help')} />
            <SettingItem icon="mail" label="Contactar Soporte" onPress={() => router.push('/settings/support')} />
            <SettingItem icon="file-text" label="Términos y Condiciones" onPress={() => router.push('/settings/terms')} />

            <TouchableOpacity style={[styles.logoutButton, { borderTopColor: currentStyles.dividerBg }]} onPress={logout}>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mainCard: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
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
