import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator, 
  AppState, AppStateStatus, Image 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '@/components/user-provider';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { avatarMap } from '@/utils/utils';

// --- FUNCIONES DE UTILIDAD PARA FECHAS (FUERA DEL COMPONENTE) ---
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
  const [isOnline, setIsOnline] = useState(false); // Estado para el "En línea"

  const flatListRef = useRef<FlatList>(null);
  const appState = useRef(AppState.currentState);

  const avatarSource = imageKey && avatarMap[imageKey as keyof typeof avatarMap]
    ? avatarMap[imageKey as keyof typeof avatarMap]
    : { uri: 'https://via.placeholder.com/150' };

  const markAsRead = async () => {
    if (!token || !recipientId) return;
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}messages/read/${recipientId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
    } catch (e) { console.error("Error markAsRead:", e); }
  };

  const fetchMessages = async () => {
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
    } catch (e) { console.error("Error en fetch:", e); }
  };

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

  useEffect(() => {
    if (!token || !recipientId) return;

    const loadData = async () => {
      await fetchMessages();
      await markAsRead(); 
      setLoadingInitial(false);
    };

    loadData();

    let intervalId = setInterval(() => {
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
  }, [recipientId, token, myId]);

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
        <MessageBubble text={item.text} isAI={item.isAI} time={item.time} status={item.status} />
      </View>
    );
  };

  if (loadingInitial && !token) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#1E293B" />
            </TouchableOpacity>
            
            <Image 
              source={avatarSource} 
              style={styles.avatar}
            />

            <View style={{ marginLeft: 10 }}>
              <Text style={styles.headerTitle}>{username}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: isOnline ? '#10B981' : '#94A3B8' }
                ]} />
                <Text style={{ 
                  fontSize: 12, 
                  color: isOnline ? '#10B981' : '#64748B',
                  fontWeight: isOnline ? '600' : '400'
                }}>
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

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe un mensaje..."
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={isSending}>
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
    padding: 10, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0' 
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    backgroundColor: '#F1F5F9'
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  inputContainer: { 
    flexDirection: 'row', 
    padding: 12, 
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
    paddingVertical: 8, 
    maxHeight: 100 
  },
  sendButton: { 
    backgroundColor: '#6366F1', 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 10 
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center'
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10
  },
  dateBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase'
  }
});