// import React, { useMemo, useState } from 'react';
// import {
//     Alert,
//     Modal,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import DropDownPicker from 'react-native-dropdown-picker';
// import { useGlobalInfo } from '../context/GlobalContext';
// import {
//     checkFoodStatus,
//     giveGift,
//     logExit,
//     validateEntry,
// } from '../services/api';

// interface OptionsProps {
//     data: {
//         entryTime: string | null;
//         exitTime: string | null;
//         foodTime: string | null;
//         giftTime: string | null;
//         food: any;
//         gift: any;
//         foodCount: number | null;
//         qrcode: string;
//     };
// }

// const Options: React.FC<OptionsProps> = ({ data }) => {
//     const { maxChoices = 5 } = useGlobalInfo();
//     const dropdownItems = useMemo(
//         () =>
//             Array.from({ length: maxChoices }, (_, i) => ({
//                 label: `${i + 1}`,
//                 value: `${i + 1}`,
//             })),
//         [maxChoices]
//     );

//     const [entryModalVisible, setEntryModalVisible] = useState(false);
//     const [entryOpen, setEntryOpen] = useState(false);
//     const [visitorCount, setVisitorCount] = useState<string | null>('1');

//     const [foodModalVisible, setFoodModalVisible] = useState(false);
//     const [foodOpen, setFoodOpen] = useState(false);
//     const [foodUnits, setFoodUnits] = useState<string | null>('1');

//     // Button disable logic
//     const isEntryDone = !!data.entryTime;
//     const isExitDone = !!data.exitTime;
//     const isGiftDone = !!data.giftTime || !!data.gift;
//     const isFoodDone = !!data.foodTime || !!data.foodCount;

//     const submitEntry = async () => {
//         try {
//             const res = await validateEntry(data.qrcode, visitorCount!);
//             Alert.alert('Entry', res.message);
//         } catch {
//             Alert.alert('Error', 'Entry failed.');
//         }
//         setEntryModalVisible(false);
//     };

//     const submitFood = async () => {
//         try {
//             const res = await checkFoodStatus(data.qrcode, foodUnits!);
//             Alert.alert('Food', res.message);
//         } catch {
//             Alert.alert('Error', 'Food check failed.');
//         }
//         setFoodModalVisible(false);
//     };

//     const handleExit = async () => {
//         try {
//             const res = await logExit(data.qrcode);
//             Alert.alert('Exit', res.message);
//         } catch {
//             Alert.alert('Error', 'Exit failed.');
//         }
//     };

//     const handleGift = async () => {
//         try {
//             const res = await giveGift(data.qrcode);
//             Alert.alert('Gift', res.message);
//         } catch {
//             Alert.alert('Error', 'Gift failed.');
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {/* ENTRY */}
//             <TouchableOpacity
//                 style={[styles.button, isEntryDone && styles.disabled]}
//                 disabled={isEntryDone}
//                 onPress={() => setEntryModalVisible(true)}
//             >
//                 <Text style={styles.buttonText}>Record Entry</Text>
//             </TouchableOpacity>

//             {/* EXIT */}
//             <TouchableOpacity
//                 style={[styles.button, isExitDone && styles.disabled]}
//                 disabled={isExitDone}
//                 onPress={handleExit}
//             >
//                 <Text style={styles.buttonText}>Record Exit</Text>
//             </TouchableOpacity>

//             {/* GIFT */}
//             <TouchableOpacity
//                 style={[styles.button, isGiftDone && styles.disabled]}
//                 disabled={isGiftDone}
//                 onPress={handleGift}
//             >
//                 <Text style={styles.buttonText}>Gift</Text>
//             </TouchableOpacity>

//             {/* FOOD */}
//             <TouchableOpacity
//                 style={[styles.button, isFoodDone && styles.disabled]}
//                 disabled={isFoodDone}
//                 onPress={() => setFoodModalVisible(true)}
//             >
//                 <Text style={styles.buttonText}>Food</Text>
//             </TouchableOpacity>

