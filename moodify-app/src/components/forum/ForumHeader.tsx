import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '@/components/user-provider';

export const ForumHeader = () => {
  const { userValue, logout } = React.use(UserContext);

  if (userValue?.user)
    return;
  
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Hola, {userValue.user.name}!</Text>
        <Text style={styles.subtitle}>Conecta y comparte con otros</Text>
      </View>
      
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={logout}>
          <Feather name="log-out" size={20} color="#EF4444" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="bell" size={22} color="#1E293B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  }
});
