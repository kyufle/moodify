import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatQuickActions } from '@/components/chat/ChatQuickActions';
import { StaticBottomNavBar } from '@/components/StaticBottomNavBar';

const INITIAL_MESSAGES = [
  { id: '1', text: '¡Hola! Soy Moodie, tu asistente de bienestar. ¿En qué puedo ayudarte hoy?', isAI: true, time: '16:40' },
];

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: text,
      isAI: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: '¡Entendido! Estoy aquí para motivarte. Esa es una excelente pregunta sobre tu bienestar.',
        isAI: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    // Pequeño delay para asegurar que el scroll llegue al final tras renderizar
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <DashboardBackground>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Feather name="arrow-left" size={24} color="#1E293B" />
              </TouchableOpacity>
              
              <View style={styles.aiPersona}>
                <View style={styles.avatarBox}>
                  <Feather name="cpu" size={20} color="#6366F1" />
                  <View style={styles.onlineDot} />
                </View>
                <View>
                  <Text style={styles.aiName}>Moodie IA</Text>
                  <Text style={styles.aiStatus}>En línea</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.backButton}>
                <Feather name="more-vertical" size={20} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.chatArea}
              contentContainerStyle={[
                styles.chatContent, 
                { paddingBottom: 40 } // Espacio extra para que el último mensaje no quede pegado al input
              ]}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(msg => (
                <MessageBubble key={msg.id} {...msg} />
              ))}
              
              {isTyping && (
                  <View style={styles.typingContainer}>
                      <ActivityIndicator size="small" color="#94A3B8" />
                      <Text style={styles.typingText}>Moodie está escribiendo...</Text>
                  </View>
              )}
            </ScrollView>

            {/* Quick Actions & Input Section */}
            <View style={[styles.inputSection, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 15 }]}>
              <ChatQuickActions onAction={(label) => sendMessage(label)} />
              
              <View style={styles.inputRow}>
                <TouchableOpacity style={styles.attachButton}>
                  <Feather name="plus" size={22} color="#64748B" />
                </TouchableOpacity>
                
                <TextInput 
                  style={styles.input}
                  placeholder="Escribe un mensaje..."
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  placeholderTextColor="#94A3B8"
                />

                <TouchableOpacity 
                  style={[styles.sendButton, !inputText && styles.sendButtonDisabled]} 
                  onPress={() => sendMessage(inputText)}
                  disabled={!inputText}
                >
                  <Feather name="send" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </DashboardBackground>
      
      {/* Añadimos la barra de navegación también en el chat para consistencia */}
      {!isTyping && <StaticBottomNavBar activeTab="chat" />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiPersona: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  aiName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  aiStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 15,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginLeft: 5,
  },
  typingText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    paddingTop: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap: 10,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 120,
    fontSize: 15,
    color: '#334155',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E1',
  }
});
