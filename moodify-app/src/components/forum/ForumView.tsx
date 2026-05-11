import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Modal, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '@/components/user-provider';
import { StaticBottomNavBar } from '../StaticBottomNavBar';
import { FriendsMoods } from './FriendsMoods';
import { DiscoverPeople } from './DiscoverPeople';
import { StaffAnnouncements } from './StaffAnnouncements';
import { PostCard, type PostData } from './PostCard';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://moodify_backend.test/api/';

type Tab = 'feed' | 'personas';

export const ForumView = () => {
  const { userValue } = useContext(UserContext);
  const token = userValue?.accessToken;

  const [activeTab, setActiveTab] = useState<Tab>('feed');

  // Posts
  const [posts,        setPosts]        = useState<PostData[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // New post modal
  const [showPostModal,  setShowPostModal]  = useState(false);
  const [postContent,    setPostContent]    = useState('');
  const [postingLoading, setPostingLoading] = useState(false);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const fetchPosts = async () => {
    if (!token) { setLoadingPosts(false); return; }
    setLoadingPosts(true);
    try {
      const r = await fetch(`${API}community/posts`, { headers: authHeaders });
      const data = await r.json();
      if (Array.isArray(data)) {
        setPosts(data.filter((p): p is PostData => p != null && p.id != null));
      }
    } catch {}
    finally { setLoadingPosts(false); }
  };

  useEffect(() => { fetchPosts(); }, [token]);

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      Alert.alert('Vacío', 'Escribe algo antes de publicar.');
      return;
    }
    if (!token) {
      Alert.alert('Sin sesión', 'Inicia sesión para publicar.');
      return;
    }
    setPostingLoading(true);
    try {
      const r = await fetch(`${API}community/posts`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ content: postContent.trim() }),
      });
      const newPost = await r.json();
      if (r.ok && newPost?.id != null) {
        const safe: PostData = {
          id: newPost.id,
          user_name: newPost.user_name ?? '',
          username: newPost.username ?? '',
          image_id: newPost.image_id ?? null,
          content: newPost.content ?? '',
          date: newPost.date ?? new Date().toISOString(),
          likes_count: newPost.likes_count ?? 0,
          is_liked: newPost.is_liked ?? false,
        };
        setPosts(prev => [safe, ...prev]);
        setPostContent('');
        setShowPostModal(false);
      } else {
        Alert.alert('Error', newPost.message ?? 'No se pudo publicar.');
      }
    } catch {
      Alert.alert('Error de red', 'Inténtalo de nuevo.');
    } finally {
      setPostingLoading(false);
    }
  };

  const handleLikeToggle = (id: number, liked: boolean, count: number) => {
    setPosts(prev =>
      prev.map(p => p.id === id ? { ...p, is_liked: liked, likes_count: count } : p)
    );
  };

  const userName = userValue?.user?.name ?? 'Usuario';
  const firstName = userName.split(' ')[0];
  const userInitial = firstName[0]?.toUpperCase() ?? '?';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ── HEADER ── */}
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={['#ffffff30', '#ffffff15']} style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>{userInitial}</Text>
            </LinearGradient>
            <View>
              <Text style={styles.headerGreeting}>Hola, {firstName} 👋</Text>
              <Text style={styles.headerSub}>Comunidad Moodify</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="bell" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tab bar inside header */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'feed' && styles.tabItemActive]}
            onPress={() => setActiveTab('feed')}
            activeOpacity={0.8}
          >
            <Feather name="layout" size={14} color={activeTab === 'feed' ? '#4F46E5' : '#ffffffaa'} />
            <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'personas' && styles.tabItemActive]}
            onPress={() => setActiveTab('personas')}
            activeOpacity={0.8}
          >
            <Feather name="users" size={14} color={activeTab === 'personas' ? '#4F46E5' : '#ffffffaa'} />
            <Text style={[styles.tabText, activeTab === 'personas' && styles.tabTextActive]}>Personas</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── CONTENT ── */}
      {activeTab === 'feed' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Friends moods */}
          <View style={styles.section}>
            <FriendsMoods onDiscoverPress={() => setActiveTab('personas')} />
          </View>

          {/* Staff announcements */}
          <View style={styles.section}>
            <StaffAnnouncements />
          </View>

          {/* Create post */}
          <TouchableOpacity
            style={styles.composeBar}
            onPress={() => setShowPostModal(true)}
            activeOpacity={0.85}
          >
            <LinearGradient colors={['#6366F1', '#A855F7']} style={styles.composeAvatar}>
              <Text style={styles.composeAvatarText}>{userInitial}</Text>
            </LinearGradient>
            <Text style={styles.composePlaceholder}>¿Qué tienes en mente?</Text>
            <LinearGradient colors={['#6366F1', '#A855F7']} style={styles.composeButton}>
              <Feather name="edit-3" size={14} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Posts feed header */}
          <View style={styles.feedHeader}>
            <Text style={styles.feedTitle}>Publicaciones</Text>
            <TouchableOpacity style={styles.refreshBtn} onPress={fetchPosts}>
              <Feather name="refresh-cw" size={14} color="#6366F1" />
            </TouchableOpacity>
          </View>

          {/* Posts */}
          {loadingPosts ? (
            <ActivityIndicator color="#6366F1" style={{ marginVertical: 40 }} />
          ) : posts.length === 0 ? (
            <View style={styles.emptyFeed}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyTitle}>Sé el primero en publicar</Text>
              <Text style={styles.emptySub}>La comunidad te está esperando</Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => setShowPostModal(true)}
                activeOpacity={0.85}
              >
                <LinearGradient colors={['#6366F1', '#A855F7']} style={styles.emptyBtnGrad}>
                  <Feather name="edit-3" size={14} color="#fff" />
                  <Text style={styles.emptyBtnText}>Publicar algo</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} onLikeToggle={handleLikeToggle} />
            ))
          )}
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <DiscoverPeople />
        </ScrollView>
      )}

      <StaticBottomNavBar activeTab="community" />

      {/* ── MODAL: Nueva publicación ── */}
      <Modal visible={showPostModal} animationType="slide" transparent statusBarTranslucent>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.overlay}>
            {/* Backdrop — tap to dismiss */}
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => !postingLoading && setShowPostModal(false)}
            />

            {/* Sheet — isolated from backdrop taps */}
            <View style={styles.sheet}>
              <View style={styles.sheetHandle} />

              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Nueva publicación</Text>
                <TouchableOpacity
                  style={styles.sheetCloseBtn}
                  onPress={() => setShowPostModal(false)}
                  disabled={postingLoading}
                >
                  <Feather name="x" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.sheetDivider} />

              <View style={styles.postInputRow}>
                <LinearGradient colors={['#6366F1', '#A855F7']} style={styles.postAvatar}>
                  <Text style={styles.postAvatarText}>{userInitial}</Text>
                </LinearGradient>
                <TextInput
                  style={styles.postInput}
                  placeholder="Comparte cómo te sientes, un logro o un pensamiento..."
                  placeholderTextColor="#CBD5E1"
                  value={postContent}
                  onChangeText={setPostContent}
                  multiline
                  maxLength={1000}
                  autoFocus
                  editable={!postingLoading}
                />
              </View>

              <View style={styles.postFooter}>
                <Text style={styles.charCount}>{postContent.length}/1000</Text>
                <TouchableOpacity
                  onPress={handleCreatePost}
                  disabled={!postContent.trim() || postingLoading}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={(!postContent.trim() || postingLoading) ? ['#CBD5E1', '#CBD5E1'] : ['#6366F1', '#A855F7']}
                    style={styles.publishBtn}
                  >
                    {postingLoading
                      ? <ActivityIndicator color="#fff" size="small" />
                      : <Text style={styles.publishBtnText}>Publicar</Text>
                    }
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 54 : 44,
    paddingBottom: 0,
    paddingHorizontal: 20,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff40',
  },
  headerAvatarText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  headerGreeting: { fontSize: 16, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 12, color: '#ffffff99', marginTop: 1 },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff20',
    borderRadius: 16,
    padding: 4,
    marginBottom: -1,
    gap: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 13,
  },
  tabItemActive: {
    backgroundColor: '#fff',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: { fontSize: 13, fontWeight: '700', color: '#ffffffaa' },
  tabTextActive: { color: '#4F46E5' },

  // Scroll
  scrollContent: { paddingBottom: 110 },
  section: { marginTop: 20 },

  // Compose bar
  composeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    padding: 14,
    gap: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  composeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  composeAvatarText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  composePlaceholder: { flex: 1, fontSize: 14, color: '#94A3B8' },
  composeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Feed header
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 14,
  },
  feedTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  refreshBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty feed
  emptyFeed: {
    alignItems: 'center',
    paddingVertical: 50,
    gap: 8,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 4 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  emptySub: { fontSize: 14, color: '#94A3B8' },
  emptyBtn: { marginTop: 16, borderRadius: 20, overflow: 'hidden' },
  emptyBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  emptyBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 44,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  sheetCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetDivider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 },

  // Post modal
  postInputRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  postAvatarText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  postInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    minHeight: 110,
    textAlignVertical: 'top',
    lineHeight: 23,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  charCount: { fontSize: 12, color: '#CBD5E1', fontWeight: '500' },
  publishBtn: {
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 22,
    minWidth: 110,
    alignItems: 'center',
  },
  publishBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

export default ForumView;