//             {/* ENTRY MODAL */}
//             <Modal
//                 visible={entryModalVisible}
//                 transparent
//                 animationType="slide"
//                 onRequestClose={() => setEntryModalVisible(false)}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.modalTitle}>Select number of visitors</Text>
//                         <DropDownPicker
//                             open={entryOpen}
//                             value={visitorCount}
//                             items={dropdownItems}
//                             setOpen={setEntryOpen}
//                             setValue={setVisitorCount}
//                             containerStyle={[styles.dropdownContainer, { zIndex: 2000 }]}
//                             style={styles.dropdown}
//                             dropDownContainerStyle={styles.dropdownList}
//                         />
//                         <ModalButtons
//                             onSubmit={submitEntry}
//                             onCancel={() => setEntryModalVisible(false)}
//                         />
//                     </View>
//                 </View>
//             </Modal>

//             {/* FOOD MODAL */}
//             <Modal
//                 visible={foodModalVisible}
//                 transparent
//                 animationType="slide"
//                 onRequestClose={() => setFoodModalVisible(false)}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.modalTitle}>Select food quantity</Text>
//                         <DropDownPicker
//                             open={foodOpen}
//                             value={foodUnits}
//                             items={dropdownItems}
//                             setOpen={setFoodOpen}
//                             setValue={setFoodUnits}
//                             containerStyle={[styles.dropdownContainer, { zIndex: 3000 }]}
//                             style={styles.dropdown}
//                             dropDownContainerStyle={styles.dropdownList}
//                         />
//                         <ModalButtons
//                             onSubmit={submitFood}
//                             onCancel={() => setFoodModalVisible(false)}
//                         />
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// export default Options;

// // Shared button group
// const ModalButtons = ({
//     onSubmit,
//     onCancel,
// }: {
//     onSubmit: () => void;
//     onCancel: () => void;
// }) => (
//     <View style={styles.modalButtons}>
//         <TouchableOpacity style={styles.modalButton} onPress={onSubmit}>
//             <Text style={styles.modalButtonText}>Submit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//             style={[styles.modalButton, styles.cancelButton]}
//             onPress={onCancel}
//         >
//             <Text style={[styles.modalButtonText, styles.cancelText]}>Cancel</Text>
//         </TouchableOpacity>
//     </View>
// );

