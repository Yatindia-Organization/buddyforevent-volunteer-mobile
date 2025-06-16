import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Button, FlatList, SafeAreaView, ScrollView } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useGlobalInfo } from '../../context/GlobalContext';
import { getDefaultFieldSchema } from '../../lib/config/getDefaultFieldSchema';
import { API_ROUTE } from '../../lib/config';

import DraggableField from '../DraggableField';
import FieldSettings from '../FieldSettings';
import ToolboxField from '../ToolboxField';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const FIELD_TYPES = [
    { type: 'Input Field', icon: '🔤' },
    { type: 'Email', icon: '📧' },
    { type: 'Textarea', icon: '📝' },
    { type: 'Number Field', icon: '🔢' },
    { type: 'Select Menu', icon: '📋' },
    { type: 'Radio Button', icon: '🔘' },
    { type: 'Checkbox', icon: '☑️' },
    { type: 'URL', icon: '🔗' },
    { type: 'File Upload', icon: '📁' },
    { type: 'Date', icon: '📅' },
    { type: 'Label', icon: '🏷️' },
    { type: 'Terms & Condition', icon: '📜' }
];

export default function FormBuilder() {
    const context = useGlobalInfo();
    const [fields, setFields] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [finalSchema, setFinalSchema] = useState(null);

    const handleAddField = (type) => {
        const newField = getDefaultFieldSchema(type);
        setFields([...fields, newField]);
    };

    const handleReorder = ({ data }) => {
        setFields(data);
    };

    const handleSaveField = (updatedField) => {
        setFields(fields?.map(f => (f.id === updatedField.id ? updatedField : f)));
        setEditingId(null);
    };

    const handleProceed = async () => {
        const hasEmptyLabel = fields.some(field => !field.label || field.label.trim() === '');
        if (hasEmptyLabel) {
            Alert.alert('Validation Error', 'Please add labels to all fields.');
            return;
        }

        const schema = fields;
        setFinalSchema(schema);

        try {
            const body = {
                eventId: context?.event._id,
                fields: schema
            };

            const response = await fetch(`${API_ROUTE}/api/v1/even`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `Event creation failed with status ${response.status}`);
            }

            const result = await response.json();
            console.log("Event submitted successfully:", result);

            Alert.alert('Success', 'Successfully created a dynamic form.');
        } catch (error) {
            console.error("Error submitting event:", error.message);
            Alert.alert('Error', error.message);
        }
    };

    const handleCancel = () => {
        setFields([]);
        setEditingId(null);
        setFinalSchema(null);
    };

    const renderItem = ({ item, drag, isActive }) => (
        <View style={{ marginBottom: 8 }}>
            <TouchableOpacity onLongPress={drag}>
                <DraggableField
                    field={item}
                    onConfigure={() => setEditingId(item.id)}
                    onDelete={() => setFields(fields.filter(f => f.id !== item.id))}
                />
            </TouchableOpacity>
            {editingId === item.id && (
                <FieldSettings
                    field={item}
                    onSave={handleSaveField}
                    onCancel={() => setEditingId(null)}
                />
            )}
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Text style={styles.note}>
                        Please note that participants will receive email, SMS, and WhatsApp messages after registration.
                    </Text>

                    {/* Toolbox */}
                    <Text style={styles.header}>Add New Field</Text>
                    <View style={styles.toolbox}>
                        {FIELD_TYPES.map(({ type, icon }) => (
                            <ToolboxField
                                key={type}
                                type={type}
                                icon={icon}
                                onPress={() => handleAddField(type)}
                            />
                        ))}
                    </View>

                    {/* Form Designer */}
                    <Text style={styles.header}>Form Designer</Text>
                    {fields.length === 0 ? (
                        <Text style={styles.emptyText}>Tap fields above to build your form</Text>
                    ) : (
                        <DraggableFlatList
                            data={fields}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            onDragEnd={handleReorder}
                        />
                    )}

                    {/* Proceed / Cancel Buttons */}
                    {fields.length > 0 && (
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
                                <Text style={styles.buttonText}>Proceed</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Final JSON Schema Display */}
                    {Array.isArray(finalSchema) && finalSchema.length > 0 && (
                        <View style={styles.jsonContainer}>
                            <Text style={styles.header}>Final JSON Schema (In Order)</Text>
                            <ScrollView style={styles.jsonBox}>
                                <Text style={styles.jsonText}>{JSON.stringify(finalSchema, null, 2)}</Text>
                            </ScrollView>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { minHeight: 780, flex: 1, padding: 16 },
    note: { color: '#E36A6C', marginBottom: 8 },
    header: { fontSize: 18, fontWeight: 'bold', marginVertical: 8 },
    toolbox: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
    emptyText: { color: '#999', marginTop: 16 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
    proceedButton: { backgroundColor: 'green', padding: 12, borderRadius: 4 },
    cancelButton: { backgroundColor: 'red', padding: 12, borderRadius: 4 },
    buttonText: { color: '#fff' },
    jsonContainer: { marginTop: 16 },
    jsonBox: { backgroundColor: '#f2f2f2', padding: 12, borderRadius: 4, maxHeight: 300 },
    jsonText: { fontFamily: 'Courier', fontSize: 12 }
});
