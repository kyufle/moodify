import { createContext, ReactNode, useState } from "react";

const defaultValue = {
    isLoggedIn: false,
};

export const UserContext = createContext(defaultValue);

export default function UserProvider({ children }: { children: ReactNode }) {
    const [userContextValue, setUserContextValue] = useState(defaultValue);
    return <UserContext value={userContextValue}>
        {children}
    </UserContext>
}