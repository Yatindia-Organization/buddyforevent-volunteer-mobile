import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Options from '../../components/Options';
import QRScanner from '../../components/qr-scanner';
import { useGlobalInfo } from '../../context/GlobalContext';

const Dashboard: React.FC = () => {
    const { qrData, changeQrData } = useGlobalInfo();
    const [scanning, setScanning] = useState(false);

    const handleScannerDone = (data: any | null) => {
        if (data) changeQrData(data);
        
        setScanning(false);
    };

    useEffect(() => {
        if (qrData) setScanning(false);
    }, [qrData]);

    const onScanPress = () => {
        if (scanning) {
            Alert.alert('Already scanning', 'Point the camera at a QR code.');
            return;
        }
        if (qrData) changeQrData('');
        setScanning(true);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.title}>Dashboard</Text>

                <TouchableOpacity style={styles.scanButton} onPress={onScanPress}>
                    <Text style={styles.scanButtonText}>Scan QR</Text>
                </TouchableOpacity>
            </View>

            {/* decide what to show */}
            {scanning
                ? (<View style={{ height: 580 }}>
                    <QRScanner onDone={handleScannerDone} />
                </View>)
                : qrData
                    ? <Options data={qrData} />
                    : <Text>Please tap “Scan QR” to begin</Text>
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: { fontSize: 24, fontWeight: 'bold' },
    scanButton: {
        backgroundColor: '#6200EE',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    scanButtonText: { color: '#fff', fontSize: 16 },
});

export default Dashboard;
