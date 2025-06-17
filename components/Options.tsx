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
import { useGlobalInfo } from '../context/GlobalContext'; // ← NEW
import {
    checkFoodStatus,
    giveGift,
    logExit,
    validateEntry,
} from '../services/api';

interface OptionsProps {
    data: string;
}

const Options: React.FC<OptionsProps> = ({ data }) => {
    /* ---------- read limit from global store ---------- */
    const { maxChoices = 5 } = useGlobalInfo();               // default 5

    /* Generate ["1","2",…] once, memoised */
    const numericItems = useMemo(
        () =>
            Array.from({ length: maxChoices }, (_, i) => ({
                label: `${i + 1}`,
                value: `${i + 1}`,
            })),
        [maxChoices]
    );

    /* ---------- entry modal state ---------- */
    const [entryModalVisible, setEntryModalVisible] = useState(false);
    const [entryOpen, setEntryOpen] = useState(false);
    const [visitorCount, setVisitorCount] = useState<string | null>('1');

    /* ---------- food modal state ---------- */
    const [foodModalVisible, setFoodModalVisible] = useState(false);
    const [foodOpen, setFoodOpen] = useState(false);
    const [foodUnits, setFoodUnits] = useState<string | null>('1');  // numeric

    /* ---------- handlers ---------- */
    const submitEntry = async () => {
        try {
            const res = await validateEntry(data, visitorCount!);
            Alert.alert('Entry', res.message);
        } catch {
            Alert.alert('Error', 'Entry failed.');
        }
        setEntryModalVisible(false);
    };

    const submitFood = async () => {
        try {
            const res = await checkFoodStatus(data, foodUnits!);
            Alert.alert('Food', res.message);
        } catch {
            Alert.alert('Error', 'Food check failed.');
        }
        setFoodModalVisible(false);
    };

    const handleExit = async () => {
        try {
            const res = await logExit(data);
            Alert.alert('Visitor Exit', res.message);
        } catch {
            Alert.alert('Error', 'Exit failed.');
        }
    };

    const handleGift = async () => {
        try {
            const res = await giveGift(data);
            Alert.alert('Gift Received', res.message);
        } catch {
            Alert.alert('Error', 'Gift failed.');
        }
    };

    /* ---------- UI ---------- */
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => setEntryModalVisible(true)}>
                <Text style={styles.buttonText}>Record Entry</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleExit}>
                <Text style={styles.buttonText}>Record Exit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleGift}>
                <Text style={styles.buttonText}>Gift</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setFoodModalVisible(true)}>
                <Text style={styles.buttonText}>Food</Text>
            </TouchableOpacity>

            {/* -------- ENTRY modal -------- */}
            <Modal
                visible={entryModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setEntryModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select number of visitors</Text>

                        <DropDownPicker
                            open={entryOpen}
                            value={visitorCount}
                            items={numericItems}            // ← uses global limit
                            setOpen={setEntryOpen}
                            setValue={setVisitorCount}
                            containerStyle={[styles.dropdownContainer, { zIndex: 2000 }]}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownList}
                        />

                        <ModalButtons
                            onSubmit={submitEntry}
                            onCancel={() => setEntryModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>

            {/* -------- FOOD modal -------- */}
            <Modal
                visible={foodModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setFoodModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select food quantity</Text>

                        <DropDownPicker
                            open={foodOpen}
                            value={foodUnits}
                            items={numericItems}            // ← same numeric list
                            setOpen={setFoodOpen}
                            setValue={setFoodUnits}
                            containerStyle={[styles.dropdownContainer, { zIndex: 3000 }]}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownList}
                        />

                        <ModalButtons
                            onSubmit={submitFood}
                            onCancel={() => setFoodModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Options;

/* ---------- tiny sub-component to reuse submit/cancel buttons ---------- */
const ModalButtons = ({
    onSubmit,
    onCancel,
}: {
    onSubmit: () => void;
    onCancel: () => void;
}) => (
    <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.modalButton} onPress={onSubmit}>
            <Text style={styles.modalButtonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onCancel}
        >
            <Text style={[styles.modalButtonText, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
    </View>
);

/* ------------- styles ------------- */
const styles = StyleSheet.create({
    container: { padding: 16 },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 12,
        borderRadius: 4,
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 16,
    },
    /* modal */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
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
    dropdown: { backgroundColor: '#fafafa' },
    dropdownList: { backgroundColor: '#fafafa' },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#6200EE',
        paddingVertical: 10,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    modalButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    cancelButton: { backgroundColor: '#AAA' },
    cancelText: { color: '#333' },
});
