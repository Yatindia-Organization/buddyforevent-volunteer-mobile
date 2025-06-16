import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Settings: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Settings</Text>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', 
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
