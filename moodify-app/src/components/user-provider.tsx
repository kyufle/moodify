import { createContext, ReactNode, useState } from "react";

const defaultValue = {
    accessToken: null,
    user: null
};

export const UserContext = createContext<any>(null);

export default function UserProvider({ children }: { children: ReactNode }) {
    const [userValue, setUserValue] = useState(defaultValue);
    return <UserContext value={{
        setUserValue,
        userValue
    }}>
        {children}
    </UserContext>
}