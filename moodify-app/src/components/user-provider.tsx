import { useRouter } from "expo-router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

export default function UserProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { i18n } = useTranslation();
    const [unreadCount, setUnreadCount] = useState(0);
    const [userValue, setUserValue] = useState(defaultUserValue);
    const logout = () => {
        router.replace('/');
        setUserValue(defaultUserValue);
    }

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
                    // Sumamos todos los unread_count de las conversaciones
                    const total = data.reduce((acc, conv) => acc + (conv.unread_count || 0), 0);
                    setUnreadCount(total);
                }
            } catch (error) {
                console.error("Error checking notifications:", error);
            }
        };

        checkNotifications();
        const interval = setInterval(checkNotifications, 10000); // Cada 10 segundos
        return () => clearInterval(interval);
    }, [userValue.accessToken]);
    return <UserContext value={{
        setUserValue,
        logout,
        userValue,
        unreadCount
    }}>
        {children}
    </UserContext>
}