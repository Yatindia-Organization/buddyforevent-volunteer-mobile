import React, { useMemo, useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Scanner from '../../components/qr-scanner';
import { Colors } from "../../constants/Colors";
import { useGlobalInfo } from '../../context/GlobalContext';
import {
    checkFoodStatus,
    giveGift,
    logExit,
    validateEntry,
} from '../../services/api';

const Dashboard: React.FC = () => {
    const { theme } = useGlobalInfo();

    const [view, setView] = useState<'options' | 'scanner'>('options');
    const [currentOption, setCurrentOption] = useState<string | null>(null);
    const [qrData, setQrData] = useState<any>(null);

    // Modal/dropdown state
    const [entryModalVisible, setEntryModalVisible] = useState(false);
    const [entryOpen, setEntryOpen] = useState(false);
    const [visitorCount, setVisitorCount] = useState('1');
    const [foodModalVisible, setFoodModalVisible] = useState(false);
    const [foodOpen, setFoodOpen] = useState(false);
    const [foodUnits, setFoodUnits] = useState('1');
    const [scanSessionId, setScanSessionId] = useState(0);

    const entryDropdownItems = useMemo(
        () =>
            Array.from(
                { length: qrData?.visitorCount || 0 },
                (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })
            ),
        [qrData?.visitorCount]
    );
    const foodDropdownItems = useMemo(
        () =>
            Array.from(
                { length: qrData?.visitorCount || 0 },
                (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })
            ),
        [qrData?.visitorCount]
    );

    // Handle picking an option
    const handleOptionSelect = (option: string) => {
        setCurrentOption(option);
        setView('scanner');
        setQrData(null);
        setScanSessionId(prev => prev + 1);
    };

    // Scanner handler
    const handleScannerDone = (data: any | null) => {
        if (!data) {
            setView('options');
            setQrData(null);
            setCurrentOption(null);
            return;
        }
        setQrData(data);

        if (currentOption === 'entry') setEntryModalVisible(true);
        else if (currentOption === 'food') setFoodModalVisible(true);
        else if (currentOption === 'exit') handleExit(data.qrcode);
        else if (currentOption === 'gift') handleGift(data.qrcode);
    };

    // Reset for next scan (immediately go back to scanner)
    const resetForNextScan = () => {
        setQrData(null);
        setEntryOpen(false);
        setVisitorCount('1');
        setFoodOpen(false);
        setFoodUnits('1');
        setEntryModalVisible(false);
        setFoodModalVisible(false);
        setView('scanner');
        setScanSessionId(prev => prev + 1);
    };

    // Modal/API submit handlers
    const submitEntry = async () => {
        try {
            const res = await validateEntry(qrData.qrcode, visitorCount);
            Alert.alert('Entry', res.message || 'Entry recorded.');
        } catch {
            Alert.alert('Error', 'Entry failed.');
        }
        resetForNextScan();
    };

    const submitFood = async () => {
        try {
            const res = await checkFoodStatus(qrData.qrcode, foodUnits);
            Alert.alert('Food', res.message || 'Food recorded.');
        } catch {
            Alert.alert('Error', 'Food failed.');
        }
        resetForNextScan();
    };

    const handleExit = async (qrcode: string) => {
        try {
            const res = await logExit(qrcode);
            Alert.alert('Exit', res.message || 'Exit recorded.');
        } catch {
            Alert.alert('Error', 'Exit failed.');
        }
        resetForNextScan();
    };

    const handleGift = async (qrcode: string) => {
        try {
            const res = await giveGift(qrcode);
            Alert.alert('Gift', res.message || 'Gift recorded.');
        } catch {
            Alert.alert('Error', 'Gift failed.');
        }
        resetForNextScan();
    };

    const showOptionsButton = (
        <TouchableOpacity
            style={{ alignSelf: 'flex-end', margin: 10 }}
            onPress={() => {
                setView('options');
                setCurrentOption(null);
                setQrData(null);
            }}>
            <Text style={{ color: Colors[theme].button, fontWeight: 'bold' }}>Back to Options</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors[theme].background }}>
            <View style={[
                styles.topBar,
                { borderBottomColor: Colors[theme].secondaryText }
            ]}>
                <Text style={[styles.title, { color: Colors[theme].text }]}>Dashboard</Text>
                {view === 'scanner' && showOptionsButton}
            </View>
            {view === 'options' && (
                <Options onOptionSelect={handleOptionSelect} theme={theme} />
            )}
            {view === 'scanner' && (
                <View style={{ flex: 1, minHeight: 350 }}>
                    <Text style={{ fontSize: 16, marginBottom: 4, color: Colors[theme].secondaryText }}>
                        Scanning for: <Text style={{ fontWeight: 'bold', color: Colors[theme].text }}>{currentOption}</Text>
                    </Text>
                    <Scanner key={scanSessionId} onDone={handleScannerDone} />
                </View>
            )}

            {/* Entry Modal */}
            <Modal
                visible={entryModalVisible}
                transparent
                animationType="slide"
                onRequestClose={resetForNextScan}
            >
                <View style={[styles.modalOverlay, { backgroundColor: Colors[theme].overlay }]}>
                    <View style={[styles.modalContent, { backgroundColor: Colors[theme].card }]}>
                        <Text style={[styles.modalTitle, { color: Colors[theme].text }]}>Select number of visitors</Text>
                        <DropDownPicker
                            open={entryOpen}
                            value={visitorCount}
                            items={entryDropdownItems}
                            setOpen={setEntryOpen}
                            setValue={setVisitorCount}
                            containerStyle={[styles.dropdownContainer, { zIndex: 2000 }]}
                            style={[styles.dropdown, { backgroundColor: Colors[theme].dropdownBackground }]}
                            dropDownContainerStyle={{ backgroundColor: Colors[theme].dropdownBackground }}
                            textStyle={{ color: Colors[theme].text }}
                        />
                        <ModalButtons
                            onSubmit={submitEntry}
                            onCancel={resetForNextScan}
                            theme={theme}
                        />
                    </View>
                </View>
            </Modal>
            {/* Food Modal */}
            <Modal
                visible={foodModalVisible}
                transparent
                animationType="slide"
                onRequestClose={resetForNextScan}
            >
                <View style={[styles.modalOverlay, { backgroundColor: Colors[theme].overlay }]}>
                    <View style={[styles.modalContent, { backgroundColor: Colors[theme].card }]}>
                        <Text style={[styles.modalTitle, { color: Colors[theme].text }]}>Select food quantity</Text>
                        <DropDownPicker
                            open={foodOpen}
                            value={foodUnits}
                            items={foodDropdownItems}
                            setOpen={setFoodOpen}
                            setValue={setFoodUnits}
                            containerStyle={[styles.dropdownContainer, { zIndex: 3000 }]}
                            style={[styles.dropdown, { backgroundColor: Colors[theme].dropdownBackground }]}
                            dropDownContainerStyle={{ backgroundColor: Colors[theme].dropdownBackground }}
                            textStyle={{ color: Colors[theme].text }}
                        />
                        <ModalButtons
                            onSubmit={submitFood}
                            onCancel={resetForNextScan}
                            theme={theme}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const Options = ({ onOptionSelect, theme }: { onOptionSelect: (option: string) => void, theme: string }) => (
    <View style={{ padding: 20 }}>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors[theme].button }]} onPress={() => onOptionSelect('entry')}>
            <Text style={[styles.buttonText, { color: Colors[theme].buttonText }]}>Record Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors[theme].button }]} onPress={() => onOptionSelect('exit')}>
            <Text style={[styles.buttonText, { color: Colors[theme].buttonText }]}>Record Exit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors[theme].button }]} onPress={() => onOptionSelect('gift')}>
            <Text style={[styles.buttonText, { color: Colors[theme].buttonText }]}>Gift</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors[theme].button }]} onPress={() => onOptionSelect('food')}>
            <Text style={[styles.buttonText, { color: Colors[theme].buttonText }]}>Food</Text>
        </TouchableOpacity>
    </View>
);

const ModalButtons = ({
    onSubmit,
    onCancel,
    theme,
}: {
    onSubmit: () => void;
    onCancel: () => void;
    theme: string;
}) => (
    <View style={styles.modalButtons}>
        <TouchableOpacity style={[styles.modalButton, { backgroundColor: Colors[theme].button }]} onPress={onSubmit}>
            <Text style={[styles.modalButtonText, { color: Colors[theme].buttonText }]}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton, { backgroundColor: Colors[theme].cancelButton }]}
            onPress={onCancel}
        >
            <Text style={[styles.modalButtonText, styles.cancelText, { color: Colors[theme].cancelButtonText }]}>Cancel</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    title: { fontSize: 24, fontWeight: 'bold' },
    button: {
        paddingVertical: 12,
        borderRadius: 4,
        marginBottom: 12,
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        borderRadius: 8,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
    },
    dropdownContainer: {
        marginBottom: 16,
    },
    dropdown: {},
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    modalButtonText: {
        textAlign: 'center',
        fontSize: 16,
    },
    cancelButton: {},
    cancelText: {},
});

export default Dashboard;
