import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HelperText } from 'react-native-paper';
import { STATUS_COLORS_CLARO } from '@/constants/status-colors-claro';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateUser({ onChangePage }) {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [notification, setNotification] = useState({ message: null, type: null });
  const [errorForRepeatPassword, setErrorForRepeatPassword] = useState(false);
  
  const [userData, setUserData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password);
  };

  const handleFetch = async () => {
    setNotification({ message: null, type: null });
    setErrorForRepeatPassword(false);

    const localErrors = {
      username: !userData.username ? 'message.fieldRequired' : '',
      fullName: !userData.fullName ? 'message.fieldRequired' : '',
      email: !userData.email ? 'message.fieldRequired' : '',
      password: !userData.password ? 'message.fieldRequired' : '',
      password_confirmation: !userData.password_confirmation ? 'message.fieldRequired' : '',
    };

    const hasEmptyFields = Object.values(localErrors).some(err => err === 'message.fieldRequired');

    if (userData.password && !validatePassword(userData.password)) {
      localErrors.password = 'message.register.passwordDontWork';
      localErrors.password_confirmation = 'message.register.passwordDontWork';
    }

    setError(localErrors);

    const passwordsDontMatch = userData.password !== userData.password_confirmation;
    const hasValidationErrors = localErrors.password === 'message.register.passwordDontWork';

    if (hasEmptyFields) {
      setNotification({ message: 'message.fieldRequiredMessageFull', type: "error" });
      return;
    }

    if (passwordsDontMatch || hasValidationErrors) {
      if (passwordsDontMatch && userData.password_confirmation) {
        setErrorForRepeatPassword(true);
      }
      setNotification({ message: 'message.fieldError', type: "error" });
      return; 
    }

    try {
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL + 'register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNotification({ message: 'message.correctRegister', type: "success" });
      } else if (data.errors) {
        setError({
          username: data.errors.username ? data.errors.username[0] : '',
          fullName: data.errors.fullName ? data.errors.fullName[0] : '',
          email: data.errors.email ? data.errors.email[0] : '',
          password: data.errors.password ? 'message.register.passwordDontWork' : '',
          password_confirmation: data.errors.password ? 'message.register.passwordDontWork' : '',
        });
        setNotification({ message: 'message.fieldError', type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Error de conexión", type: "error" });
    }
  };

  const passwordsMatchError = userData.password !== userData.password_confirmation && userData.password_confirmation !== "";

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.formSection}>
            
            {/* COMPONENTE DE NOTIFICACIÓN MEJORADO */}
            {notification.message && (
              <View style={[
                styles.notifContainer, 
                { 
                  backgroundColor: STATUS_COLORS_CLARO[notification.type]?.bg || '#f0f0f0', 
                  borderColor: STATUS_COLORS_CLARO[notification.type]?.border || '#ccc' 
                }
              ]}>
                <Icon 
                  name={STATUS_COLORS_CLARO[notification.type]?.icon || 'information'} 
                  type="material-community" 
                  color={STATUS_COLORS_CLARO[notification.type]?.color || '#333'} 
                  size={22} 
                />
                <ThemedText style={[styles.notifText, { color: STATUS_COLORS_CLARO[notification.type]?.color || '#333' }]}>
                  {t(notification.message)}
                </ThemedText>
              </View>
            )}

            <View style={styles.inputWrapper}>
              <View style={styles.styledInputContainer}>
                <Icon name="at" type="material-community" color="#FF9A7B" size={28} style={{ marginLeft: 15 }} />
                <TextInput value={userData.username} onChangeText={(text) => setUserData({ ...userData, username: text })} style={styles.textInput} placeholder={t('loginRegister.user')} placeholderTextColor="#FFB7A1" />
              </View>
              {!!error.username && (
                <HelperText type="error" visible>
                    {error.username.toLowerCase().includes('taken') || error.username.toLowerCase().includes('already') 
                    ? t('message.register.accountAlreadyExistUsername') 
                    : t(error.username)}
                </HelperText>
              )}

              <View style={styles.styledInputContainer}>
                <Icon name="account-outline" type="material-community" color="#FF9A7B" size={28} style={{ marginLeft: 15 }} />
                <TextInput value={userData.fullName} onChangeText={(text) => setUserData({ ...userData, fullName: text })} style={styles.textInput} placeholder={t('loginRegister.completeName')} placeholderTextColor="#FFB7A1" />
              </View>
              {!!error.fullName && <HelperText type="error" visible>{t(error.fullName)}</HelperText>}

              <View style={styles.styledInputContainer}>
                <Icon name="email-outline" type="material-community" color="#FF9A7B" size={28} style={{ marginLeft: 15 }} />
                <TextInput value={userData.email} onChangeText={(text) => setUserData({ ...userData, email: text })} style={styles.textInput} placeholder={t('loginRegister.email')} placeholderTextColor="#FFB7A1" keyboardType="email-address" />
              </View>
              {!!error.email && (
                <HelperText type="error" visible>
                  {error.email.toLowerCase().includes('taken') || error.email.toLowerCase().includes('already') 
                    ? t('message.register.accountAlreadyExistEmail') 
                    : error.email === 'message.fieldRequired' ? t('message.fieldRequired') : t('message.register.emailFormatInvalid')}
                </HelperText>
              )}

              <View style={styles.styledInputContainer}>
                <Icon name="lock-outline" type="material-community" color="#FF9A7B" size={26} style={{ marginLeft: 15 }} />
                <TextInput value={userData.password} onChangeText={(text) => setUserData({ ...userData, password: text })} style={styles.textInput} secureTextEntry={!isPasswordVisible} placeholder={t('loginRegister.password')} placeholderTextColor="#FFB7A1" />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={{ marginRight: 15 }}><Icon name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} type="material-community" color="#FF9A7B" size={24} /></TouchableOpacity>
              </View>
              {!!error.password && <HelperText type="error" visible>{t(error.password)}</HelperText>}

              <View style={styles.styledInputContainer}>
                <Icon name="lock-check-outline" type="material-community" color="#FF9A7B" size={26} style={{ marginLeft: 15 }} />
                <TextInput value={userData.password_confirmation} onChangeText={(text) => setUserData({ ...userData, password_confirmation: text })} style={styles.textInput} secureTextEntry={!isConfirmVisible} placeholder={t('loginRegister.repeatPassword')} placeholderTextColor="#FFB7A1" />
                <TouchableOpacity onPress={() => setIsConfirmVisible(!isConfirmVisible)} style={{ marginRight: 15 }}><Icon name={isConfirmVisible ? "eye-outline" : "eye-off-outline"} type="material-community" color="#FF9A7B" size={24} /></TouchableOpacity>
              </View>
              {!!error.password_confirmation ? (
                <HelperText type="error" visible>{t(error.password_confirmation)}</HelperText>
              ) : (passwordsMatchError || errorForRepeatPassword) ? (
                <HelperText type="error" visible>{t('loginRegister.passwordsDontMatch')}</HelperText>
              ) : null}
            </View>

            <Button title={t('loginRegister.join')} buttonStyle={styles.mainButton} titleStyle={styles.mainButtonText} onPress={handleFetch} containerStyle={styles.mainButtonContainer} />

            <View style={styles.footerContainer}>
              <TouchableOpacity onPress={onChangePage}>
                <ThemedText style={styles.footerText}>
                  <ThemedText>{t('loginRegister.weAlreadyKnowEachOther') + " "} </ThemedText>
                  <ThemedText style={styles.linkText}>{t('loginRegister.login')}</ThemedText>
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardView: { flex: 1 },
  formSection: { flex: 1, paddingHorizontal: 30, paddingTop: 20, alignItems: 'center' },
  inputWrapper: { width: '100%', marginBottom: 10 },
  styledInputContainer: { backgroundColor: '#FFE5D9', height: 55, borderRadius: 20, flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 10 },
  textInput: { flex: 1, paddingHorizontal: 15, fontSize: 16, color: '#333', fontWeight: '500' },
  mainButtonContainer: { width: '100%', marginTop: 20 },
  mainButton: { backgroundColor: '#a5adb0', height: 55, borderRadius: 20 },
  mainButtonText: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  footerContainer: { marginTop: 20, paddingBottom: 20 },
  footerText: { fontSize: 15, color: '#333' },
  linkText: { color: '#95A5A6', fontWeight: '700', textDecorationLine: 'underline' },
  notifContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 18, 
    width: '100%', 
    marginBottom: 15, 
    borderWidth: 1,
    minHeight: 50 
  },
  notifText: { fontWeight: '700', marginLeft: 10, fontSize: 13, flex: 1 }
});