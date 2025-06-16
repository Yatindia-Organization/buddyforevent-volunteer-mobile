import { useEffect, useState } from "react";
import { View, Button, Alert, Text, Modal, TextInput, StyleSheet } from "react-native";
// import { BarCodeScanner } from "expo-barcode-scanner";
import { validateEntry, logExit, giveGift, checkFoodStatus } from "../services/api";

export default function QRScanner() {
    const [permission, setPermission] = useState<boolean | null>(null);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [visitorCount, setVisitorCount] = useState("");

    useEffect(() => {
        // (async () => {
        //     const { status } = await BarCodeScanner.requestPermissionsAsync();
        //     setPermission(status === "granted");
        // })();
    }, []);

    const onScan = ({ data }: { data: string }) => {
        setScannedData(data);
    };

    const submitEntry = async () => {
        try {
            const res = await validateEntry(scannedData!, visitorCount);
            Alert.alert("Entry", res.message);
        } catch {
            Alert.alert("Error", "Entry failed.");
        }
        setModalVisible(false);
        setVisitorCount("");
    };

    if (permission === null) return <Text>Requesting permission...</Text>;
    if (!permission) return <Text>No camera access.</Text>;

    return (
        <View style={{ flex: 1 }}>
            {!scannedData ? (
                <BarCodeScanner
                    onBarCodeScanned={onScan}
                    style={{ flex: 1 }}
                />
            ) : (
                <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
                    <Button title="Entry" onPress={() => setModalVisible(true)} />
                    <Button title="Exit" onPress={() => logExit(scannedData).then(res => Alert.alert(res.message))} />
                    <Button title="Gift" onPress={() => giveGift(scannedData).then(res => Alert.alert(res.message))} />
                    <Button title="Food" onPress={() => checkFoodStatus(scannedData).then(res => Alert.alert(res.message))} />
                    <Button title="Scan Again" onPress={() => setScannedData(null)} />
                </View>
            )}

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Enter number of visitors:</Text>
                        <TextInput
                            value={visitorCount}
                            onChangeText={setVisitorCount}
                            style={styles.input}
                            keyboardType="numeric"
                        />
                        <Button title="Submit" onPress={submitEntry} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "#000000aa",
        justifyContent: "center",
    },
    modalContent: {
        backgroundColor: "white",
        margin: 20,
        padding: 20,
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginVertical: 10,
    },
});
