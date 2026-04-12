// --- HomeScreen.jsx ---

import { View, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, Alert, Platform, Dimensions } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import CreateUser from '@/components/CreateUser';
import Login from '@/components/Login';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';

// IMGS portada/login/register
import fondoClaro from '@/assets/images/fondo_claro.svg';
import fondoFirstTime from '@/assets/images/fondofirsttime_114.3 x 203.2 mm.svg';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  // TODO Si el usuario no se ha logueado, redirigir a Index

  if (showWelcome) {
    return (
      <ThemedView style={styles.welcomeContainer}>
        <StatusBar style="dark" /> 
        <SafeAreaView style={{ flex: 1, width: '100%', alignItems: 'center' }}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeTextSection}>
              <ThemedText style={styles.welcomeTitle}>Moodify</ThemedText>
              <ThemedText style={styles.welcomeSlogan}>{t('firstPage.eslogan')}</ThemedText>
              <ThemedText style={styles.welcomeDesc}>{t('firstPage.text')}</ThemedText>
              <TouchableOpacity style={styles.welcomeButton} onPress={() => setShowWelcome(false)} activeOpacity={0.8}>
                <ThemedText style={styles.welcomeButtonText}>{t('firstPage.button')}</ThemedText>
                <View style={styles.arrowIconContainer}><Icon name="arrow-right" type="material-community" color="#FFFFFF" size={24} /></View>
              </TouchableOpacity>
            </View>
            <View style={styles.illustrationContainer}><Image source={fondoFirstTime} style={styles.emotionsImage} contentFit="contain" /></View>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.statusBarOverlay} />

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Image source={fondoClaro} style={styles.backgroundImage} contentFit="cover" />
          
          <SafeAreaView edges={['top']} style={styles.safeAreaInternal}>
            <View style={styles.floatingCard}>
              <ThemedText style={styles.holaText}>{t('panel.hello')}</ThemedText>
              <ThemedText style={styles.bienvenidoText}>{t('panel.welcome')}</ThemedText>
              
              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[styles.tabButton, isLogin && styles.activeTab]}
                  onPress={() => setIsLogin(true)}
                >
                  <ThemedText style={[styles.tabText, isLogin && styles.activeTabText]}>{t('panel.enter')}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tabButton, !isLogin && styles.activeTab]}
                  onPress={() => setIsLogin(false)}
                >
                  <ThemedText style={[styles.tabText, !isLogin && styles.activeTabText]}>{t('panel.unite')}</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {isLogin && <Login onChangePage={() => setIsLogin(false)} />}
        {!isLogin && <CreateUser onChangePage={() => setIsLogin(true)} />}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  statusBarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 50 : 35, 
    backgroundColor: 'rgba(0, 0, 0, 0.20)', 
    zIndex: 100,
  },

  headerContainer: {
    height: 350,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },

  safeAreaInternal: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : 10, 
  },

  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },

  welcomeContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  welcomeContent: { flex: 1, justifyContent: 'flex-start', paddingTop: 80 },
  welcomeTextSection: { width: '100%', paddingHorizontal: 40, zIndex: 10 },
  welcomeTitle: { fontSize: 56, fontWeight: '800', color: '#000000', marginBottom: 10, lineHeight: 64 },
  welcomeSlogan: { fontSize: 24, fontWeight: '500', color: '#333333', marginBottom: 24 },
  welcomeDesc: { fontSize: 18, color: '#333333', lineHeight: 26, marginBottom: 40, fontWeight: '400' },
  welcomeButton: { backgroundColor: '#EEEEEE', height: 70, borderRadius: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 30, paddingRight: 10, width: '100%', maxWidth: 320, alignSelf: 'flex-start' },
  welcomeButtonText: { fontSize: 18, fontWeight: '600', color: '#333333' },
  arrowIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' },
  illustrationContainer: { width: width, height: height * 0.85, position: 'absolute', bottom: -100, left: 0, overflow: 'hidden', zIndex: 1 },
  emotionsImage: { width: '200%', height: '100%', marginLeft: '-50%', transform: [{ scale: 1.4 }] },
  scrollContent: { flexGrow: 1 },
  floatingCard: { backgroundColor: 'rgba(189, 195, 199, 0.8)', width: '85%', maxWidth: 340, borderRadius: 24, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 15, elevation: 8 },
  holaText: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  bienvenidoText: { fontSize: 22, fontWeight: '500', color: '#FFFFFF', marginBottom: 20 },
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(127, 140, 141, 0.5)', borderRadius: 12, padding: 4, width: '100%' },
  tabButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  activeTab: { backgroundColor: '#FFFFFF' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  activeTabText: { color: '#95A5A6' },
});