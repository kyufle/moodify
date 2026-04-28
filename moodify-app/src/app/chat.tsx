import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatQuickActions } from '@/components/chat/ChatQuickActions';
import { StaticBottomNavBar } from '@/components/StaticBottomNavBar';
import { UserContext } from '@/components/user-provider';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  time: string;
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const INITIAL_MESSAGES: Message[] = [
  { 
    id: '1', 
    text: '¡Hola! Soy Bloom, tu asistente de bienestar. ¿En qué puedo ayudarte hoy?', 
    isAI: true, 
    time: getCurrentTime() 
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const userContext = useContext(UserContext);
    
  const userValue = userContext?.userValue;
  const token = userValue?.accessToken;
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      isAI: false,
      time: getCurrentTime(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}chat`, {
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
            content: m.text
          }))
        }),
      });

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.respuesta,
        isAI: true,
        time: getCurrentTime(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error conectando con Bloom:", error);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  return (
    <View style={styles.mainContainer}>
      <DashboardBackground>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
            // Ajustamos el offset para que no suba de más en Android
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Feather name="arrow-left" size={24} color="#BE185D" />
              </TouchableOpacity>
              
              <View style={styles.aiPersona}>
                <View style={styles.avatarBox}>
                  <Feather name="heart" size={20} color="#F472B6" />
                  <View style={styles.onlineDot} />
                </View>
                <View>
                  <Text style={styles.aiName}>Bloom</Text>
                  <Text style={styles.aiStatus}>En línea y escuchándote</Text>
                </View>
              </View>
              <View style={styles.placeholder} />
            </View>

            {/* Chat Area */}
            <View style={styles.chatContainer}>
              <ScrollView 
                ref={scrollViewRef}
                style={styles.chatArea}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {messages.map(msg => (
                  <MessageBubble key={msg.id} text={msg.text} isAI={msg.isAI} time={msg.time} />
                ))}
                
                {isTyping && (
                  <View style={styles.typingContainer}>
                    <ActivityIndicator size="small" color="#F472B6" />
                    <Text style={styles.typingText}>Bloom está escribiendo con cariño...</Text>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* Input Section - FIX: Añadimos un margen inferior para que no choque con la Nav Bar */}
            <View style={[
              styles.inputSection, 
              { marginBottom: isTyping ? 0 : 70 } // Deja espacio para la Nav Bar cuando no se escribe
            ]}>
              <View style={styles.quickActionsArea}>
                 <ChatQuickActions onAction={(label) => sendMessage(label)} />
              </View>
              
              <View style={styles.inputRow}>
                <TouchableOpacity style={styles.attachButton}>
                  <Feather name="plus" size={22} color="#DB2777" />
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
                  style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]} 
                  onPress={() => sendMessage(inputText)}
                  disabled={!inputText.trim() || isTyping}
                >
                  <Feather name="send" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </DashboardBackground>
      
      {/* La Nav Bar es absoluta o está al final, por eso necesitamos el marginBottom arriba */}
      <StaticBottomNavBar activeTab="chat" />
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
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  aiPersona: { flexDirection: 'row', alignItems: 'center', gap: 12 },
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
  aiName: { fontSize: 16, fontWeight: '800', color: '#BE185D' },
  aiStatus: { fontSize: 11, color: '#FB7185', fontWeight: '600' },
  placeholder: { width: 40 },
  chatContainer: { flex: 1 },
  chatArea: { flex: 1 },
  chatContent: { padding: 15, paddingBottom: 20 },
  typingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, marginLeft: 5 },
  typingText: { fontSize: 12, color: '#DB2777', fontStyle: 'italic' },
  inputSection: {
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    // Elevación para que se vea por encima del fondo
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionsArea: {
    paddingVertical: 10,
    backgroundColor: '#FFF9FB', 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF1F2',
  },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15,
    paddingVertical: 22,
    gap: 10 
  },
  attachButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center',
  },
  input: {
    flex: 1, backgroundColor: '#FDF2F8', borderRadius: 20,
    paddingHorizontal: 15, paddingVertical: 10,
    maxHeight: 100, fontSize: 15, color: '#334155',
    borderWidth: 1, borderColor: '#FCE7F3',
  },
  sendButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F472B6', justifyContent: 'center', alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#F9A8D4' },
});