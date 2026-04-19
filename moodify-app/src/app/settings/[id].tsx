import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { UserContext } from '@/components/user-provider';

const SCREEN_TITLES: Record<string, string> = {
  personal: 'Información Personal',
  security: 'Contraseña y Seguridad',
  privacy: 'Privacidad',
  help: 'Centro de Ayuda',
  support: 'Contactar Soporte',
  terms: 'Términos y Condiciones'
};

export default function SettingsSubScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const title = SCREEN_TITLES[id as string] || 'Ajustes';
  const { darkMode } = useContext(UserContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(true);
  const [supportMessage, setSupportMessage] = useState('');

  const handleSave = () => {
    Alert.alert("Guardado", "Tus cambios han sido guardados correctamente.");
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/settings');
    }
  };

  const currentStyles = {
    cardBg: darkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    textColor: darkMode ? '#F8FAFC' : '#334155',
    subtextColor: darkMode ? '#94A3B8' : '#64748B',
    inputBg: darkMode ? '#0F172A' : '#F8FAFC',
    inputBorder: darkMode ? '#334155' : '#E2E8F0',
    titleColor: darkMode ? '#FFFFFF' : '#1E293B',
    faqBg: darkMode ? '#1E293B' : '#F8FAFC',
    dividerBg: darkMode ? '#334155' : '#F1F5F9',
  };

  const renderContent = () => {
    switch (id) {
      case 'personal':
        return (
          <View style={[styles.card, { backgroundColor: currentStyles.cardBg }]}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput style={[styles.input, { backgroundColor: currentStyles.inputBg, borderColor: currentStyles.inputBorder, color: currentStyles.textColor }]} placeholderTextColor={currentStyles.subtextColor} placeholder="Tu nombre" value={name} onChangeText={setName} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput style={[styles.input, { backgroundColor: currentStyles.inputBg, borderColor: currentStyles.inputBorder, color: currentStyles.textColor }]} placeholderTextColor={currentStyles.subtextColor} placeholder="usuario@moodify.com" keyboardType="email-address" value={email} onChangeText={setEmail} />
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
              <Text style={styles.primaryButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        );
      case 'security':
        return (
          <View style={[styles.card, { backgroundColor: currentStyles.cardBg }]}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña actual</Text>
              <TextInput style={[styles.input, { backgroundColor: currentStyles.inputBg, borderColor: currentStyles.inputBorder, color: currentStyles.textColor }]} placeholderTextColor={currentStyles.subtextColor} placeholder="••••••••" secureTextEntry value={currentPass} onChangeText={setCurrentPass} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nueva contraseña</Text>
              <TextInput style={[styles.input, { backgroundColor: currentStyles.inputBg, borderColor: currentStyles.inputBorder, color: currentStyles.textColor }]} placeholderTextColor={currentStyles.subtextColor} placeholder="••••••••" secureTextEntry value={newPass} onChangeText={setNewPass} />
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
              <Text style={styles.primaryButtonText}>Actualizar Contraseña</Text>
            </TouchableOpacity>
          </View>
        );
      case 'privacy':
        return (
          <View style={[styles.card, { backgroundColor: currentStyles.cardBg }]}>
            <View style={styles.toggleRow}>
              <View>
                <Text style={[styles.toggleTitle, { color: currentStyles.textColor }]}>Perfil Público</Text>
                <Text style={[styles.toggleDesc, { color: currentStyles.subtextColor }]}>Otros pueden ver tus estadísticas</Text>
              </View>
              <Switch value={toggle1} onValueChange={setToggle1} trackColor={{ false: darkMode ? '#334155' : '#E2E8F0', true: '#6366F1' }} />
            </View>
            <View style={[styles.divider, { backgroundColor: currentStyles.dividerBg }]} />
            <View style={styles.toggleRow}>
              <View>
                <Text style={[styles.toggleTitle, { color: currentStyles.textColor }]}>Análisis de uso</Text>
                <Text style={[styles.toggleDesc, { color: currentStyles.subtextColor }]}>Ayúdanos enviando datos anónimos</Text>
              </View>
              <Switch value={toggle2} onValueChange={setToggle2} trackColor={{ false: darkMode ? '#334155' : '#E2E8F0', true: '#6366F1' }} />
            </View>
          </View>
        );
      case 'help':
        return (
          <View style={[styles.card, { backgroundColor: currentStyles.cardBg }]}>
            <Text style={[styles.faqTitle, { color: currentStyles.textColor }]}>Preguntas Frecuentes</Text>
            <View style={[styles.faqItem, { backgroundColor: currentStyles.faqBg }]}>
              <Text style={[styles.faqQuestion, { color: currentStyles.textColor }]}>¿Cómo consigo más insignias?</Text>
              <Text style={[styles.faqAnswer, { color: currentStyles.subtextColor }]}>Completando hábitos y manteniendo rachas en el calendario.</Text>
            </View>
            <View style={[styles.faqItem, { backgroundColor: currentStyles.faqBg }]}>
              <Text style={[styles.faqQuestion, { color: currentStyles.textColor }]}>¿Puedo cambiar mi contraseña?</Text>
              <Text style={[styles.faqAnswer, { color: currentStyles.subtextColor }]}>Sí, desde el menú de Contraseña y Seguridad en tu Perfil.</Text>
            </View>
          </View>
        );
      case 'support':
        return (
          <View style={[styles.card, { backgroundColor: currentStyles.cardBg }]}>
            <Text style={[styles.text, { color: currentStyles.textColor }]}>¿En qué te podemos ayudar?</Text>
            <TextInput 
              style={[styles.input, { height: 120, textAlignVertical: 'top', marginTop: 15, backgroundColor: currentStyles.inputBg, borderColor: currentStyles.inputBorder, color: currentStyles.textColor }]} 
              placeholderTextColor={currentStyles.subtextColor}
              placeholder="Explícanos tu problema..." 
              multiline 
              value={supportMessage}
              onChangeText={setSupportMessage}
            />
            <TouchableOpacity style={[styles.primaryButton, { marginTop: 20 }]} onPress={() => {
              Alert.alert("Enviado", "Nuestro equipo ha recibido tu mensaje y te contactará pronto.");
              setSupportMessage('');
            }}>
              <Text style={styles.primaryButtonText}>Enviar Mensaje</Text>
            </TouchableOpacity>
          </View>
        );
      case 'terms':
        return (
          <View style={[styles.card, { backgroundColor: currentStyles.cardBg }]}>
            <Text style={[styles.text, { color: currentStyles.textColor }]}>1. Condiciones de Servicio</Text>
            <Text style={[styles.subtext, { color: currentStyles.subtextColor }]}>Al usar Moodify, aceptas que tu bienestar es lo más importante.</Text>
            <View style={{ height: 20 }} />
            <Text style={[styles.text, { color: currentStyles.textColor }]}>2. Privacidad</Text>
            <Text style={[styles.subtext, { color: currentStyles.subtextColor }]}>Tus datos de progreso y estado de ánimo se almacenan de forma segura.</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.card, { backgroundColor: currentStyles.cardBg }]}>
            <Text style={[styles.text, { color: currentStyles.textColor }]}>Esta sección no existe.</Text>
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={[styles.backButton, darkMode && { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
            <Feather name="arrow-left" size={24} color={currentStyles.titleColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentStyles.titleColor }]}>{title}</Text>
          <View style={{ width: 44 }} /> 
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {renderContent()}
        </ScrollView>
      </DashboardBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 32,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtext: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleDesc: {
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 16,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  }
});
