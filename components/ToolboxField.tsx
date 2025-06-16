import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function ToolboxField({ type, icon, onPress }) {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(type)}>
            <View style={styles.content}>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={styles.type}>{type}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 8,
        paddingHorizontal: 12,
        margin: 4,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8 
    },
    icon: {
        fontSize: 16
    },
    type: {
        fontSize: 14
    }
});
