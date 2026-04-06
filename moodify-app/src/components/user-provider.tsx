import { createContext, ReactNode, useState } from "react";
import { router } from "expo-router";

const defaultValue = {
    isLoggedIn: true,
    user: {
        name: "Kyufle",
        email: "user@moodify.com",
        avatar: null
    },
    logout: () => {},
};

export const UserContext = createContext(defaultValue);

export default function UserProvider({ children }: { children: ReactNode }) {
    // Mantener siempre true para facilitar las pruebas de UI
    const [isLoggedIn] = useState(true);
    
    const logout = () => {
        // En modo prueba de frontend, solo mostramos un aviso
        import('react-native').then(({ Alert }) => {
            Alert.alert("Logout", "Has pulsado el botón de cerrar sesión (Mockup de prueba)");
        });
    };

    const userContextValue = {
        isLoggedIn,
        user: defaultValue.user,
        logout
    };

    return (
        <UserContext.Provider value={userContextValue}>
            {children}
        </UserContext.Provider>
    );
}