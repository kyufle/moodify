import { View, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, Alert, Platform, Dimensions } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useContext, useState } from 'react';
import { UserContext } from './user-provider';
import { STATUS_COLORS_CLARO } from '@/constants/status-colors-claro';
import { useTranslation } from 'react-i18next';
const { width, height } = Dimensions.get('window');


export default function Login({ onChangePage }) {
    const { t } = useTranslation();
    const [userData, setUserData] = useState({
        emailUsername: '',
        password: '',
    })

    const { userValue, setUserValue } = useContext(UserContext);
    const [notification, setNotification] = useState({ message: null, type: null });

    const handleFetch = async () => {
        setNotification(null);
        if (userData.password && userData.emailUsername) {
            try {
                const response = await fetch('http://moodify_backend.test/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
                const data = await response.json();
                if (data.success) {
                    setUserValue({
                        accessToken: data.access_token,
                        user: data.user
                    });
                    setNotification({message: t('message.correctLogin'), type:"success"});
                } else {
                    setNotification({message: data.message, type:"error"});
                }
            } catch (error) {
                console.error("Error en la petición:", error);
            }
        } else {
            setNotification({ message: t('message.fieldRequiredMessageFull'), type: "error" });
        }

    };

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    function showAlert(message) {
        if (Platform.OS === 'web') {
            window.alert(message);
        } else {
            Alert.alert('Moodify', message);
        }
    }
    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.formSection}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                {notification && notification.message && (
                        <View style={[
                            styles.notifContainer,
                            { 
                            backgroundColor: STATUS_COLORS_CLARO[notification.type].bg, 
                            borderColor: STATUS_COLORS_CLARO[notification.type].border 
                            }
                        ]}>
                            <Icon
                                name={STATUS_COLORS_CLARO[notification.type].icon}
                                type="material-community"
                                color={STATUS_COLORS_CLARO[notification.type].color}
                                size={22}
                            />
                            <ThemedText style={[styles.notifText, { color: STATUS_COLORS_CLARO[notification.type].color }]}>
                                {notification.message}
                            </ThemedText>
                        </View>
                    )}
                    <View style={styles.inputWrapper}>
                        <View style={styles.styledInputContainer}>
                            <View style={styles.iconGroup}>
                                <Icon name="at" type="material-community" color="#FF9A7B" size={28} />
                                <>
                                    <ThemedText style={styles.iconSeparator}>/</ThemedText>
                                    <Icon name="email-outline" type="material-community" color="#FF9A7B" size={26} />
                                </>
                            </View>
                            <TextInput
                                value={userData.emailUsername}
                                onChangeText={(text) => setUserData({ ...userData, emailUsername: text })}
                                style={styles.textInput}
                                placeholder={t('loginRegister.userOrEmail')}
                                placeholderTextColor="#FFB7A1"
                            />
                        </View>
                        <View style={styles.styledInputContainer}>
                            <Icon name="lock-outline" type="material-community" color="#FF9A7B" size={26} style={{ marginLeft: 15 }} />
                            <TextInput
                                value={userData.password}
                                onChangeText={(text) => setUserData({ ...userData, password: text })}
                                style={styles.textInput}
                                secureTextEntry={!isPasswordVisible}
                                placeholder={t('loginRegister.password')}
                                placeholderTextColor="#FFB7A1"
                            />
                            <TouchableOpacity style={{ marginRight: 15 }} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Icon name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} type="material-community" color="#FF9A7B" size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Button
                        title={t('loginRegister.login')}
                        buttonStyle={styles.mainButton}
                        titleStyle={styles.mainButtonText}
                        onPress={handleFetch}
                        containerStyle={styles.mainButtonContainer}
                    />
                    <View style={styles.footerContainer}>
                        <ThemedText style={styles.footerText}>
                            {t('loginRegister.dontHaveAccount')+' '}
                            <ThemedText style={styles.linkText} onPress={() => onChangePage()}>
                                {t('loginRegister.join')}
                            </ThemedText>
                        </ThemedText>
                    </View>
                </KeyboardAvoidingView>
            </View>
            </SafeAreaView>
        </ThemedView>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingTop: 25,
    alignItems: 'center',
  },

  // --- NOTIFICACIONES (Success/Error) ---
  notifContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 18,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    // Sombra sutil para elevación
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  notifText: {
    fontWeight: '700',
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },

  // --- INPUTS Y FORMULARIO ---
  inputWrapper: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  styledInputContainer: {
    backgroundColor: '#FFE5D9', 
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 5,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    gap: 4,
  },
  iconSeparator: {
    fontSize: 18,
    color: '#FF9A7B',
    fontWeight: '300',
    marginHorizontal: 2,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  mainButtonContainer: {
    width: '100%',
    marginTop: 15,
  },
  mainButton: {
    backgroundColor: '#a5adb0',
    height: 60,
    borderRadius: 20,
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // --- FOOTER (Enlaces de navegación) ---
  footerContainer: {
    marginTop: 25,
    paddingBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },
  linkText: {
    color: '#95A5A6',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  helperText: {
    paddingHorizontal: 10,
    marginTop: -5,
  }
});
