import { useRouter, useSegments } from "expo-router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserThemeFromContext = (userValue: any) => ({
    bgName: userValue?.user?.bg_image,
    myMsgColor: userValue?.user?.my_msg_color,
    otherMsgColor: userValue?.user?.other_msg_color,
    textColorOther: userValue?.user?.text_colorOther,
    textColorOwn: userValue?.user?.text_colorOwn,
});

const defaultUserValue = {
    accessToken: null,
    user: null,
};

export const UserContext = createContext<any>(null);

const STORAGE_KEY = '@user_session';

export default function UserProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { i18n } = useTranslation();
    
    const [userValue, setUserValue] = useState(defaultUserValue);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
                if (jsonValue != null) {
                    const savedData = JSON.parse(jsonValue);
                    setUserValue(savedData);
                    router.replace('/dashboard');
                }
            } catch (e) {
                console.error("Failed to load session", e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadStorageData();
    }, []);

    useEffect(() => {
        const saveStorageData = async () => {
            if (isLoaded) {
                if (userValue.accessToken) {
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userValue));
                } else {
                    await AsyncStorage.removeItem(STORAGE_KEY);
                }
            }
        };
        saveStorageData();
    }, [userValue, isLoaded]);

    const logout = async () => {
        await AsyncStorage.removeItem(STORAGE_KEY);
        router.replace('/');
        setUserValue(defaultUserValue);
    };

    useEffect(() => {
        // @ts-ignore
        if (!userValue?.user?.language)
            return;
         // @ts-ignore
        i18n.changeLanguage(userValue.user.language)
    }, [userValue]);

    useEffect(() => {
        if (!userValue.accessToken) return;
        const checkNotifications = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}conversations`, {
                    headers: { 'Authorization': `Bearer ${userValue.accessToken}` }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    const total = data.reduce((acc, conv) => acc + (conv.unread_count || 0), 0);
                    setUnreadCount(total);
                }
            } catch (error) {
                console.error("Error checking notifications:", error);
            }
        };
        checkNotifications();
        const interval = setInterval(checkNotifications, 10000);
        return () => clearInterval(interval);
    }, [userValue.accessToken]);

    if (!isLoaded) return null;

    return <UserContext value={{
        setUserValue,
        logout,
        userValue,
        unreadCount
    }}>
        {children}
    </UserContext>
}