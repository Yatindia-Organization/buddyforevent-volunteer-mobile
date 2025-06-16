import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { Avatar, TextInput, Button, Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Profile() {
    const initialData = {
        firstName: 'Yash',
        lastName: 'Ghori',
        email: 'yghori@asite.com',
        phone: '9172048144030',
        nationality: 'India',
        designation: 'UI Intern',
    };

    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
            Alert.alert('Validation Error', 'Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setLoading(false);
            Alert.alert('Success', 'Profile updated successfully!');
            setEditMode(false);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Failed to update profile.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.cardContainer}>
                <View style={styles.header}>
                    <Avatar.Text size={80} label={`${formData.firstName[0]}${formData.lastName[0]}`} />
                    <Text style={styles.name}>{formData.firstName} {formData.lastName}</Text>
                    <Text style={styles.designation}>{formData.designation}</Text>
                </View>

                <View style={styles.detailsSection}>
                    <View style={styles.detailsRow}>
                        <MaterialCommunityIcons name="email-outline" size={20} />
                        <Text style={styles.detailsText}>{formData.email}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <MaterialCommunityIcons name="phone" size={20} />
                        <Text style={styles.detailsText}>{formData.phone}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <MaterialCommunityIcons name="flag-outline" size={20} />
                        <Text style={styles.detailsText}>{formData.nationality}</Text>
                    </View>
                </View>

                <View style={styles.editButtonContainer}>
                    <Button
                        mode="outlined"
                        onPress={() => setEditMode(!editMode)}
                        icon={editMode ? 'close' : 'pencil'}
                    >
                        {editMode ? 'Cancel' : 'Edit'}
                    </Button>
                </View>

                {editMode && (
                    <View style={styles.formContainer}>
                        <TextInput
                            label="First Name"
                            value={formData.firstName}
                            onChangeText={(text) => handleChange('firstName', text)}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TextInput
                            label="Last Name"
                            value={formData.lastName}
                            onChangeText={(text) => handleChange('lastName', text)}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TextInput
                            label="Email"
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                            style={styles.input}
                            mode="outlined"
                            keyboardType="email-address"
                        />
                        <TextInput
                            label="Phone"
                            value={formData.phone}
                            onChangeText={(text) => handleChange('phone', text)}
                            style={styles.input}
                            mode="outlined"
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            label="Nationality"
                            value={formData.nationality}
                            onChangeText={(text) => handleChange('nationality', text)}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TextInput
                            label="Designation"
                            value={formData.designation}
                            onChangeText={(text) => handleChange('designation', text)}
                            style={styles.input}
                            mode="outlined"
                        />

                        <Button
                            mode="contained"
                            onPress={handleSave}
                            loading={loading}
                            style={styles.saveButton}
                        >
                            Save
                        </Button>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    cardContainer: {
        padding: 16,
        borderRadius: 8,
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: '600',
        marginTop: 8,
        color: '#333', 
    },
    designation: {
        fontSize: 16,
        color: '#666',
    },
    detailsSection: {
        marginTop: 16,
        marginBottom: 8,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    detailsText: {
        fontSize: 14,
        color: '#555',
    },
    editButtonContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    formContainer: {
        marginTop: 8,
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#fff', 
    },
    saveButton: {
        marginTop: 16,
        borderRadius: 6, 
        backgroundColor: '#6200ee', 
    },
    cancelButton: {
        marginTop: 8,
        borderRadius: 6,
        borderColor: '#6200ee',
        borderWidth: 1,
    },
    saveButtonLabel: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButtonLabel: {
        color: '##333',
        fontWeight: 'bold',
    },
});

