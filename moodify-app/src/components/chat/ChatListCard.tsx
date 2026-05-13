import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';

interface ChatListCardProps {
  name: string;
  lastMessage: string;
  image?: ImageSourcePropType;
  time?: string;
  onPress: () => void;
}

export const ChatListCard = ({ name, lastMessage, image, time, onPress }: ChatListCardProps) => (
  <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
    <Image 
      source={image} 
      style={styles.avatar} 
    />
    <View style={styles.content}>
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.time}>{time || '8:43'}</Text>
      </View>
      <Text style={styles.message} numberOfLines={1}>{lastMessage}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 12, alignItems: 'center', backgroundColor: '#FFF' },
  avatar: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#F1F5F9' },
  content: { flex: 1, marginLeft: 12, borderBottomWidth: 0.5, borderBottomColor: '#F0F2F5', paddingBottom: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  time: { fontSize: 12, color: '#64748B' },
  message: { fontSize: 14, color: '#64748B' }
});