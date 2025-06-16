import React, { createContext, useContext, useState } from "react";

// Define the shape of your global context
type GlobalContextType = {
    isLoggedIn: boolean;
    changeIsLoggedIn: (newState: boolean) => void;

    loginFlow: boolean;
    changeLoginFlow: (newState: boolean) => void;

    userType: string | null;
    changeUserType: (newState: string) => void;

    userId: string | null;
    changeUserId: (newState: string | null) => void;

    event: string;
    changeEvent: (newState: string) => void;
};

// Create the context with an optional default value
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Custom hook to use global context
export function useGlobalInfo() {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalInfo must be used within a GlobalProvider");
    }
    return context;
}

// Context provider component
export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginFlow, setLoginFlow] = useState(true);
    const [userType, setUserType] = useState<string>("admin");
    const [userId, setUserId] = useState<string | null>("");
    const [event, setEvent] = useState<string>("");

    const value: GlobalContextType = {
        isLoggedIn,
        changeIsLoggedIn: setIsLoggedIn,

        loginFlow,
        changeLoginFlow: setLoginFlow,

        userType,
        changeUserType: setUserType,

        userId,
        changeUserId: setUserId,

        event,
        changeEvent: setEvent,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};
