import {View, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, Alert, Platform, Dimensions } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useState } from 'react';
import { HelperText } from 'react-native-paper';
// IMGS portada/login/register
import fondoClaro from '@/assets/images/fondo_claro.svg';
import fondoFirstTime from '@/assets/images/fondofirsttime_114.3 x 203.2 mm.svg';

const { width, height } = Dimensions.get('window');

export default function CreateUser() {
    const [userData, setUserData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        password_confirmation:'',
      })

    const handleFetch = ()=>{
      if (userData.password === userData.password_confirmation){
        try {
            console.log(JSON.stringify(userData));
            const response = fetch('http://moodify_backend.test/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userData),
            });


            const data = response.json;
                console.log(data);
            } catch (error) {
                console.error("Error en la petición:", error);
        }
      }
        //mensaje de error visual diciendo que las contraseñas no son iguales.
    };
        
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  function showAlert(message) {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Moodify', message);
    }
  }

  // Pantalla portada
  return (
    <ThemedView style={styles.container}>
        <View style={styles.formSection}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.inputWrapper}>
              <View style={styles.styledInputContainer}>
                <View style={styles.iconGroup}>
                  <Icon name="at" type="material-community" color="#FF9A7B" size={28} />
                </View>
                <TextInput
                  value={userData.name}
                  onChangeText={(text) => setUserData({...userData, username: text})} //en el caso que no este cogido
                  style={styles.textInput}
                  placeholder={"Usuario"}
                  placeholderTextColor="#FFB7A1"
                />
                  {/* <Icon name="check-circle" type="material-community" color="#CFD8DC" size={28} style={{ marginRight: 15 }} /> */}
              </View>

              
                <View style={styles.styledInputContainer}>
                  <Icon name="account-outline" type="material-community" color="#FF9A7B" size={28} style={{ marginLeft: 15 }} />
                  <TextInput
                    value={userData.fullName}
                    onChangeText={(text) => setUserData({...userData, fullName: text})}
                    style={styles.textInput}
                    placeholder="Nombre completo"
                    placeholderTextColor="#FFB7A1"
                  />
                </View>
              

              <View style={styles.styledInputContainer}>
                  <Icon name="email-outline" type="material-community" color="#FF9A7B" size={28} style={{ marginLeft: 15 }} />
                  <TextInput
                    value={userData.email}
                    onChangeText={(text) => setUserData({...userData, email: text})}
                    style={styles.textInput}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#FFB7A1"
                  />
                  {/* <Icon name="check-circle" type="material-community" color="#CFD8DC" size={28} style={{ marginRight: 15 }} /> */}
                </View>

              <View style={styles.styledInputContainer}>
                <Icon name="lock-outline" type="material-community" color="#FF9A7B" size={26} style={{ marginLeft: 15 }} />
                <TextInput
                  value={userData.password}
                  onChangeText={(text) => setUserData({...userData, password: text})}
                  style={styles.textInput}
                  secureTextEntry={!isPasswordVisible}
                  placeholder="Contraseña"
                  placeholderTextColor="#FFB7A1"
                />
                <TouchableOpacity style={{ marginRight: 15 }} onPress={()=> setIsPasswordVisible(!isPasswordVisible)}>
                  <Icon name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} type="material-community" color="#FF9A7B" size={24} />
                </TouchableOpacity> 
              </View>
              <HelperText type="error" visible={userData.password !== userData.password_confirmation && userData.password_confirmation}>
                  Las contraseñas no coinciden
                </HelperText>

               <View style={styles.styledInputContainer}>
                <Icon name="lock-outline" type="material-community" color="#FF9A7B" size={26} style={{ marginLeft: 15 }} />
                <TextInput
                  value={userData.password_confirmation}
                  onChangeText={(text) => setUserData({...userData, password_confirmation: text})}
                  style={styles.textInput}
                  secureTextEntry={!isConfirmVisible}
                  placeholder="Repite la contraseña"
                  placeholderTextColor="#FFB7A1"
                />
                <TouchableOpacity style={{ marginRight: 15 }} onPress={()=> setIsConfirmVisible(!isConfirmVisible)}>
                  <Icon name={isConfirmVisible ? "eye-outline" : "eye-off-outline"} type="material-community" color="#FF9A7B" size={24} />
                </TouchableOpacity>
              </View>
              <HelperText type="error" visible={userData.password !== userData.password_confirmation && userData.password_confirmation}>
                  Las contraseñas no coinciden
                </HelperText>
            </View>
             <Button
              title={"Únete"}
              buttonStyle={styles.mainButton}
              titleStyle={styles.mainButtonText}
              onPress={handleFetch}
              containerStyle={styles.mainButtonContainer}
            />
            <View style={styles.footerContainer}>
              <ThemedText style={styles.footerText}>
                ¿Ya nos conocemos?
                <ThemedText style={styles.linkText} onPress={() => setIsLogin(!isLogin)}>
                  Únete
                </ThemedText>
              </ThemedText>
            </View>
          </KeyboardAvoidingView>
        </View>
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
    backgroundColor: '#a5adb0', 
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