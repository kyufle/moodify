import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Props {
  activeTab: 'calendar' | 'community/feed' | 'home' | 'user' | 'chat';
  hasNotifications?: boolean;
}

export const StaticBottomNavBar = ({ activeTab, hasNotifications }: Props) => {
  return (
    <View style={styles.tabBarContainer}>
      <TouchableOpacity style={styles.tabItem} onPress={() => router.navigate('/calendar')} activeOpacity={0.7}>
        <Feather name="calendar" size={24} color={activeTab === 'calendar' ? '#1E293B' : '#94A3B8'} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => router.navigate('/community/feed')} 
        activeOpacity={0.7}
      >
        <Feather name="users" size={24} color={activeTab === 'community/feed' ? '#1E293B' : '#94A3B8'} />
      </TouchableOpacity>

      <View style={styles.homeButtonWrapper}>
        <TouchableOpacity 
          style={[styles.homeButton, activeTab !== 'home' && styles.homeButtonInactive]} 
          onPress={() => router.navigate('/dashboard')}
          activeOpacity={0.9}
        >
          <Feather name="home" size={28} color={activeTab === 'home' ? '#FFFFFF' : '#334155'} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => router.navigate('/profile')} 
        activeOpacity={0.7}
      >
        <Feather name="user" size={24} color={activeTab === 'user' ? '#1E293B' : '#94A3B8'} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => router.navigate('/chat')}
        activeOpacity={0.7}
      >
        <View>
          <Feather name="message-circle" size={24} color={activeTab === 'chat' ? '#1E293B' : '#94A3B8'} />
          {hasNotifications && <View style={styles.notificationDot} />}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 1000, 
  },
  tabItem: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#bf98eb',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  homeButtonWrapper: {
    top: -20, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#334155', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  homeButtonInactive: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0.05,
    elevation: 2,
  }
});