import { Slot } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { GlobalProvider } from "../context/GlobalContext";

export default function RootLayout() {
    return (
        <PaperProvider>
            <GlobalProvider>
                <Slot />
            </GlobalProvider>
        </PaperProvider>
    );
}
