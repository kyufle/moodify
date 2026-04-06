import { createContext, ReactNode, useState } from "react";
import { router } from "expo-router";

const defaultValue = {
    isLoggedIn: true,
    user: {
        name: "user",
        email: "user@moodify.com",
        avatar: null
    },
    logout: () => {},
};

export const UserContext = createContext(defaultValue);

export default function UserProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
    };

    const userContextValue = {
        isLoggedIn,
        user: defaultValue.user,
        login, // Añadimos la función login
        logout
    };

    return (
        <UserContext.Provider value={userContextValue}>
            {children}
        </UserContext.Provider>
    );
}