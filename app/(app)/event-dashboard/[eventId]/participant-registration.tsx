import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TicketRegistrationForm from '../../../ticket-registration';
import FormBuilder from '../../../../components/dynamic-form';

const ParticipantRegistration: React.FC = () => {
    const [formType, setFormType] = useState<'ticket' | 'user'>('ticket');

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Event Registration</Text>
                    <Text style={styles.headerSubtitle}>
                        You can create event registration forms and ticket registration counts here for your event.
                    </Text>
                </View>

                {/* Toggle for registration type form */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            formType === 'ticket' && styles.activeToggleButton
                        ]}
                        onPress={() => setFormType('ticket')}
                    >
                        <Text
                            style={[
                                styles.toggleButtonText,
                                formType === 'ticket' && styles.activeToggleButtonText
                            ]}
                        >
                            Ticket Registration
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            formType === 'user' && styles.activeToggleButton
                        ]}
                        onPress={() => setFormType('user')}
                    >
                        <Text
                            style={[
                                styles.toggleButtonText,
                                formType === 'user' && styles.activeToggleButtonText
                            ]}
                        >
                            User Registration Form
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                {formType === 'ticket' ? <TicketRegistrationForm /> : <FormBuilder />}
            </View>
        </View>
    );
};

export default ParticipantRegistration;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    headerContainer: {
        marginBottom: 16,
    },
    headerTextContainer: {
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 24,
        color: '#9A93B3',
        fontWeight: '600',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#494949',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        overflow: 'hidden',
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    toggleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    activeToggleButton: {
        borderBottomWidth: 3,
        borderColor: '#4CAF50',
        backgroundColor: 'transparent',
    },
    activeToggleButtonText: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
    },
});

