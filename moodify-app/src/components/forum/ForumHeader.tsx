import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '@/components/user-provider';

interface ForumHeaderProps {
  onSearchPress?: () => void;
}

export const ForumHeader = ({ onSearchPress }: ForumHeaderProps) => {
  const { userValue } = React.use(UserContext);

  if (!userValue?.user) return null;

  const firstName = userValue.user.name?.split(' ')[0] ?? 'Usuario';

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Hola, {firstName}</Text>
        <Text style={styles.subtitle}>Conecta y comparte con tu comunidad</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn} onPress={onSearchPress} activeOpacity={0.7}>
          <Feather name="user-plus" size={20} color="#6366F1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Feather name="bell" size={20} color="#1E293B" />
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
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
});
