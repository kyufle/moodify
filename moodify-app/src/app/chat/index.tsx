import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Image, TextInput, ActivityIndicator, Keyboard, 
  Alert
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatCustomizer } from './ChatCustomizer';

const SafeStorage = {
  data: {} as Record<string, string>,
  getItem: async (key: string) => SafeStorage.data[key] || null,
  setItem: async (key: string, value: string) => { SafeStorage.data[key] = value; }
};

export { SafeStorage };

import { StaticBottomNavBar } from '@/components/StaticBottomNavBar';
import { ChatListCard } from '@/components/chat/ChatListCard';
import { getUserThemeFromContext, UserContext } from '@/components/user-provider';
import { avatarMap } from '@/utils/utils'; 
import { useTranslation } from 'react-i18next';

interface SearchUser {
  id: string;
  username: string;
  image_id?: string | null;
  is_following?: boolean;
  last_seen_at?: string | null;
}

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://moodify_backend.test/api/';

export default function ChatMainList() {
  const { unreadCount } = useContext(UserContext);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userValue, setUserValue } = useContext(UserContext);
  const token = userValue?.accessToken;
  const userId = userValue?.user?.id;
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const {t} = useTranslation();
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customizerVisible, setCustomizerVisible] = useState(false);
  const [isFullSearchView, setIsFullSearchView] = useState(false); 
  const [loadingConv, setLoadingConv] = useState(true);

  const STORAGE_KEY = `chat_search_history_${userId}`;

  const checkIfOnline = (lastSeenAt: string | null) => {
    if (!lastSeenAt) return false;
    const lastSeen = new Date(lastSeenAt).getTime();
    const now = new Date().getTime();
    const diff = Math.abs(now - lastSeen);
    return diff < 90000; 
  };

  useEffect(() => {
    if (token && userId) {
      fetchConversations();
      loadSearchHistory();
      const interval = setInterval(fetchConversations, 3000);
      return () => clearInterval(interval);
    }
  }, [token, userId]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}users/search?q=${searchQuery}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setSearchResults(data);
      } catch (e) { console.error(e); } finally { setIsSearching(false); }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}conversations`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const data = await response.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoadingConv(false);
    }
  };

  const loadSearchHistory = async () => {
    if (!userId) return;
    const saved = await SafeStorage.getItem(STORAGE_KEY);
    if (saved) setSearchHistory(JSON.parse(saved));
  };

  const toggleFollow = async (user: SearchUser) => {
    try {
      const updatedStatus = !user.is_following;
      const endpoint = user.is_following ? 'unfollow' : 'follow';
      try {
        const r = await fetch(`${API}community/users/${user.id}/${endpoint}`, { 
          method: 'POST', 
          headers: authHeaders 
        });
        if (r.ok) {
          setSearchResults(prev => prev.map(u => 
            u.id === user.id ? { ...u, is_following: updatedStatus } : u
          ));
          const newHistory = searchHistory.map(u => 
            u.id === user.id ? { ...u, is_following: updatedStatus } : u
          );
          setSearchHistory(newHistory);
          await SafeStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
          Alert.alert(t('conversation.exit'), user.is_following ? t('conversation.unfollowed') : t('conversation.nowFollowing'));
        }
      } catch (e) {
        console.error("Error", "No se pudo procesar.");
      }
    } catch (e) { console.error(e); }
  };

  const removeFromHistory = async (id: string) => {
    const newHistory = searchHistory.filter(h => h.id !== id);
    setSearchHistory(newHistory);
    await SafeStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const goToChat = async (targetUser: SearchUser) => {
    const newHistory = [targetUser, ...searchHistory.filter(h => h.id !== targetUser.id)].slice(0, 10);
    setSearchHistory(newHistory);
    await SafeStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    
    setSearchQuery('');
    setIsFullSearchView(false);
    Keyboard.dismiss();

    router.push({ 
      pathname: "/chat/[@username]", 
      params: { 
        "@username": `${targetUser.username}`, 
        id: targetUser.id,
        imageKey: targetUser.image_id 
      } 
    } as any);
  };

  const renderSearchItem = ({ item }: { item: SearchUser }) => {
    const avatarSource = item.image_id && avatarMap[item.image_id as keyof typeof avatarMap]
      ? avatarMap[item.image_id as keyof typeof avatarMap]
      : { uri: 'https://via.placeholder.com/150' };

    const isHistoryItem = searchQuery.length === 0;
    const isOnline = checkIfOnline(item.last_seen_at || null);

    return (
      <View style={styles.searchItem}>
        <View>
          <Image source={avatarSource} style={styles.searchAvatar} />
          <View style={[styles.onlineDot, { backgroundColor: isOnline ? '#10B981' : '#94A3B8' }]} />
        </View>
        <TouchableOpacity style={styles.searchInfoArea} onPress={() => goToChat(item)}>
          <Text style={styles.searchUsername}>{item.username}</Text>
          <Text style={{fontSize: 12, color: '#64748B'}}>
            {item.is_following ? t('conversation.follow') : t('conversation.chat')}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.searchActions}>
          <TouchableOpacity onPress={() => toggleFollow(item)} style={{ padding: 8 }}>
            <Feather 
              name={item.is_following ? "user-check" : "user-plus"} 
              size={20} 
              color={item.is_following ? "#10B981" : "#64748B"} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => goToChat(item)} style={{ padding: 8 }}>
            <FontAwesome5 name="comment-dots" size={20} color="#3B82F6" />
          </TouchableOpacity>
          {isHistoryItem && (
            <TouchableOpacity onPress={() => removeFromHistory(item.id)} style={{ padding: 8 }}>
              <Feather name="x" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loadingConv) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#128C7E" />
        <Text style={{ marginTop: 10, color: '#64748B' }}>{t('conversation.loadingChats')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {!isFullSearchView && (
        <View style={styles.header}>
          <Text style={styles.whatsappTitle}>Moodify chat</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
                onPress={() => setCustomizerVisible(true)}
                style={{ marginLeft: 15, padding: 5 }}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Feather name="more-vertical" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.searchBarContainer}>
        <View style={styles.inputBox}>
          {isFullSearchView && (
            <TouchableOpacity onPress={() => { setIsFullSearchView(false); setSearchQuery(''); Keyboard.dismiss(); }}>
              <Feather name="arrow-left" size={20} color="black" style={{ marginRight: 10 }} />
            </TouchableOpacity>
          )}
          {!isFullSearchView && <Feather name="search" size={20} color="#64748B" />}
          <TextInput
            placeholder={t('conversation.searchUers')}
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsFullSearchView(true)} 
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {isFullSearchView ? (
          <FlatList
            data={searchQuery.length > 0 ? searchResults : searchHistory}
            keyExtractor={(item) => `search-${item.id}`}
            renderItem={renderSearchItem}
            keyboardShouldPersistTaps="always"
            ListEmptyComponent={
              !isSearching && searchQuery.length > 0 ? (
                <Text style={{textAlign: 'center', marginTop: 20, color: '#64748B'}}>No se encontraron resultados</Text>
              ) : null
            }
          />
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => `chat-${item.id}`}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => {
              const chatPartner = String(item.user_id) === String(userId) ? item.recipient : item.user;
              const senderId = item.last_message_sender_id || item.sender_id;
              const esMio = String(senderId) === String(userId);
              
              const isPartnerOnline = checkIfOnline(chatPartner?.last_seen_at || null);
              const isTyping = item.is_typing === true || item.is_typing === 1;

              let displayMessage = item.last_message || "Toca para chatear";
              let messageColor = '#64748B';
              let fontWeight: "400" | "600" = '400';

              if (isTyping) {
                displayMessage = "escribiendo...";
                messageColor = '#10B981';
                fontWeight = '600';
              } else if (esMio && item.last_message) {
                displayMessage = `${t('conversation.you')}: ${item.last_message}`;
              }

              const fechaRaw = item.last_message_at || item.updated_at || item.created_at;
              const hora = fechaRaw ? new Date(fechaRaw).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

              const avatarSource = chatPartner?.image_id && avatarMap[chatPartner.image_id as keyof typeof avatarMap]
                ? avatarMap[chatPartner.image_id as keyof typeof avatarMap]
                : { uri: 'https://via.placeholder.com/150' };
              
              return (
                <View style={styles.chatRowContainer}>
                  <ChatListCard
                    name={chatPartner?.username || 'Usuario'}
                    lastMessage={displayMessage}
                    image={avatarSource}
                    time={isTyping ? "" : hora}
                    lastMessageStyle={{ color: messageColor, fontWeight: fontWeight }}
                    onPress={() => router.push({ 
                      pathname: "/chat/[@username]", 
                      params: { 
                        "@username": `${chatPartner?.username}`, 
                        id: chatPartner?.id,
                        imageKey: chatPartner?.image_id 
                      } 
                    } as any)}
                  />
                  
                  <View style={[
                    styles.statusIndicator, 
                    { backgroundColor: (isPartnerOnline || isTyping) ? '#10B981' : '#94A3B8' }
                  ]} />

                  {item.unread_count > 0 && !isTyping && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>
                        {item.unread_count > 99 ? '99+' : item.unread_count}
                      </Text>
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}
      </View>

      {!isFullSearchView && (
        <TouchableOpacity 
          style={styles.bloomFloatingButton} 
          onPress={() => router.push('/chat/bloom')}
        >
          <FontAwesome5 name="heart" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Navegación inferior fija */}
      {!isFullSearchView &&  <StaticBottomNavBar 
              activeTab="chat" 
              hasNotifications={unreadCount > 0} 
            />}
      
      <ChatCustomizer 
        currentTheme={getUserThemeFromContext(userValue)}
        visible={customizerVisible} 
        onClose={() => setCustomizerVisible(false)} 
        onSave={(responseData: any) => {          
          setUserValue({ accessToken: userValue.accessToken, user: responseData.theme });
          setCustomizerVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    zIndex: 10 
  },
  whatsappTitle: { fontSize: 22, fontWeight: '700', color: '#128C7E' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  searchBarContainer: { paddingHorizontal: 16, marginBottom: 10 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 25, paddingHorizontal: 15, height: 45 },
  input: { flex: 1, fontSize: 16, marginLeft: 10 },
  searchItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#F1F5F9' },
  searchAvatar: { width: 45, height: 45, borderRadius: 22.5 },
  searchInfoArea: { flex: 1, marginLeft: 15 },
  searchUsername: { fontSize: 16, fontWeight: '600' },
  searchActions: { flexDirection: 'row', alignItems: 'center' },
  chatRowContainer: { position: 'relative' },
  statusIndicator: {
    position: 'absolute',
    left: 52, 
    top: 45, 
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 11
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF'
  },
  unreadBadge: {
    position: 'absolute', right: 20, bottom: 15, backgroundColor: '#25D366', 
    minWidth: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, zIndex: 10
  },
  unreadText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  bloomFloatingButton: {
    position: 'absolute', 
    bottom: 100, 
    right: 20, 
    width: 60, 
    height: 60, 
    borderRadius: 30,
    backgroundColor: '#F472B6', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 5
  },
});