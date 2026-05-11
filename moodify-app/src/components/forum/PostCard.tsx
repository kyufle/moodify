import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '@/components/user-provider';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://moodify_backend.test/api/';

const AVATAR_GRADS: [string, string][] = [
  ['#6366F1', '#A855F7'],
  ['#10B981', '#3B82F6'],
  ['#F59E0B', '#EF4444'],
  ['#EC4899', '#8B5CF6'],
  ['#0EA5E9', '#6366F1'],
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `Hace ${days}d`;
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export interface PostData {
  id: number;
  user_name: string;
  username: string;
  image_id: string | null;
  content: string;
  date: string;
  likes_count: number;
  is_liked: boolean;
}

interface PostCardProps {
  post: PostData;
  onLikeToggle?: (id: number, liked: boolean, count: number) => void;
}

export const PostCard = ({ post, onLikeToggle }: PostCardProps) => {
  const { userValue } = useContext(UserContext);
  const [liked,     setLiked]     = useState(post.is_liked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes_count ?? 0);
  const [liking,    setLiking]    = useState(false);

  const grad = AVATAR_GRADS[post.id % AVATAR_GRADS.length];
  const initial = (post.user_name ?? post.username)[0]?.toUpperCase() ?? '?';

  const handleLike = async () => {
    if (liking || !userValue?.accessToken) return;
    setLiking(true);
    const optimisticLiked = !liked;
    const optimisticCount = optimisticLiked ? likeCount + 1 : likeCount - 1;
    setLiked(optimisticLiked);
    setLikeCount(optimisticCount);
    try {
      const res = await fetch(`${API}community/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userValue.accessToken}`,
          Accept: 'application/json',
        },
      });
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likes_count);
      onLikeToggle?.(post.id, data.liked, data.likes_count);
    } catch {
      setLiked(!optimisticLiked);
      setLikeCount(likeCount);
    } finally {
      setLiking(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient colors={grad} style={styles.avatar}>
          <Text style={styles.avatarInitial}>{initial}</Text>
        </LinearGradient>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.user_name}</Text>
          <Text style={styles.authorMeta}>
            @{post.username} · {timeAgo(post.date)}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Feather name="more-horizontal" size={20} color="#CBD5E1" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleLike}
          disabled={liking}
          activeOpacity={0.7}
        >
          <Feather
            name="heart"
            size={18}
            color={liked ? '#EF4444' : '#94A3B8'}
            style={liked && { opacity: 1 }}
          />
          {liked && (
            <View style={styles.heartFill} />
          )}
          <Text style={[styles.actionText, liked && styles.actionTextLiked]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Feather name="message-circle" size={18} color="#94A3B8" />
          <Text style={styles.actionText}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Feather name="share-2" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  authorInfo: { flex: 1 },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  authorMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  moreBtn: { padding: 4 },
  content: {
    fontSize: 15,
    lineHeight: 23,
    color: '#334155',
    marginBottom: 14,
  },
  footer: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    position: 'relative',
  },
  heartFill: {
    position: 'absolute',
    left: 0,
  },
  actionText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  actionTextLiked: {
    color: '#EF4444',
    fontWeight: '700',
  },
});
