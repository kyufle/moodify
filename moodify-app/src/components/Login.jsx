import { 
    View, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView,
    Dimensions 
} from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useContext, useState, useRef } from 'react';
import { UserContext } from './user-provider';
import { STATUS_COLORS_CLARO } from '@/constants/status-colors-claro';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Fonts } from '@/constants/theme';

export default function Login({ onChangePage }) {
    const { t } = useTranslation();
    const router = useRouter();
    const [userData, setUserData] = useState({ emailUsername: '', password: '' });
    const { setUserValue } = useContext(UserContext);
    const [notification, setNotification] = useState({ message: null, type: null });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleFetch = async () => {
        setNotification({ message: null, type: null });
        if (userData.password && userData.emailUsername) {
            try {
                const response = await fetch(process.env.EXPO_PUBLIC_API_URL + 'login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(userData),
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    setUserValue({ accessToken: data.access_token, user: data.user });
                    setNotification({ message: 'message.correctLogin', type: "success" });
                    setTimeout(() => router.replace('/dashboard'), 2000);
                } else {
                    setNotification({ message: data.message, type: "error" });
                }
            } catch (error) {
                setNotification({ message: "Error de conexión", type: "error" });
            }
        } else {
            setNotification({ message: 'message.fieldRequiredMessageFull', type: "error" });
        }
    };

    const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <Wrapper behavior="padding" style={{ flex: 1 }} keyboardVerticalOffset={64}>
                    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={true}>
                        <View style={styles.formSection}>
                            {notification.message && (
                                <View style={[styles.notifContainer, { 
                                    backgroundColor: STATUS_COLORS_CLARO[notification.type]?.bg, 
                                    borderColor: STATUS_COLORS_CLARO[notification.type]?.border 
                                }]}>
                                    <Icon name={STATUS_COLORS_CLARO[notification.type]?.icon} type="material-community" color={STATUS_COLORS_CLARO[notification.type]?.color} size={22} />
                                    <ThemedText style={[styles.notifText, { color: STATUS_COLORS_CLARO[notification.type]?.color }]}>
                                        {t(notification.message)}
                                    </ThemedText>
                                </View>
                            )}
                            <View style={styles.inputWrapper}>
                                <TouchableOpacity activeOpacity={1} onPress={() => emailRef.current?.focus()} style={styles.styledInputContainer}>
                                    <View style={styles.iconGroup} pointerEvents="none">
                                        <Icon name="at" type="material-community" color="#FF9A7B" size={28} />
                                        <ThemedText style={styles.iconSeparator}>/</ThemedText>
                                        <Icon name="email-outline" type="material-community" color="#FF9A7B" size={26} />
                                    </View>
                                    <TextInput
                                        ref={emailRef}
                                        value={userData.emailUsername}
                                        onChangeText={(text) => setUserData({ ...userData, emailUsername: text.toLowerCase() })}
                                        style={styles.textInput}
                                        placeholder={t('loginRegister.userOrEmail')}
                                        placeholderTextColor="#FFB7A1"
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        onSubmitEditing={() => passwordRef.current?.focus()}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} onPress={() => passwordRef.current?.focus()} style={styles.styledInputContainer}>
                                    <View style={{ marginLeft: 20 }} pointerEvents="none">
                                        <Icon name="lock-outline" type="material-community" color="#FF9A7B" size={26} />
                                    </View>
                                    <TextInput
                                        ref={passwordRef}
                                        value={userData.password}
                                        onChangeText={(text) => setUserData({ ...userData, password: text })}
                                        style={styles.textInput}
                                        secureTextEntry={!isPasswordVisible}
                                        placeholder={t('loginRegister.password')}
                                        placeholderTextColor="#FFB7A1"
                                        returnKeyType="done"
                                        onSubmitEditing={handleFetch}
                                    />
                                    <TouchableOpacity style={{ marginRight: 20 }} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        <Icon name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} type="material-community" color="#FF9A7B" size={24} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </View>
                            <Button title={t('loginRegister.login')} buttonStyle={styles.mainButton} titleStyle={styles.mainButtonText} onPress={handleFetch} containerStyle={styles.mainButtonContainer} />
                            <View style={styles.footerContainer}>
                                <ThemedText style={styles.footerText}>
                                    {t('loginRegister.dontHaveAccount')}{' '}
                                    <ThemedText style={styles.linkText} onPress={onChangePage}>{t('loginRegister.join')}</ThemedText>
                                </ThemedText>
                            </View>
                            <View style={{ height: 40 }} />
                        </View>
                    </ScrollView>
                </Wrapper>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    scrollContainer: { flexGrow: 1, justifyContent: 'center' },
    formSection: { paddingHorizontal: 30, paddingVertical: 20, alignItems: 'center', width: '100%' },
    notifContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 18, width: '100%', marginBottom: 20, borderWidth: 1 },
    notifText: { fontWeight: '700', marginLeft: 10, fontSize: 14, flex: 1 },
    inputWrapper: { width: '100%', gap: 12, marginBottom: 20 },
    styledInputContainer: { backgroundColor: '#FFE5D9', height: 65, borderRadius: 20, flexDirection: 'row', alignItems: 'center', width: '100%' },
    iconGroup: { flexDirection: 'row', alignItems: 'center', marginLeft: 20, gap: 4 },
    iconSeparator: { fontSize: 18, color: '#FF9A7B', fontWeight: '300' },
    textInput: { flex: 1, paddingHorizontal: 15, fontSize: 16, color: '#333', fontWeight: '500', fontFamily: Fonts.sans },
    mainButtonContainer: { width: '100%', marginTop: 15 },
    mainButton: { backgroundColor: '#a5adb0', height: 60, borderRadius: 20 },
    mainButtonText: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
    footerContainer: { marginTop: 25, alignItems: 'center' },
    footerText: { fontSize: 15, color: '#333' },
    linkText: { color: '#95A5A6', fontWeight: '700', textDecorationLine: 'underline' }
});