// const styles = StyleSheet.create({
//     container: { padding: 16 },
//     button: {
//         backgroundColor: '#6200EE',
//         paddingVertical: 12,
//         borderRadius: 4,
//         marginBottom: 12,
//     },
//     disabled: {
//         backgroundColor: '#cccccc',
//         opacity: 0.6,
//     },
//     buttonText: {
//         color: '#fff',
//         textAlign: 'center',
//         fontWeight: '500',
//         fontSize: 16,
//     },
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     modalContent: {
//         width: '80%',
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         padding: 20,
//     },
//     modalTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         textAlign: 'center',
//         marginBottom: 12,
//     },
//     dropdownContainer: {
//         marginBottom: 16,
//     },
//     dropdown: { backgroundColor: '#fafafa' },
//     dropdownList: { backgroundColor: '#fafafa' },
//     modalButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     modalButton: {
//         flex: 1,
//         backgroundColor: '#6200EE',
//         paddingVertical: 10,
//         borderRadius: 4,
//         marginHorizontal: 4,
//     },
//     modalButtonText: {
//         color: '#fff',
//         textAlign: 'center',
//         fontSize: 16,
//     },
//     cancelButton: { backgroundColor: '#AAA' },
//     cancelText: { color: '#333' },
// });



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
import {
    checkFoodStatus,
    giveGift,
    logExit,
    validateEntry,
} from '../services/api';
import QRScanner from './qr-scanner';

const Options: React.FC = () => {
    // UI State
    const [selectedOption, setSelectedOption] = useState<null | string>(null);
    const [showScanner, setShowScanner] = useState(false);
    const [qrData, setQrData] = useState<any>(null); // holds full QR response from API

    // Modals
    const [entryModalVisible, setEntryModalVisible] = useState(false);
    const [entryOpen, setEntryOpen] = useState(false);
    const [visitorCount, setVisitorCount] = useState<string | null>('1');

    const [foodModalVisible, setFoodModalVisible] = useState(false);
    const [foodOpen, setFoodOpen] = useState(false);
    const [foodUnits, setFoodUnits] = useState<string | null>('1');

    // Dropdowns depend on scanned QR data or fall back to default
    const entryDropdownItems = useMemo(
        () =>
            Array.from(
                { length: qrData?.visitorCount },
                (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })
            ),
        [qrData?.visitorCount]
    );

    const foodDropdownItems = useMemo(
        () =>
            Array.from(
                { length: qrData?.visitorCount },
                (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })
            ),
        [qrData?.visitorCount,]
    );

    // Handle pressing an option: open scanner
    const handleOptionPress = (option: string) => {
        setSelectedOption(option);
        setShowScanner(true);
        setQrData(null); // Reset QR data before new scan
    };

    // Handle QR scan result
    const handleScannerDone = (data: any | null) => {
        if (!data) {
            // Invalid QR or scan cancelled
            setShowScanner(false);
            setSelectedOption(null);
            setQrData(null);
            return;
        }
        console.log(data, "this is ui")
        setQrData(data);
        setShowScanner(false);

        // For entry/food, open modal. For exit/gift, act directly.
        if (selectedOption === 'entry') setEntryModalVisible(true);
        else if (selectedOption === 'food') setFoodModalVisible(true);
        else if (selectedOption === 'exit') handleExit(data.qrcode);
        else if (selectedOption === 'gift') handleGift(data.qrcode);
    };

    // Reset flow to scan again after each operation
    const resetFlow = () => {
        setSelectedOption(null);
        setQrData(null);
        setShowScanner(true);
    };

    // Actions for each operation
    const submitEntry = async () => {
        try {
            const res = await validateEntry(qrData.qrcode, visitorCount!);
            Alert.alert('Entry', res.message);
        } catch {
            Alert.alert('Error', 'Entry failed.');
        }
        setEntryModalVisible(false);
        resetFlow();
    };

    const submitFood = async () => {
        try {
            const res = await checkFoodStatus(qrData.qrcode, foodUnits!);
            Alert.alert('Food', res.message);
        } catch {
            Alert.alert('Error', 'Food check failed.');
        }
        setFoodModalVisible(false);
        resetFlow();
    };

    const handleExit = async (qrcode: string) => {
        try {
            const res = await logExit(qrcode);
            Alert.alert('Exit', res.message);
        } catch {
            Alert.alert('Error', 'Exit failed.');
        }
        resetFlow();
    };

    const handleGift = async (qrcode: string) => {
        try {
            const res = await giveGift(qrcode);
            Alert.alert('Gift', res.message);
        } catch {
            Alert.alert('Error', 'Gift failed.');
        }
        resetFlow();
    };

    return (
        <View style={styles.container}>
            {showScanner ? (
                <View style={{ flex: 1, minHeight: 400 }}>
                    <Text style={styles.scanText}>Please scan QR code</Text>
                    <QRScanner onDone={handleScannerDone} />
                </View>
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleOptionPress('entry')}
                    >
                        <Text style={styles.buttonText}>Record Entry</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleOptionPress('exit')}
                    >
                        <Text style={styles.buttonText}>Record Exit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleOptionPress('gift')}
                    >
                        <Text style={styles.buttonText}>Gift</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleOptionPress('food')}
                    >
                        <Text style={styles.buttonText}>Food</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Entry Modal */}
            <Modal
                visible={entryModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => {
                    setEntryModalVisible(false);
                    resetFlow();
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select number of visitors</Text>
                        <DropDownPicker
                            open={entryOpen}
                            value={visitorCount}
                            items={entryDropdownItems}
                            setOpen={setEntryOpen}
                            setValue={setVisitorCount}
                            containerStyle={[styles.dropdownContainer, { zIndex: 2000 }]}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownList}
                        />
                        <ModalButtons
                            onSubmit={submitEntry}
                            onCancel={() => {
                                setEntryModalVisible(false);
                                resetFlow();
                            }}
                        />
                    </View>
                </View>
            </Modal>

            {/* Food Modal */}
            <Modal
                visible={foodModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => {
                    setFoodModalVisible(false);
                    resetFlow();
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select food quantity</Text>
                        <DropDownPicker
                            open={foodOpen}
                            value={foodUnits}
                            items={foodDropdownItems}
                            setOpen={setFoodOpen}
                            setValue={setFoodUnits}
                            containerStyle={[styles.dropdownContainer, { zIndex: 3000 }]}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownList}
                        />
                        <ModalButtons
                            onSubmit={submitFood}
                            onCancel={() => {
                                setFoodModalVisible(false);
                                resetFlow();
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Options;

// Shared button group
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

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1, justifyContent: 'center' },
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
    scanText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 12,
        color: '#333'
    },
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
        marginTop: 8,
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
