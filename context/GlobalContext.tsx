import React, { createContext, useContext, useState } from "react";

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

    qrData: any;
    changeQrData: (newState: any) => void;

    theme: "light" | "dark";
    setTheme: (newTheme: "light" | "dark") => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function useGlobalInfo() {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalInfo must be used within a GlobalProvider");
    }
    return context;
}

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginFlow, setLoginFlow] = useState(true);
    const [userType, setUserType] = useState<string>("admin");
    const [userId, setUserId] = useState<string | null>("");
    const [event, setEvent] = useState<string>("");
    const [qrData, setQrData] = useState<any>([]);
    const [theme, setTheme] = useState<"light" | "dark">("light"); 

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

        qrData,
        changeQrData: setQrData,

        theme,
        setTheme,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};
