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

    // Pantalla portada
    return (
        <ThemedView style={styles.container}>
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
                                placeholder={"Usuario o email"}
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
                                placeholder="Contraseña"
                                placeholderTextColor="#FFB7A1"
                            />
                            <TouchableOpacity style={{ marginRight: 15 }} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Icon name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} type="material-community" color="#FF9A7B" size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Button
                        title={"Iniciar sesión"}
                        buttonStyle={styles.mainButton}
                        titleStyle={styles.mainButtonText}
                        onPress={handleFetch}
                        containerStyle={styles.mainButtonContainer}
                    />
                    <View style={styles.footerContainer}>
                        <ThemedText style={styles.footerText}>
                            ¿No tienes cuenta?{' '}
                            <ThemedText style={styles.linkText} onPress={() => onChangePage()}>
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
    notifContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 18,
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        // Sombras suaves para que resalte
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    notifText: {
        fontWeight: '700',
        marginLeft: 10,
        fontSize: 14,
        flex: 1,
    },
});
