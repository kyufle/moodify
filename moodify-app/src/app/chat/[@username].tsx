import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator, 
  AppState, AppStateStatus, Image, ImageBackground
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { getUserThemeFromContext, UserContext } from '@/components/user-provider';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { avatarMap } from '@/utils/utils';
import { SafeStorage } from './index'; 
import { ALL_BACKGROUNDS } from './ChatCustomizer';

const getDayLabel = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (msgDate.getTime() === today.getTime()) return 'Hoy';
  if (msgDate.getTime() === yesterday.getTime()) return 'Ayer';
  
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

export default function PersonalChatScreen() {
  const { "@username": username, id: recipientId, imageKey } = useLocalSearchParams();
  const router = useRouter();
  
  const { userValue } = useContext(UserContext);
  const token = userValue?.accessToken;
  const myId = userValue?.user?.id; 

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  const chatTheme = getUserThemeFromContext(userValue);
  const chatThemeBackgroundSource = ALL_BACKGROUNDS.find((background) => background.id === chatTheme.bgName)?.source

  const flatListRef = useRef<FlatList>(null);
  const appState = useRef(AppState.currentState);

  const scrollToBottom = () => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const avatarSource = imageKey && avatarMap[imageKey as keyof typeof avatarMap]
    ? avatarMap[imageKey as keyof typeof avatarMap]
    : { uri: 'https://via.placeholder.com/150' };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await SafeStorage.getItem('custom_chat_theme');
        if (saved) setChatTheme(JSON.parse(saved));
      } catch (e) {
        console.error("Error tema:", e);
      }
    };
    loadTheme();
  }, []);

  const fetchMessages = async () => {
    if (!token || !recipientId) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}messages/user/${recipientId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const data = await response.json();
      
      if (response.ok) {
        setIsOnline(data.recipient_online);
        const formatted = data.messages.map((m: any) => {
          const isMe = myId ? (String(m.sender_id).trim() === String(myId).trim()) : false;
          return {
            id: m.id.toString(),
            text: m.content,
            isAI: !isMe, 
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fullDate: m.created_at,
            status: m.read_at ? 'read' : 'sent'
          };
        });
        setMessages(formatted);
      }
    } catch (e) { 
      console.error("Error fetch:", e); 
    } finally {
      setLoadingInitial(false);
    }
  };

  const markAsRead = async () => {
    if (!token || !recipientId) return;
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}messages/read/${recipientId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
    } catch (e) { console.error("Error markAsRead:", e); }
  };

  useEffect(() => {
    if (!token || !recipientId) return;

    // Carga inicial
    fetchMessages();
    markAsRead();

    const intervalId = setInterval(() => {
        fetchMessages();
        markAsRead(); 
    }, 5000);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        fetchMessages();
        markAsRead();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [recipientId, token]);

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;
    const messageText = inputText;
    setInputText('');
    setIsSending(true);

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}messages`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ recipient_id: recipientId, mensaje: messageText }),
      });
      if (response.ok) fetchMessages();
    } catch (error) { console.error(error); } finally { setIsSending(false); }
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const showDateSeparator = index === 0 || 
      new Date(messages[index].fullDate).toDateString() !== new Date(messages[index - 1].fullDate).toDateString();

    return (
      <View>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <View style={styles.dateLine} />
            <View style={styles.dateBadge}>
                <Text style={styles.dateText}>{getDayLabel(item.fullDate)}</Text>
            </View>
            <View style={styles.dateLine} />
          </View>
        )}
        <MessageBubble 
          text={item.text} 
          isAI={item.isAI} 
          time={item.time} 
          status={item.status} 
          myBubbleColor={chatTheme.myMsgColor}
          otherBubbleColor={chatTheme.otherMsgColor}
          myTextColor={chatTheme.textColorOwn}
          otherTextColor={chatTheme.textColorOther}
        />
      </View>
    );
  };

  if (loadingInitial) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <KeyboardAvoidingView 
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
  style={{ flex: 1 }}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} 
>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
              <Feather name="arrow-left" size={24} color="#1E293B" />
            </TouchableOpacity>
            <Image source={avatarSource} style={styles.avatar} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.headerTitle}>{username}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.statusDot, { backgroundColor: isOnline ? '#10B981' : '#94A3B8' }]} />
                <Text style={{ fontSize: 12, color: isOnline ? '#10B981' : '#64748B', fontWeight: isOnline ? '600' : '400' }}>
                  {isOnline ? 'en línea' : 'desconectado'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={{ padding: 5 }}>
              <Feather name="more-vertical" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <ImageBackground source={chatThemeBackgroundSource} style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
            onContentSizeChange={() => scrollToBottom()}
          />
        </ImageBackground>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe un mensaje..."
            multiline
            onFocus={() => setTimeout(scrollToBottom, 200)}
          />
          <TouchableOpacity 
            onPress={handleSend} 
            style={[styles.sendButton, { backgroundColor: chatTheme.myMsgColor }]} 
            disabled={isSending}
          >
            {isSending ? <ActivityIndicator color="white" size="small" /> : <Feather name="send" size={20} color="white" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { 
  flexDirection: 'row', 
  alignItems: 'center', 
  justifyContent: 'space-between', 
  paddingHorizontal: 10, 
  paddingVertical: 12,
  backgroundColor: '#e7e7e7c2', 
  borderBottomWidth: 1, 
  borderBottomColor: '#E2E8F0',
  paddingTop: Platform.OS === 'android' ? 60 : 8, 
},
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 5, backgroundColor: '#F1F5F9' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
inputContainer: { 
  flexDirection: 'row', 
  paddingHorizontal: 10, 
  paddingTop: 10,
  paddingBottom: 10, 
  backgroundColor: '#FFF', 
  borderTopWidth: 1, 
  borderTopColor: '#E2E8F0', 
  alignItems: 'center'
},
input: { 
  flex: 1, 
  backgroundColor: '#F1F5F9', 
  borderRadius: 20, 
  paddingHorizontal: 15, 
  paddingVertical: 0, 
  minHeight: 40, 
  maxHeight: 100, 
  color: '#000',
  textAlignVertical: 'center'
},
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  dateSeparator: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, justifyContent: 'center' },
  dateLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 10 },
  dateBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  dateText: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }
});