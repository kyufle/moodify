import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform, 
  ActivityIndicator 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatQuickActions } from '@/components/chat/ChatQuickActions';
import { StaticBottomNavBar } from '@/components/StaticBottomNavBar';
import { UserContext } from '@/components/user-provider';
import { ChatSettingsModal } from '@/components/chat/ChatSettingsModals';
import { useTranslation } from 'react-i18next';


interface Message {
  id: string;
  text: string;
  isAI: boolean;
  time: string;
  status?: 'pending' | 'sent' | 'read';
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export default function BloomChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: '¡Hola! Soy Bloom, tu asistente de bienestar. ¿En qué puedo ayudarte hoy?', 
      isAI: true, 
      time: getCurrentTime(),
      status: 'read'
    },
  ]);
  const { t, i18n } = useTranslation();
  const { unreadCount } = useContext(UserContext);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [chatTheme, setChatTheme] = useState('#F472B6'); // Rosa Bloom por defecto
  const [isBlocked, setIsBlocked] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const userContext = useContext(UserContext);
  const token = userContext?.userValue?.accessToken;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isBlocked || isTyping) return;

    const tempId = Date.now().toString();
    const userMsg: Message = {
      id: tempId,
      text: text.trim(),
      isAI: false,
      time: getCurrentTime(),
      status: 'pending'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const rawUrl = process.env.EXPO_PUBLIC_API_URL || "";
      const baseUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mensaje: text,
          historial: messages.map(m => ({
            role: m.isAI ? 'assistant' : 'user',
            content: m.text,
          })),
          idioma: i18n.language,
        }),
      });

      const data = await response.json();

      if (response.ok && data.respuesta) {
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? { ...msg, status: 'read' } : msg
        ));

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: data.respuesta, //
          isAI: true,
          time: getCurrentTime(),
          status: 'read'
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error("Error Bloom:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, status: 'sent' } : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  return (
    <View style={styles.mainContainer}>
      <DashboardBackground>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <Feather name="arrow-left" size={24} color={chatTheme} />
                </TouchableOpacity>
                
                <View style={styles.aiPersona}>
                  <View style={styles.avatarBox}>
                    <Feather name="heart" size={20} color={chatTheme} />
                    <View style={styles.onlineDot} />
                  </View>
                  <View>
                    <Text style={[styles.aiName, { color: chatTheme }]}>Bloom</Text>
                    <Text style={styles.aiStatus}>
                      {isBlocked ? 'Chat pausado' : 'En línea y escuchándote'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* <TouchableOpacity onPress={() => setIsSettingsVisible(true)} style={styles.settingsButton}>
                <Feather name="more-vertical" size={24} color={chatTheme} />
              </TouchableOpacity> */}
            </View>

            <View style={styles.chatContainer}>
              <ScrollView 
                ref={scrollViewRef}
                style={styles.chatArea}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {messages.map((msg) => (
                  <MessageBubble 
                    key={msg.id} 
                    text={msg.text} 
                    isAI={msg.isAI} 
                    time={msg.time}
                    status={msg.status}
                    customColor={chatTheme}
                  />
                ))}
                
                {isTyping && (
                  <View style={styles.typingContainer}>
                    <ActivityIndicator size="small" color={chatTheme} />
                    <Text style={[styles.typingText, { color: chatTheme }]}>Bloom está escribiendo...</Text>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* Sección de Entrada */}
            <View style={[styles.inputSection, { marginBottom: 75 }]}>
              {!isBlocked && (
                <View style={styles.quickActionsArea}>
                  <ChatQuickActions onAction={(label) => sendMessage(label)} />
                </View>
              )}
              
              <View style={styles.inputRow}>
                {isBlocked ? (
                  <View style={styles.blockedNotice}>
                    <Text style={styles.blockedText}>Has bloqueado este chat. Desbloquéalo en ajustes.</Text>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity style={styles.attachButton}>
                      <Feather name="plus" size={22} color={chatTheme} />
                    </TouchableOpacity>
                    
                    <TextInput 
                      style={styles.input}
                      placeholder="Cuéntame algo..."
                      value={inputText}
                      onChangeText={setInputText}
                      multiline
                      placeholderTextColor="#F9A8D4"
                    />

                    <TouchableOpacity 
                      style={[
                        styles.sendButton, 
                        { backgroundColor: chatTheme }, 
                        (!inputText.trim() || isTyping) && styles.sendButtonDisabled
                      ]} 
                      onPress={() => sendMessage(inputText)}
                      disabled={!inputText.trim() || isTyping}
                    >
                      <Feather name="send" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </DashboardBackground>

      <ChatSettingsModal 
        visible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        onSelectTheme={setChatTheme}
        isBlocked={isBlocked}
        onToggleBlock={() => setIsBlocked(!isBlocked)}
      />
      
       <StaticBottomNavBar 
              activeTab="chat" 
              hasNotifications={unreadCount > 0} 
            />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFF' },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#FCE7F3',
    zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  settingsButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  aiPersona: { flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 5 },
  avatarBox: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFF1F2', justifyContent: 'center',
    alignItems: 'center', position: 'relative',
    borderWidth: 1, borderColor: '#FCE7F3'
  },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFF',
  },
  aiName: { fontSize: 16, fontWeight: '800' },
  aiStatus: { fontSize: 11, color: '#FB7185', fontWeight: '600' },
  chatContainer: { flex: 1 },
  chatArea: { flex: 1 },
  chatContent: { padding: 15, paddingBottom: 20 },
  typingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, marginLeft: 5 },
  typingText: { fontSize: 12, fontStyle: 'italic' },
  inputSection: {
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    elevation: 8,
  },
  quickActionsArea: {
    paddingVertical: 10,
    backgroundColor: '#FFF9FB', 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF1F2',
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 22, gap: 10 },
  blockedNotice: { flex: 1, alignItems: 'center', padding: 10 },
  blockedText: { color: '#EF4444', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  attachButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center' },
  input: {
    flex: 1, backgroundColor: '#FDF2F8', borderRadius: 20,
    paddingHorizontal: 15, paddingVertical: 10,
    maxHeight: 100, fontSize: 15, color: '#334155',
    borderWidth: 1, borderColor: '#FCE7F3',
  },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: '#F9A8D4' },
});