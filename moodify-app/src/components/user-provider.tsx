import { useRouter } from "expo-router";
import { createContext, ReactNode, useState } from "react";

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