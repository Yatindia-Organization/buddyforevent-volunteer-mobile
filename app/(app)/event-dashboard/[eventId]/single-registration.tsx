import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { Divider, Button } from 'react-native-paper';

export default function SingleParticipation() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        tickets: '0',
    });

    const handleChange = (name: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const [open, setOpen] = useState(false);
    const [ticketValue, setTicketValue] = useState(form.tickets);
    const [ticketItems, setTicketItems] = useState(
        Array.from({ length: 10 }, (_, i) => ({ label: `${i}`, value: `${i}` }))
    );

    useEffect(() => {
        handleChange('tickets', ticketValue);
    }, [ticketValue]);

    return (
        <SafeAreaView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.wrapper}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.header}>Single Participant Registration</Text>
                    <Text style={styles.subHeader}>
                        Issue tickets to your Participants without asking them to register online.
                    </Text>

                    <View style={styles.card}>
                        {/* Info */}
                        <View style={styles.infoRow}>
                            <Text style={styles.infoTitle}>Choose Your</Text>
                            <View style={styles.infoRight}>
                                <View style={styles.infoItem}>
                                    <MaterialIcons name="access-time" size={16} color="#555" />
                                    <Text style={styles.infoText}>08:00 PM - 08:00 PM</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <MaterialIcons name="event-note" size={16} color="red" />
                                    <Text style={[styles.infoText, { color: 'red' }]}>
                                        118 TICKET REMAINING
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Ticket Dropdown */}
                        <Text style={styles.label}>Select the number of tickets</Text>
                        <DropDownPicker
                            open={open}
                            value={ticketValue}
                            items={ticketItems}
                            setOpen={setOpen}
                            setValue={setTicketValue}
                            setItems={setTicketItems}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                            placeholder="Select tickets"
                            listMode="MODAL" // ✅ avoids nested FlatList warning
                        />

                        {/* Buyer Info */}
                        <Text style={styles.sectionHeader}>Buyer Details</Text>
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={form.name}
                                onChangeText={(text) => handleChange('name', text)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={form.email}
                                keyboardType="email-address"
                                onChangeText={(text) => handleChange('email', text)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Mobile number"
                                value={form.mobile}
                                keyboardType="phone-pad"
                                onChangeText={(text) => handleChange('mobile', text)}
                            />
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.buttonRow}>
                            <Button mode="outlined" onPress={() => console.log('Cancel')}>
                                Cancel
                            </Button>
                            <Button
                                mode="contained"
                                buttonColor="#4CAF50"
                                onPress={() => console.log('Proceed')}
                            >
                                Proceed
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    wrapper: {
        // flex: 1
    },
    container: {
        backgroundColor: '#f9f9f9',
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#9A93B3',
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 14,
        color: '#333',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    infoRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    infoText: {
        fontSize: 12,
        color: '#555',
        marginLeft: 4,
    },
    divider: {
        marginVertical: 12,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
    },
    dropdown: {
        borderColor: '#ccc',
        height: 44,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    dropdownContainer: {
        borderColor: '#ccc',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 8,
    },
    inputGroup: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
});
