import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { UserContext } from '@/components/user-provider';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const { isLoggedIn, login } = useContext(UserContext);
  const [username, setUsername] = useState('ruth');
  const [fullName, setFullName] = useState('Ruth Romero Carretero');
  const [email, setEmail] = useState('ruthromerocarretero@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'signup'

  if (isLoggedIn) {
    return <Redirect href="/dashboard" />;
  }

  return (
    <View style={styles.container}>
      <DashboardBackground>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Superior - Saludo y Toggle */}
            <View style={styles.topSection}>
              <View style={styles.glassCard}>
                <Text style={styles.greeting}>¡Hola!</Text>
                <Text style={styles.welcome}>Bienvenid@</Text>
                
                <View style={styles.toggleContainer}>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, mode === 'login' && styles.toggleBtnActive]}
                    onPress={() => setMode('login')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>Entra</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, mode === 'signup' && styles.toggleBtnActive]}
                    onPress={() => setMode('signup')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>Únete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Formulario Inferior */}
            <View style={[styles.formSection, mode === 'signup' && { paddingTop: 30 }]}>
              {/* Username Input (Always visible) */}
              <View style={styles.inputContainer}>
                <View style={[styles.iconGroup, mode === 'login' && { marginRight: 0 }]}>
                  <Text style={styles.atIcon}>@</Text>
                  {mode === 'signup' && <View style={styles.iconDivider} />}
                </View>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Email o usuario"
                  placeholderTextColor="#FCA5A5"
                />
                {mode === 'signup' && (
                  <Feather name="check-circle" size={24} color="#D1D5DB" style={styles.rightIcon} />
                )}
              </View>

              {/* Full Name Input (Signup only) */}
              {mode === 'signup' && (
                <View style={styles.inputContainer}>
                  <View style={styles.iconGroup}>
                    <Feather name="user" size={24} color="#FCA5A5" />
                  </View>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Nombre completo"
                    placeholderTextColor="#FCA5A5"
                  />
                </View>
              )}

              {/* Email Input (Signup only) */}
              {mode === 'signup' && (
                <View style={styles.inputContainer}>
                  <View style={styles.iconGroup}>
                    <Feather name="mail" size={24} color="#FCA5A5" />
                  </View>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#FCA5A5"
                  />
                  <Feather name="check-circle" size={24} color="#D1D5DB" style={styles.rightIcon} />
                </View>
              )}

              {/* Password Input (Always visible) */}
              <View style={styles.inputContainer}>
                <View style={styles.iconGroup}>
                  <Feather name="lock" size={24} color="#FCA5A5" />
                </View>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Contraseña"
                  placeholderTextColor="#FCA5A5"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="#FCA5A5" style={styles.rightIcon} />
                </TouchableOpacity>
              </View>

              {/* Botón Acceder */}
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={login}
                activeOpacity={0.9}
              >
                <Text style={styles.loginButtonText}>{mode === 'login' ? 'Entra' : 'Únete'}</Text>
              </TouchableOpacity>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {mode === 'login' ? '¿Eres nuevo por aquí? ' : '¿Ya nos conocemos? '}
                </Text>
                <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                  <Text style={styles.footerLink}>
                    {mode === 'login' ? 'Únete' : 'Inicia sesión'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </DashboardBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSection: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  glassCard: {
    width: '85%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Más oscuro para que el texto blanco resalte
    borderRadius: 30,
    padding: 2.5, // Reducir el padding para que el toggle encaje mejor (padding real en el toggleContainer)
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800', // Más grueso
    color: '#FFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Sombra para legibilidad
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.15)', // Un poco más claro para mejor visibilidad
    borderRadius: 20,
    padding: 4,
    width: '100%',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 18,
  },
  toggleBtnActive: {
    backgroundColor: '#FFF', // Fondo blanco para el activo
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF', // Texto blanco por defecto (inactivo)
  },
  toggleTextActive: {
    color: '#94A3B8', // Texto gris para el botón activo (sobre fondo blanco)
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    paddingHorizontal: 25,
    alignItems: 'center',
    minHeight: height * 0.65,
  },
  inputContainer: {
    width: '100%',
    height: 60,
    backgroundColor: '#FFEFED',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 15,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 10,
  },
  atIcon: {
    fontSize: 22,
    color: '#FCA5A5',
    fontWeight: '700',
  },
  iconDivider: {
    width: 2,
    height: 20,
    backgroundColor: '#FCA5A5',
    opacity: 0.3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
  },
  rightIcon: {
    marginLeft: 10,
  },
  loginButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#D1D5DB', 
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  footerLink: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '800',
    textDecorationLine: 'underline',
  }
});