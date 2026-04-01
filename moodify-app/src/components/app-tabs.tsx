import React, { use } from 'react';
import { View, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { UserContext } from './user-provider';

// Componente custom para la barra de navegación inferior
function CustomTabBar({ state, descriptors, navigation }: any) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={styles.tabBarContainer}>
      {/* Botón 1: Calendario */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigation.navigate('calendar')} // Ruta placeholder
      >
        <Feather name="calendar" size={24} color={state.index === 0 ? "#1E293B" : "#94A3B8"} />
      </TouchableOpacity>

      {/* Botón 2: Comunidad/Usuarios */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigation.navigate('community')} // Ruta placeholder
      >
        <Feather name="users" size={24} color={state.index === 1 ? "#1E293B" : "#94A3B8"} />
      </TouchableOpacity>

      {/* Botón 3: Home / Dashboard (Elevado) */}
      <View style={styles.homeButtonWrapper}>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('dashboard')}
          activeOpacity={0.9}
        >
          <Feather name="home" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Botón 4: Perfil */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigation.navigate('profile')} // Ruta placeholder
      >
        <Feather name="user" size={24} color={state.index === 3 ? "#1E293B" : "#94A3B8"} />
      </TouchableOpacity>

      {/* Botón 5: Chat */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigation.navigate('chat')} // Ruta placeholder
      >
        <Feather name="message-circle" size={24} color={state.index === 4 ? "#1E293B" : "#94A3B8"} />
      </TouchableOpacity>
    </View>
  );
}

export default function AppTabs() {
  const { isLoggedIn } = use(UserContext);

  if (!isLoggedIn) {
    // Si la app controla el estado de Auth, se puede ocultar
    // Para propósitos de este mockup de UI, siempres devolvemos el Tabs
  }

  return (
    <Tabs 
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="community" />
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="chat" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 0, 
    elevation: 10,
    zIndex: 100,
  },
  tabItem: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonWrapper: {
    top: -20, // Elevarlo fuera de la barra
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#334155', // Color base oscuro del UI
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  }
});
