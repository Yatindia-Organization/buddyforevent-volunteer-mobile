import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface FormData {
    registrationName: string;
    quantity: string;
    minQty: string;
    maxQty: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    showRemaining: boolean;
    teamRegistration: boolean;
}

const TicketRegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        registrationName: '',
        quantity: '',
        minQty: '',
        maxQty: '',
        description: '',
        startDate: null,
        endDate: null,
        showRemaining: true,
        teamRegistration: false,
    });

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const handleChange = (name: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggle = (name: keyof FormData, value: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const minStartDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const minEndDate = formData.startDate
        ? new Date(formData.startDate.getTime() + 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    const renderLabel = (text: string) => (
        <Text style={styles.label}>{text}</Text>
    );

    return (

        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View >
                        <Text style={styles.note}>
                            Please note that participants will receive email, SMS, and WhatsApp messages after registration.
                        </Text>

                        {/* Registration Name */}
                        <View style={styles.row}>
                            {renderLabel('Registration Name *')}
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Event 001"
                                value={formData.registrationName}
                                onChangeText={(text) => handleChange('registrationName', text)}
                            />
                        </View>

                        {/* Registration Quantity */}
                        <View style={styles.row}>
                            {renderLabel('Registration Quantity *')}
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. total ticket quantity"
                                value={formData.quantity}
                                onChangeText={(text) => handleChange('quantity', text)}
                                keyboardType="numeric"
                            />
                        </View>

                        {/* Min and Max Qty */}
                        <View style={styles.row}>
                            {renderLabel('Min. Qty. *')}
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 1"
                                value={formData.minQty}
                                onChangeText={(text) => handleChange('minQty', text)}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.row}>
                            {renderLabel('Max. Qty. *')}
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 10"
                                value={formData.maxQty}
                                onChangeText={(text) => handleChange('maxQty', text)}
                                keyboardType="numeric"
                            />
                        </View>

                        {/* Description */}
                        <View style={styles.row}>
                            {renderLabel('Description *')}
                            <TextInput
                                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                placeholder="Enter ticket description"
                                value={formData.description}
                                onChangeText={(text) => handleChange('description', text)}
                                multiline
                            />
                        </View>

                        {/* Start Date */}
                        <View style={styles.row}>
                            {renderLabel('Start Date *')}
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => setShowStartDatePicker(true)}
                            >
                                <Text>{formData.startDate ? formData.startDate.toDateString() : 'Select Date'}</Text>
                            </TouchableOpacity>
                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={formData.startDate || minStartDate}
                                    mode="date"
                                    minimumDate={minStartDate}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(_, selectedDate) => {
                                        setShowStartDatePicker(false);
                                        if (selectedDate) {
                                            setFormData((prev) => ({ ...prev, startDate: selectedDate }));
                                        }
                                    }}
                                />
                            )}
                        </View>

                        {/* End Date */}
                        <View style={styles.row}>
                            {renderLabel('End Date *')}
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => setShowEndDatePicker(true)}
                            >
                                <Text>{formData.endDate ? formData.endDate.toDateString() : 'Select Date'}</Text>
                            </TouchableOpacity>
                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={formData.endDate || minEndDate}
                                    mode="date"
                                    minimumDate={minEndDate}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(_, selectedDate) => {
                                        setShowEndDatePicker(false);
                                        if (selectedDate) {
                                            setFormData((prev) => ({ ...prev, endDate: selectedDate }));
                                        }
                                    }}
                                />
                            )}
                        </View>

                        {/* Show Remaining Qty */}
                        <View style={styles.row}>
                            {renderLabel('Show Remaining Qty')}
                            <Switch
                                value={formData.showRemaining}
                                onValueChange={(val) => handleToggle('showRemaining', val)}
                            />
                        </View>

                        {/* Team Registration */}
                        <View style={styles.row}>
                            {renderLabel('Team Registration')}
                            <Switch
                                value={formData.teamRegistration}
                                onValueChange={(val) => handleToggle('teamRegistration', val)}
                            />
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.nextButton}>
                                <Text style={styles.nextButtonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>

    );
};

export default TicketRegistrationForm;

const styles = StyleSheet.create({
    container: {
        minHeight: 520,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    note: {
        fontSize: 14,
        color: '#E36A6C',
        marginBottom: 16,
    },
    row: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        fontSize: 14,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#333',
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
