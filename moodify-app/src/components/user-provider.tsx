import { useRouter } from "expo-router";
import { createContext, ReactNode, useState } from "react";

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
    const [userValue, setUserValue] = useState(defaultUserValue);
    const logout = () => {
        router.replace('/');
        setUserValue(defaultUserValue);
    }
    return <UserContext value={{
        setUserValue,
        logout,
        userValue,
    }}>
        {children}
    </UserContext>
}