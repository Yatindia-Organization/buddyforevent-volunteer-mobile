import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function DraggableField({ field, onConfigure, onDelete }) {
    const [editingLabel, setEditingLabel] = useState(false);
    const [tempLabel, setTempLabel] = useState(field.label);

    const updateLabel = (label) => {
        field.label = label;
    };

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                {editingLabel ? (
                    <TextInput
                        value={tempLabel}
                        onChangeText={setTempLabel}
                        onBlur={() => {
                            setEditingLabel(false);
                            updateLabel(tempLabel);
                        }}
                        autoFocus
                        style={styles.input}
                    />
                ) : (
                    <TouchableOpacity onPress={() => setEditingLabel(true)}>
                        <Text style={styles.label}>{field.label || `${field.type} Name`}</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.buttons}>
                    <TouchableOpacity onPress={() => onConfigure(field.id)} style={styles.iconButton}>
                        {/* You can use react-native-vector-icons or an image, or emoji for now */}
                        <Text style={styles.icon}>⚙️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(field.id)} style={styles.iconButton}>
                        <Text style={styles.icon}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.description}>{field.description || 'Field Description'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DBEAFE', // blue-100
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        flex: 1,
        backgroundColor: 'transparent',
        paddingVertical: 4
    },
    label: {
        fontSize: 16
    },
    buttons: {
        flexDirection: 'row'
    },
    iconButton: {
        marginLeft: 12
    },
    icon: {
        fontSize: 18
    },
    description: {
        fontSize: 12,
        color: '#555',
        marginTop: 4
    }
});
