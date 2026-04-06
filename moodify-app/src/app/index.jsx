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

// IMGS portada/login/register
import fondoClaro from '@/assets/images/fondo_claro.svg';
import fondoFirstTime from '@/assets/images/fondofirsttime_114.3 x 203.2 mm.svg';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true); //en el caso que no tenga token

  function showAlert(message) {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Moodify', message);
    }
  }

  // Pantalla portada
  if (showWelcome) {
    return (
      <ThemedView style={styles.welcomeContainer}>
        <SafeAreaView style={{ flex: 1, width: '100%', alignItems: 'center' }}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeTextSection}>
              <ThemedText style={styles.welcomeTitle}>Moodify</ThemedText>
              <ThemedText style={styles.welcomeSlogan}>{t('firstPage.eslogan')}</ThemedText>
              <ThemedText style={styles.welcomeDesc}>{t('firstPage.text')}</ThemedText>

              {/* Botón con flecha */}
              <TouchableOpacity 
                style={styles.welcomeButton} 
                onPress={() => setShowWelcome(false)}
                activeOpacity={0.8}
              >
                <ThemedText style={styles.welcomeButtonText}>{t('firstPage.button')}</ThemedText>
                <View style={styles.arrowIconContainer}>
                   <Icon name="arrow-right" type="material-community" color="#FFFFFF" size={24} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Illustration de portada */}
            <View style={styles.illustrationContainer}>
              <Image 
                source={fondoFirstTime} 
                style={styles.emotionsImage} 
                contentFit="contain" 
              />
            </View>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // Pantalla login/register
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        {/* Banner superior con patrón */}
        <View style={styles.headerContainer}>
          <Image source={fondoClaro} style={styles.backgroundImage} contentFit="cover" />
          
          {/* Tarjeta gris flotante */}
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
        </View>
        {isLogin && <Login onChangePage={()=>setIsLogin(false)}/>}
        {!isLogin && <CreateUser onChangePage={()=>setIsLogin(true)}/>}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // Estilos pantalla bienvenida
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 80,
  },
  welcomeTextSection: {
    width: '100%',
    paddingHorizontal: 40,
    zIndex: 10,
  },
  welcomeTitle: {
    fontSize: 56,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 10,
    lineHeight: 64,
  },
  welcomeSlogan: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 24,
  },
  welcomeDesc: {
    fontSize: 18,
    color: '#333333',
    lineHeight: 26,
    marginBottom: 40,
    fontWeight: '400',
  },
  welcomeButton: {
    backgroundColor: '#EEEEEE',
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 10,
    width: '100%',
    maxWidth: 320,
    alignSelf: 'flex-start',
  },
  welcomeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  arrowIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Illustration de portada
  illustrationContainer: {
    width: width,
    height: height * 0.85,
    position: 'absolute',
    bottom: -100,
    left: 0,
    overflow: 'hidden',
    zIndex: 1,
  },

  emotionsImage: {
    width: '200%', 
    height: '100%',
    marginLeft: '-50%',
    transform: [{ scale: 1.4 }],
  },

  // Estilos formulario login/register
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    height: 320,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  floatingCard: {
    backgroundColor: 'rgba(189, 195, 199, 0.8)',
    width: '85%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  holaText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bienvenidoText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(127, 140, 141, 0.5)',
    borderRadius: 12,
    padding: 4,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeTabText: {
    color: '#95A5A6',
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: -30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  keyboardView: {
    flex: 1,
    alignItems: 'center',
  },
  inputWrapper: {
    width: '100%',
    gap: 20,
    marginBottom: 40,
  },
  styledInputContainer: {
    backgroundColor: '#FFE5D9', 
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    gap: 4,
  },
  iconSeparator: {
    fontSize: 20,
    color: '#FF9A7B',
    fontWeight: '300',
    marginHorizontal: 2,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  mainButtonContainer: {
    width: '100%',
    marginTop: 10,
  },
  mainButton: {
    backgroundColor: '#CFD3D6', 
    height: 60,
    borderRadius: 20,
  },
  mainButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footerContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#333',
  },
  linkText: {
    color: '#95A5A6',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});