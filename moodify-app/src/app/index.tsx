import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  Dimensions,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CreateUser from '@/components/CreateUser';
import Login from '@/components/Login';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import FondoClaro from '@/assets/images/fondo_claro.svg';
import FondoFirstTime  from '@/assets/images/fondofirsttime.svg';

const { width, height } = Dimensions.get('window');


export default function HomeScreen() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  if (showWelcome) {
    return (
      <ThemedView style={styles.welcomeContainer}>
        <StatusBar style="dark" /> 
        <SafeAreaView style={styles.safeAreaFull}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeTextSection}>
              <ThemedText style={styles.welcomeTitle}>Moodify</ThemedText>
              <ThemedText style={styles.welcomeSlogan}>{t('firstPage.eslogan')}</ThemedText>
              <ThemedText style={styles.welcomeDesc}>{t('firstPage.text')}</ThemedText>
              
              <TouchableOpacity 
                style={styles.welcomeButton} 
                onPress={() => setShowWelcome(false)} 
                activeOpacity={0.8}
              >
                <ThemedText style={styles.welcomeButtonText}>{t('firstPage.button')}</ThemedText>
                <View style={styles.arrowIconContainer}>
                  {/* Corregido: En RNEUI se recomienda usar el componente de esta forma */}
                  <Icon 
                    name="arrow-right" 
                    type="material-community" 
                    color="#FFFFFF" 
                    size={24} 
                  />
                </View>
              </TouchableOpacity>
            </View>
            
            
            
            <View style={styles.illustrationContainer}>
              <FondoFirstTime style={styles.emotionsImage}   />
            </View>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.statusBarOverlay} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          bounces={false} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FondoClaro width={null} height={null} style={styles.backgroundImage}  />
          <View id="divasd" style={styles.headerContainer}>
            <SafeAreaView edges={['top']} style={styles.safeAreaInternal}>
              <View style={styles.floatingCard}>
                <ThemedText style={styles.holaText}>{t('panel.hello')}</ThemedText>
                <ThemedText style={styles.bienvenidoText}>{t('panel.welcome')}</ThemedText>
                
                <View style={styles.tabContainer}>
                  <TouchableOpacity 
                    style={[styles.tabButton, isLogin && styles.activeTab]}
                    onPress={() => setIsLogin(true)}
                  >
                    <ThemedText style={[styles.tabText, isLogin && styles.activeTabText]}>
                      {t('panel.enter')}
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.tabButton, !isLogin && styles.activeTab]}
                    onPress={() => setIsLogin(false)}
                  >
                    <ThemedText style={[styles.tabText, !isLogin && styles.activeTabText]}>
                      {t('panel.unite')}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </View>

          <View style={styles.formWrapper}>
            {isLogin ? (
              <Login onChangePage={() => setIsLogin(false)} />
            ) : (
              <CreateUser onChangePage={() => setIsLogin(true)} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safeAreaFull: { flex: 1, width: '100%', alignItems: 'center' },
  statusBarOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: Platform.OS === 'ios' ? 50 : 35, 
    backgroundColor: 'rgba(0, 0, 0, 0.05)', 
    zIndex: 100,
  },
  headerContainer: { 
    height: 380, 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  safeAreaInternal: { 
    width: '100%', 
    alignItems: 'center', 
    marginTop: Platform.OS === 'ios' ? 20 : 10 
  },
  backgroundImage: { ...StyleSheet.absoluteFill, opacity: 0.9 },
  welcomeContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  welcomeContent: { flex: 1, justifyContent: 'flex-start', paddingTop: 60 },
  welcomeTextSection: { width: '100%', paddingHorizontal: 40, zIndex: 10 },
  welcomeTitle: { fontSize: 52, fontWeight: '800', color: '#000000', marginBottom: 10 },
  welcomeSlogan: { fontSize: 22, fontWeight: '500', color: '#333333', marginBottom: 20 },
  welcomeDesc: { fontSize: 16, color: '#444444', lineHeight: 24, marginBottom: 35 },
  welcomeButton: { 
    backgroundColor: '#F5F5F5', 
    height: 64, 
    borderRadius: 32, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingLeft: 25, 
    paddingRight: 8, 
    width: '100%', 
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  welcomeButtonText: { fontSize: 17, fontWeight: '600', color: '#333333' },
  arrowIconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#000000', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  illustrationContainer: { 
    width: width, 
    height: height * 0.7, 
    position: 'absolute', 
    bottom: -50, 
    left: 0, 
    zIndex: 1 
  },
  emotionsImage: { 
    width: '150%', 
    height: '100%', 
    marginLeft: '-25%', 
    opacity: 0.9,
    flexShrink: 0,
  },
  scrollContent: { flexGrow: 1 },
  formWrapper: { 
    width: '100%', 
    paddingBottom: 40, 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    marginTop: -20 
  },
  floatingCard: { 
    backgroundColor: 'rgba(165, 173, 176, 0.5)',
    width: '85%', 
    maxWidth: 340, 
    borderRadius: 28, 
    padding: 24, 
    alignItems: 'center', 
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    elevation: 4
  },
  holaText: { fontSize: 26, fontWeight: '800', color: '#000000', marginBottom: 4 },
  bienvenidoText: { fontSize: 18, fontWeight: '400', color: '#333333', marginBottom: 20 },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(0, 0, 0, 0.05)', 
    borderRadius: 16, 
    padding: 4, 
    width: '100%' 
  },
  tabButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  activeTab: { backgroundColor: '#FFFFFF', elevation: 2 },
  tabText: { fontSize: 15, fontWeight: '600', color: '#666666' },
  activeTabText: { color: '#000000' },
});