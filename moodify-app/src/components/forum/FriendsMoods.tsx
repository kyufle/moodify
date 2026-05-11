import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '@/components/user-provider';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://moodify_backend.test/api/';

const MOOD_MAP: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
  happy:       { emoji: '😄', label: 'Feliz',        color: '#10B981', bg: '#ECFDF5' },
  glad:        { emoji: '😊', label: 'Bien',          color: '#3B82F6', bg: '#EFF6FF' },
  excited:     { emoji: '🤩', label: 'Emocionado',    color: '#F59E0B', bg: '#FFFBEB' },
  calm:        { emoji: '😌', label: 'Tranquilo',     color: '#0EA5E9', bg: '#F0F9FF' },
  motivated:   { emoji: '💪', label: 'Motivado',      color: '#6366F1', bg: '#EEF2FF' },
  grateful:    { emoji: '🙏', label: 'Agradecido',    color: '#8B5CF6', bg: '#F5F3FF' },
  proud:       { emoji: '🌟', label: 'Orgulloso',     color: '#F59E0B', bg: '#FFFBEB' },
  relaxed:     { emoji: '🧘', label: 'Relajado',      color: '#10B981', bg: '#ECFDF5' },
  energetic:   { emoji: '⚡', label: 'Enérgico',      color: '#EAB308', bg: '#FEFCE8' },
  focused:     { emoji: '🎯', label: 'Enfocado',      color: '#6366F1', bg: '#EEF2FF' },
  sad:         { emoji: '😢', label: 'Triste',        color: '#64748B', bg: '#F8FAFC' },
  tired:       { emoji: '😴', label: 'Cansado',       color: '#9CA3AF', bg: '#F9FAFB' },
  anxious:     { emoji: '😰', label: 'Ansioso',       color: '#8B5CF6', bg: '#F5F3FF' },
  stressed:    { emoji: '😣', label: 'Estresado',     color: '#EF4444', bg: '#FEF2F2' },
  angry:       { emoji: '😤', label: 'Enfadado',      color: '#DC2626', bg: '#FEF2F2' },
  bored:       { emoji: '😑', label: 'Aburrido',      color: '#6B7280', bg: '#F9FAFB' },
  nervous:     { emoji: '😬', label: 'Nervioso',      color: '#F97316', bg: '#FFF7ED' },
  lonely:      { emoji: '🫂', label: 'Solo',          color: '#7C3AED', bg: '#F5F3FF' },
  overwhelmed: { emoji: '🌊', label: 'Agobiad@',      color: '#1D4ED8', bg: '#EFF6FF' },
  hopeful:     { emoji: '🌈', label: 'Esperanzad@',   color: '#EC4899', bg: '#FDF2F8' },
};

const DEFAULT_MOOD = { emoji: '❓', label: 'Sin estado', color: '#CBD5E1', bg: '#F8FAFC' };

const AVATAR_GRADS: [string, string][] = [
  ['#6366F1', '#A855F7'],
  ['#10B981', '#3B82F6'],
  ['#F59E0B', '#EF4444'],
  ['#EC4899', '#8B5CF6'],
  ['#0EA5E9', '#6366F1'],
];

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Ahora';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
};

interface FriendMood {
  id: number;
  name: string;
  username: string;
  image_id: string | null;
  mood: string | null;
  mood_date: string | null;
}

interface FriendsMoodsProps {
  onDiscoverPress?: () => void;
}

export const FriendsMoods = ({ onDiscoverPress }: FriendsMoodsProps) => {
  const { userValue } = useContext(UserContext);
  const [friends, setFriends] = useState<FriendMood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userValue?.accessToken) { setLoading(false); return; }
    fetch(`${API}community/following-moods`, {
      headers: {
        Authorization: `Bearer ${userValue.accessToken}`,
        Accept: 'application/json',
      },
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setFriends(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userValue?.accessToken]);

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator color="#6366F1" />
      </View>
    );
  }

  if (friends.length === 0) {
    return (
      <TouchableOpacity style={styles.emptyBox} onPress={onDiscoverPress} activeOpacity={0.85}>
        <LinearGradient colors={['#EEF2FF', '#F5F3FF']} style={styles.emptyGrad}>
          <View style={styles.emptyLeft}>
            <Text style={styles.emptyEmoji}>👥</Text>
            <View>
              <Text style={styles.emptyTitle}>Sigue a tus amigos</Text>
              <Text style={styles.emptySubtitle}>Verás sus estados de ánimo aquí</Text>
            </View>
          </View>
          <View style={styles.emptyAction}>
            <Feather name="user-plus" size={15} color="#6366F1" />
            <Text style={styles.emptyActionText}>Seguir</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>¿Cómo están tus amigos?</Text>
        <TouchableOpacity onPress={onDiscoverPress} activeOpacity={0.7}>
          <Text style={styles.seeAll}>+ Seguir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {friends.map(friend => {
          const moodKey = friend.mood?.toLowerCase() ?? '';
          const mood = MOOD_MAP[moodKey] ?? DEFAULT_MOOD;
          const grad = AVATAR_GRADS[friend.id % AVATAR_GRADS.length];
          const firstName = friend.name.split(' ')[0];
          const initial = firstName[0]?.toUpperCase() ?? '?';
          const ago = timeAgo(friend.mood_date);

          return (
            <TouchableOpacity key={friend.id} activeOpacity={0.82}>
              <View style={[styles.card, { backgroundColor: mood.bg, borderLeftColor: mood.color }]}>
                {/* Avatar */}
                <LinearGradient colors={grad} style={styles.avatar}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </LinearGradient>

                {/* Info */}
                <View style={styles.cardBody}>
                  <Text style={styles.friendName} numberOfLines={1}>{firstName}</Text>
                  <View style={styles.moodRow}>
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={[styles.moodLabel, { color: mood.color }]}>{mood.label}</Text>
                  </View>
                </View>

                {/* Time badge */}
                {ago ? (
                  <Text style={[styles.timeBadge, { color: mood.color }]}>{ago}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingBox: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty state
  emptyBox: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  emptyGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  emptyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emptyEmoji: { fontSize: 28 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  emptySubtitle: { fontSize: 12, color: '#64748B', marginTop: 1 },
  emptyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyActionText: { fontSize: 13, fontWeight: '700', color: '#6366F1' },

  // List
  container: { marginBottom: 4 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  seeAll: { fontSize: 13, fontWeight: '700', color: '#6366F1' },

  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 10,
  },

  // Mood card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderLeftWidth: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    width: 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  cardBody: { flex: 1, gap: 3 },
  friendName: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  moodRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  moodEmoji: { fontSize: 13 },
  moodLabel: { fontSize: 12, fontWeight: '600' },
  timeBadge: { fontSize: 10, fontWeight: '700', alignSelf: 'flex-start', opacity: 0.7 },
});
