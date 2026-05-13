import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StatusBar, Keyboard, Image, FlatList,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '@/components/user-provider';
import { StaticBottomNavBar } from '../StaticBottomNavBar';
import { FriendsMoods } from './FriendsMoods';
import { DiscoverPeople } from './DiscoverPeople';
import { StaffAnnouncements } from './StaffAnnouncements';
import { PostCard, type PostData } from './PostCard';
import { avatarMap } from '../../utils/utils';
import { useRouter } from 'expo-router';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://moodify_backend.test/api/';

export const ForumView: React.FC<{ activeTab: 'feed' | 'personas' | 'comment', selectedPostId?: string }> = ({ activeTab, selectedPostId }) => {
  const router = useRouter();
  const { userValue } = useContext(UserContext);
  const token = userValue?.accessToken;
  const currentUserAvatar = userValue?.user?.image_id;
  const { unreadCount } = useContext(UserContext);
  // const [activeTab, setActiveTab] = useState<>('feed');
  const setActiveTab = (newTab: 'feed' | 'personas') => {
    if(newTab === 'feed')
      router.push('/community/feed');
    else
      router.push('/community/discover');
  }
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [inputText, setInputText] = useState('');
  const [postingLoading, setPostingLoading] = useState(false);
  const [inputHeight, setInputHeight] = useState(45); 

  // @ts-ignore
  const selectedPost = posts?.find(p => p.id == selectedPostId);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: number, name: string } | null>(null);
  const headerHeight = Platform.OS === 'ios' ? 90 : 90
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  // Función de carga de posts (separada para poder usarla en polling sin loading visual)
  const fetchPosts = useCallback(async (showLoading = true) => {
    if (!token) { setLoadingPosts(false); return; }
    if (showLoading) setLoadingPosts(true);
    try {
      const r = await fetch(`${API}community/posts`, { headers: authHeaders });
      const data = await r.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (e) {
      console.error("Error fetching posts", e);
    } finally { 
      if (showLoading) setLoadingPosts(false); 
    }
  }, [token, selectedPost?.id]);

  // 1. POLLING: Actualización cada 5 segundos
  useEffect(() => {
    fetchPosts(true); // Carga inicial con spinner

    const interval = setInterval(() => {
      fetchPosts(false); // Carga silenciosa cada 5 seg
    }, 5000);

    return () => clearInterval(interval);
  }, [token]); // Solo depende del token

  const updatePostState = (id: number, liked: boolean, count: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, is_liked: liked, likes_count: count } : p));
  };

  const handleFollowToggle = async (targetId: number, isFollowing: boolean) => {
    const endpoint = isFollowing ? 'unfollow' : 'follow';
    try {
      const r = await fetch(`${API}community/users/${targetId}/${endpoint}`, { 
        method: 'POST', 
        headers: authHeaders 
      });
      if (r.ok) {
        fetchPosts(false);
        Alert.alert("Éxito", isFollowing ? "Has dejado de seguir" : "Ahora sigues a este usuario");
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo procesar.");
    }
  };

  const handleBlockUser = async (targetId: number, targetName: string) => {
    Alert.alert("Bloquear usuario", `¿Bloquear a ${targetName}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Bloquear", style: "destructive", onPress: async () => {
          try {
            const r = await fetch(`${API}community/users/${targetId}/block`, { method: 'POST', headers: authHeaders });
            if (r.ok) {
              setPosts(prev => prev.filter(p => p.user_id !== targetId));
            }
          } catch (e) { Alert.alert("Error", "No se pudo bloquear."); }
      }}
    ]);
  };

  const fetchComments = async (postId: number) => {
    setLoadingComments(true);
    try {
      const r = await fetch(`${API}community/posts/${postId}/comments`, { headers: authHeaders });
      const data = await r.json();
      setComments(Array.isArray(data) ? data : []);
    } finally { setLoadingComments(false); }
  };

  useEffect(() => {
    if (!selectedPost)
      return;
    fetchComments(selectedPost?.id);
  }, [selectedPost]);

  const handleSendComment = async () => {
    if (!commentText.trim() || !selectedPost) return;
    setPostingLoading(true);
    try {
      const r = await fetch(`${API}community/posts/${selectedPost.id}/comments`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          content: commentText.trim(),
          parent_id: replyingTo?.id || null
        }),
      });
      if (r.ok) {
        setCommentText('');
        setReplyingTo(null);
        // Actualizamos comentarios e inmediatamente posts para ver el contador
        await fetchComments(selectedPost.id);
        fetchPosts(false);
      }
    } finally { setPostingLoading(false); }
  };

  const handleAction = async () => {
    if (!inputText.trim() || !token) return;
    setPostingLoading(true);
    try {
      const r = await fetch(`${API}community/posts`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ content: inputText.trim() }),
      });
      if (r.ok) {
        setInputText('');
        setInputHeight(45); 
        Keyboard.dismiss();
        fetchPosts(false);
      }
    } finally { setPostingLoading(false); }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const r = await fetch(`${API}community/posts/${postId}`, { method: 'DELETE', headers: authHeaders });
      if (r.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
    } catch (e) { Alert.alert("Error", "No se pudo borrar."); }
  };

  if (selectedPost) {
    return (
      <View style={styles.root}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // En Android 'undefined' suele ser más estable
        >
        <View style={styles.commentHeader}>
          <TouchableOpacity onPress={() => router.push("/community/feed")}>
            <Feather name="arrow-left" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.commentHeaderTitle}>Post de {selectedPost.user_name}</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <View style={{ paddingTop: 10 }}>
              <PostCard
                post={selectedPost}
                onDelete={handleDeletePost}
                onLikeToggle={updatePostState}
                onBlockUser={handleBlockUser}
                onFollowToggle={handleFollowToggle}
              />
              <View style={styles.divider} />
              <Text style={styles.repliesTitle}>Respuestas</Text>
            </View>
          }
          ListEmptyComponent={!loadingComments && <Text style={styles.emptyText}>Sé el primero en comentar...</Text>}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={[styles.commentCard, item.parent_id && { marginLeft: 45, opacity: 0.8 }]}>
              <Image source={avatarMap[item.image_id]} style={item.parent_id ? styles.avatarSmall : styles.avatar} />
              <View style={styles.commentContent}>
                <Text style={styles.author}>{item.user_name}</Text>
                <Text style={styles.text}>{item.content}</Text>
                {!item.parent_id && (
                  <TouchableOpacity onPress={() => setReplyingTo({ id: item.id, name: item.user_name })}>
                    <Text style={styles.replyBtnText}>Responder</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
          {replyingTo && (
            <View style={styles.replyInfoBar}>
              <Text style={styles.replyInfoText}>Respondiendo a <Text style={{ fontWeight: 'bold' }}>{replyingTo.name}</Text></Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}><Feather name="x-circle" size={16} color="'#FFECF0'" /></TouchableOpacity>
            </View>
          )}
          <View style={styles.commentInputBar}>
            <TextInput
              style={styles.inputField}
              placeholder="Escribe una respuesta..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity onPress={handleSendComment} disabled={!commentText.trim() || postingLoading}>
              {postingLoading ? <ActivityIndicator size="small" color="'#FFECF0'" /> : <Feather name="send" size={24} color={commentText.trim() ? "'#FFECF0'" : "#CBD5E1"} />}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  const feedTitle = posts.length === 0 && !loadingPosts ? "Recomendaciones" : "Publicaciones";

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <LinearGradient colors={['#fde3e9', '#fde3e9']} style={styles.header}>
          <View style={styles.headerInner}>
            <View style={styles.headerLeft}>
              <View style={styles.headerAvatarContainer}><Image source={avatarMap[currentUserAvatar]} style={styles.avatarImgSmall} /></View>
              <View>
                <Text style={styles.headerGreeting}>Hola, {userValue?.user?.name?.split(' ')[0]} 👋</Text>
                <Text style={styles.headerSub}>Comunidad Moodify</Text>
              </View>
            </View>
          </View>
          <View style={styles.tabBar}>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'feed' && styles.tabItemActive]} onPress={() => setActiveTab('feed')}>
              <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'personas' && styles.tabItemActive]} onPress={() => setActiveTab('personas')}>
              <Text style={[styles.tabText, activeTab === 'personas' && styles.tabTextActive]}>Personas</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {activeTab === 'feed' ? (
            <>
              <FriendsMoods onDiscoverPress={() => setActiveTab('personas')} />
              <StaffAnnouncements />
              <View style={styles.inlineComposeContainer}>
                <View style={styles.inlineComposeHeader}>
                  <View style={styles.composeAvatar}><Image source={avatarMap[currentUserAvatar]} style={styles.avatarImgSmall} /></View>
                  <TextInput
                    style={[styles.inlineInput, { height: Math.max(45, inputHeight) }]}
                    placeholder="¿Qué tienes en mente?"
                    multiline
                    value={inputText}
                    onChangeText={setInputText}
                    onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)}
                  />
                </View>
                {inputText.trim().length > 0 && (
                  <View style={styles.inlineActionRow}>
                     <TouchableOpacity style={styles.inlinePublishBtn} onPress={handleAction} disabled={postingLoading}>
                        {postingLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.inlinePublishBtnText}>Publicar</Text>}
                     </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.feedHeader}><Text style={styles.feedTitle}>{feedTitle}</Text></View>

              {loadingPosts && posts.length === 0 ? <ActivityIndicator color="'#FFECF0'" style={{ marginVertical: 40 }} /> : (
                posts.length === 0 ? (
                    <View style={styles.emptyFeedContainer}>
                      <Feather name="users" size={40} color="#CBD5E1" />
                      <Text style={styles.emptyFeedText}>Aún no sigues a nadie. ¡Descubre personas!</Text>
                      <TouchableOpacity style={styles.discoverBtn} onPress={() => setActiveTab('personas')}><Text style={styles.discoverBtnText}>Explorar personas</Text></TouchableOpacity>
                    </View>
                  ) : posts.map(post => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onLikeToggle={updatePostState} 
                        onDelete={handleDeletePost}
                        onBlockUser={handleBlockUser}
                        onFollowToggle={handleFollowToggle}
                        onCommentPress={() => { router.push("/community/comment/"+post.id); fetchComments(post.id); }} 
                      />
                  ))
              )}
            </>
          ) : <DiscoverPeople />}
        </ScrollView>
      </KeyboardAvoidingView>
      <StaticBottomNavBar 
              activeTab="community/feed" 
              hasNotifications={unreadCount > 0} 
            />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#FFF9FB' // Un blanco rosado muy suave
  },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 15,
    backgroundColor: '#FFDDE4' // Rosa pastel suave
  },
  headerInner: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  headerAvatarContainer: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    borderWidth: 2, 
    borderColor: '#FFF', 
    overflow: 'hidden' 
  },
  avatarImgSmall: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  headerGreeting: { 
    color: '#7D5A5A', // Marrón suave para mejor contraste Kawaii
    fontSize: 18, 
    fontWeight: '800' 
  },
  headerSub: { 
    color: '#7D5A5A', 
    opacity: 0.6, 
    fontSize: 13,
    fontWeight: '600'
  },
  tabBar: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.4)', 
    borderRadius: 20, 
    marginTop: 20, 
    padding: 5 
  },
  tabItem: { 
    flex: 1, 
    paddingVertical: 10, 
    alignItems: 'center', 
    borderRadius: 15 
  },
  tabItemActive: { 
    backgroundColor: '#FFF',
    // Sombra suave para que parezca "flotante"
    shadowColor: '#FFB7C5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tabText: { 
    color: '#A28B8B', 
    fontWeight: '600' 
  },
  tabTextActive: { 
    color: '#FF8DA1' // Rosa vibrante pero dulce
  },
  scrollContent: { 
    paddingBottom: 120 
  },
  inlineComposeContainer: { 
    backgroundColor: '#FFF', 
    marginHorizontal: 20, 
    marginTop: 15, 
    borderRadius: 25, 
    padding: 15, 
    borderWidth: 2,
    borderColor: '#FFECF0'
  },
  inlineComposeHeader: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    gap: 10 
  },
  composeAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    overflow: 'hidden'
  },
  inlineInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#7D5A5A', 
    paddingTop: 10, 
    textAlignVertical: 'top', 
    minHeight: 45 
  },
  inlineActionRow: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginTop: 10, 
    borderTopWidth: 1.5, 
    borderTopColor: '#FFECF0', 
    paddingTop: 10 
  },
  inlinePublishBtn: { 
    backgroundColor: '#B2E2F2', // Azul cielo pastel
    paddingHorizontal: 22, 
    paddingVertical: 10, 
    borderRadius: 15 
  },
  inlinePublishBtnText: { 
    color: '#5A808D', 
    fontWeight: '800', 
    fontSize: 14 
  },
  feedHeader: { 
    paddingHorizontal: 20, 
    marginTop: 25, 
    marginBottom: 10 
  },
  feedTitle: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#7D5A5A' 
  },
  emptyFeedContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 40, 
    marginTop: 40 
  },
  emptyFeedText: { 
    textAlign: 'center', 
    color: '#B8A1A1', 
    marginTop: 15, 
    fontSize: 15, 
    lineHeight: 22 
  },
  discoverBtn: { 
    marginTop: 20, 
    backgroundColor: '#E2F0CB', // Verde menta suave
    paddingHorizontal: 25, 
    paddingVertical: 12, 
    borderRadius: 18 
  },
  discoverBtnText: { 
    color: '#7B8D5A', 
    fontWeight: '800' 
  },
  commentHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 2, 
    borderBottomColor: '#FFECF0' 
  },
  commentHeaderTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#7D5A5A' 
  },
  divider: { 
    height: 2, 
    backgroundColor: '#FFECF0', 
    marginVertical: 12 
  },
  repliesTitle: { 
    fontSize: 14, 
    fontWeight: '800', 
    color: '#D4A5A5', 
    marginLeft: 20, 
    marginBottom: 15 
  },
  commentCard: { 
    flexDirection: 'row', 
    marginBottom: 20, 
    paddingHorizontal: 20, 
    gap: 12 
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFDDE4'
  },
  avatarSmall: { 
    width: 30, 
    height: 30, 
    borderRadius: 15 
  },
  commentContent: { 
    flex: 1, 
    backgroundColor: '#FFF0F3', // Rosa nube muy claro
    padding: 15, 
    borderRadius: 20,
    borderTopLeftRadius: 5 // Estilo burbuja de chat
  },
  author: { 
    fontWeight: '800', 
    marginBottom: 4, 
    fontSize: 14, 
    color: '#7D5A5A' 
  },
  text: { 
    color: '#8A6E6E', 
    fontSize: 15,
    lineHeight: 20
  },
  replyBtnText: { 
    color: '#FF8DA1', 
    fontSize: 13, 
    fontWeight: '800', 
    marginTop: 8 
  },
  replyInfoBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    backgroundColor: '#FFF0F3' 
  },
  replyInfoText: { 
    fontSize: 13, 
    color: '#D4A5A5',
    fontWeight: '600'
  },
  commentInputBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: '#FFF', 
    borderTopWidth: 2, 
    borderTopColor: '#FFECF0', 
    gap: 12 
  },
  inputField: { 
    flex: 1, 
    backgroundColor: '#FFF9FB', 
    borderRadius: 25, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    maxHeight: 100,
    borderWidth: 1.5,
    borderColor: '#FFECF0',
    color: '#7D5A5A'
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 20, 
    color: '#D4A5A5',
    fontWeight: '600'
  },
});

export default ForumView;