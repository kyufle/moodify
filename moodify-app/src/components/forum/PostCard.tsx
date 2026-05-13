import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { UserContext } from '@/components/user-provider';
import { avatarMap } from '../../utils/utils'; 
import { useTranslation } from 'react-i18next';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://moodify_backend.test/api/';

function timeAgo(dateStr: string, t: any): string {
  if (!dateStr) return '';
  const date = new Date(dateStr.replace(' ', 'T'));
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const mins = Math.floor(diffInMs / 60000);
  if (mins < 1) return t('forum.now');
  if (mins < 60) return `${t('forum.does')} ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${t('forum.does')} ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${t('forum.does')} ${days}d`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
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
  comments_count?: number;
  user_id: number;
  is_following?: boolean; 
}

interface PostCardProps {
  post: PostData;
  onLikeToggle?: (id: number, liked: boolean, count: number) => void;
  onDelete?: (id: number) => void;
  onCommentPress?: () => void;
  onBlockUser?: (userId: number, userName: string) => void; 
  onFollowToggle?: (userId: number, isFollowing: boolean) => void; 
}

export const PostCard = ({ post, onLikeToggle, onDelete, onCommentPress, onBlockUser, onFollowToggle }: PostCardProps) => {
  const { userValue } = useContext(UserContext);
  const [liking, setLiking] = useState(false);
  const {t} = useTranslation();
  const liked = post.is_liked;
  const likeCount = post.likes_count;
  const isFollowing = post.is_following; 
  const avatarSource = post.image_id ? avatarMap[post.image_id] : null;

  const handleMorePress = () => {
    const isMine = post.user_id === userValue?.user?.id;

    if (isMine) {
      Alert.alert(
        t('forum.yourPost'),
        t('forum.wantDo'),
        [
          { text: t('profile.cancel'), style: "cancel" },
          { 
            text: t('forum.deletePost'), 
            style: "destructive", 
            onPress: () => onDelete && onDelete(post.id) 
          }
        ]
      );
    } else {
      Alert.alert(
        t('forum.options'),
        `${t('forum.config')} @${post.username}`,
        [
          { text: t('profile.cancel'), style: "cancel" },
          { 
            text: isFollowing ? t('forum.unfollow') : t('forum.follow'), 
            onPress: () => onFollowToggle && onFollowToggle(post.user_id, !!isFollowing) 
          },
          { 
            text: t('forum.block'), 
            style: "destructive", 
            onPress: () => onBlockUser && onBlockUser(post.user_id, post.user_name) 
          }
        ]
      );
    }
  };

  const handleLike = async () => {
    if (liking || !userValue?.accessToken) return;
    setLiking(true);
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    if (onLikeToggle) onLikeToggle(post.id, newLiked, newCount);

    try {
      const res = await fetch(`${API}community/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userValue.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        if (onLikeToggle) onLikeToggle(post.id, data.liked, data.likes_count);
      } else { throw new Error(); }
    } catch (e) {
      if (onLikeToggle) onLikeToggle(post.id, liked, likeCount);
      Alert.alert("Error", "No se pudo actualizar el like.");
    } finally {
      setLiking(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}><Feather name="user" size={20} color="#fff" /></View>
          )}
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.user_name}</Text>
          <Text style={styles.authorMeta}>@{post.username} · {timeAgo(post.date, t)}</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn} onPress={handleMorePress}>
          <Feather name="more-horizontal" size={20} color="#CBD5E1" />
        </TouchableOpacity>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike} disabled={liking} activeOpacity={0.7}>
          <MaterialCommunityIcons 
            name={liked ? "heart" : "heart-outline"} 
            size={20} 
            color={liked ? '#EF4444' : '#94A3B8'} 
          />
          <Text style={[styles.actionText, liked && styles.actionTextLiked]}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={onCommentPress}>
          <Feather name="message-circle" size={18} color="#94A3B8" />
          <Text style={styles.actionText}>{post.comments_count ?? 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: 24, padding: 18, marginBottom: 14, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  avatarContainer: { width: 42, height: 42, borderRadius: 21, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarFallback: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  authorMeta: { fontSize: 12, color: '#94A3B8', marginTop: 1 },
  moreBtn: { padding: 4 },
  content: { fontSize: 15, lineHeight: 23, color: '#334155', marginBottom: 14 },
  footer: { flexDirection: 'row', gap: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 14, color: '#94A3B8', fontWeight: '500' },
  actionTextLiked: { color: '#EF4444', fontWeight: '700' },
});