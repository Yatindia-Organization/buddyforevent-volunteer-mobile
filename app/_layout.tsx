import { Slot } from "expo-router";
import { View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { GlobalProvider } from "../context/GlobalContext";

export default function RootLayout() {

    return (
        <PaperProvider>
            <GlobalProvider>
                <View style={{ flex: 1 }}>
                    <Slot />
                </View>
            </GlobalProvider>
        </PaperProvider>
    );
}
