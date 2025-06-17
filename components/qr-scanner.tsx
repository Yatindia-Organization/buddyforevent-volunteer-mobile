// import { API_ROUTE } from '@/lib/config';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import { useState } from 'react';
// import { Alert, Button, StyleSheet, View } from 'react-native';


// type Props = { onDone: (json: any) => void };

// export default function Scanner({ onDone }: Props) {
//     const [perm, askPerm] = useCameraPermissions();
//     const [paused, setPaused] = useState(false);
//     const [loading, setLoading] = useState(false);

//     if (!perm) return <View />;
//     if (!perm.granted) return <Button title="Grant camera" onPress={askPerm} />;

//     const handleScan = async ({ data }: { data: string }) => {
//         setPaused(true);
//         setLoading(true);
//         try {
//             const res = await fetch(`${API_ROUTE}/${data.trim()}`);
//             if (!res.ok) throw new Error(`API ${res.status}`);
//             const json = await res.json();
//             console.log(json)
//         } catch (e: any) {
//             Alert.alert('Error', e.message);
//             setPaused(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <CameraView
//             style={StyleSheet.absoluteFill}
//             onBarcodeScanned={paused ? undefined : handleScan}
//             barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
//         />

//     );
// }

// const styles = StyleSheet.create({
//     overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
//     actions: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
// });



import { API_ROUTE } from '@/lib/config';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';

type Props = { onDone: (data: any | null) => void };

export default function Scanner({ onDone }: Props) {
    const [perm, askPerm] = useCameraPermissions();
    const [paused, setPaused] = useState(false);
    const isProcessing = useRef(false);   // ← instant, no re-render

    if (!perm) return <View />;
    if (!perm.granted) return <Button title="Grant camera" onPress={askPerm} />;

    const handleScan = async ({ data }: { data: string }) => {
        if (isProcessing.current) return;           // ignore extra frames
        isProcessing.current = true;                // lock immediately
        setPaused(true);                            // stop future scans

        try {
            const res = await fetch(`${API_ROUTE}/${data.trim()}`);
            if (!res.ok) throw new Error('invalid');  // server said “bad”

            const json = await res.json();
            onDone(json);                             // ✓ success
        } catch {
            Alert.alert('QR is invalid', 'Please try again.');
            isProcessing.current = false;             // unlock
            setPaused(false);                         // resume scanning
            onDone(null);                             // notify parent
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

