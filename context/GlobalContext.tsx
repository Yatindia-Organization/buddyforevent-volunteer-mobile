import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeType = "light" | "dark";
type ThemePreferenceType = "system" | "light" | "dark";

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

    theme: ThemeType;
    setTheme: (newTheme: ThemeType) => void;

    themePreference: ThemePreferenceType;
    setThemePreference: (pref: ThemePreferenceType) => void;
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
    const [themePreference, setThemePreference] = useState<ThemePreferenceType>("system"); 
    const systemColorScheme = useColorScheme();

    const [theme, setTheme] = useState<ThemeType>(
        systemColorScheme === "dark" ? "dark" : "light"
    );

    useEffect(() => {
        if (themePreference === "system") {
            setTheme(systemColorScheme === "dark" ? "dark" : "light");
        }
    }, [systemColorScheme, themePreference]);

    const handleSetTheme = (newTheme: ThemeType) => {
        setThemePreference("custom"); 
        setTheme(newTheme);
        setThemePreference(newTheme); 
    };

    // Provide everything in context
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
        setTheme: handleSetTheme, // use our custom handler

        themePreference,
        setThemePreference,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};
