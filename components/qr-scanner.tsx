import { API_ROUTE } from '@/lib/config';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';

type Props = { onDone: (data: any | null) => void };

export default function Scanner({ onDone }: Props) {
    const [perm, askPerm] = useCameraPermissions();
    const [paused, setPaused] = useState(false);
    const isProcessing = useRef(false);

    if (!perm) return <View />;
    if (!perm.granted) return <Button title="Grant camera" onPress={askPerm} />;

    const handleScan = async ({ data }: { data: string }) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        setPaused(true);

        try {
            console.log(data, " this is the UUID")
            const res = await fetch(`${API_ROUTE}/api/v1/event/handleQR/scan/${data.trim()}/activity`);
            if (!res.ok) throw new Error('invalid');

            const json = await res.json();
            console.log(json, "this is the JSON ");

            onDone(json);
        } catch {
            Alert.alert('QR is invalid', 'Please try again.');
            isProcessing.current = false;
            setPaused(false);
            onDone(null);
        }
    };

    return (
        <CameraView
            style={StyleSheet.absoluteFill}
            onBarcodeScanned={paused ? undefined : handleScan}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
    );
}

