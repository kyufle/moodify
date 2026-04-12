import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

interface ProfileHeaderProps {
  name: string;
  email: string;
}

export const ProfileHeader = ({ name, email }: ProfileHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarBorder}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={styles.avatar}
          />
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Feather name="camera" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.emailText}>{email}</Text>
        
        <View style={styles.badgeRow}>
          <View style={[styles.miniBadge, { backgroundColor: '#F0F9FF' }]}>
            <Feather name="zap" size={12} color="#0EA5E9" />
            <Text style={[styles.badgeText, { color: '#0EA5E9' }]}>NV. 12</Text>
          </View>
          <View style={[styles.miniBadge, { backgroundColor: '#FEF2F2' }]}>
            <Feather name="flame" size={12} color="#EF4444" />
            <Text style={[styles.badgeText, { color: '#EF4444' }]}>7 Días</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatarBorder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  editButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#334155',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  emailText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  miniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  }
});
