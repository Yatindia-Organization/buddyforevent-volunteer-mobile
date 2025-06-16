import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { API_ROUTE } from '../../../../lib/config/index';
import { useGlobalInfo } from '../../../../context/GlobalContext';

export default function AddParticipants() {
    const context = useGlobalInfo();

    const [excelData, setExcelData] = useState([]);

    const columnName = {
        eventId: "475asdfasdfa46d1fa78sd7f",
        userId: "798465sdfa6sdf6as",
        fields: [
            { label: "Name" },
            { label: "Email" },
            { label: "City", options: ["Hyd", "Chennai", "Delhi"] },
            { label: "Gender", options: ["Male", "Female"] }
        ]
    };

    const showToast = (message) => {
        Alert.alert('Notification', message);
    };

    const handleFileUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
            });

            if (result.type === 'cancel') return;

            const fileUri = result.uri;
            const fileName = result.name;
            if (!/\.(xls|xlsx)$/i.test(fileName)) {
                showToast("Invalid file format. Please upload an Excel file (.xls or .xlsx)");
                return;
            }

            const fileData = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const binaryData = Buffer.from(fileData, 'base64');
            const workbook = XLSX.read(binaryData, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const headers = rawData[0];
            const rows = rawData.slice(1);

            const requiredHeaders = columnName.fields.map(f => f.label);
            const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

            if (missingHeaders.length > 0) {
                showToast(`Missing required headers: ${missingHeaders.join(', ')}`);
                return;
            }

            const jsonData = rows.map((row) =>
                headers.reduce((acc, header, i) => {
                    acc[header] = row[i];
                    return acc;
                }, {})
            );

            setExcelData(jsonData);

            const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

            const response = await fetch(
                `${API_ROUTE}/api/v1/event/form-submission/event/${context?.eventId}/form/<formId>/upload-csv`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/csv' },
                    body: csvContent,
                }
            );

            if (response.ok) {
                showToast("File uploaded successfully!");
            } else {
                showToast("Upload failed. Please try again.");
            }
        } catch (err) {
            console.error("Upload error:", err);
            showToast("Upload failed. Server error.");
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const headers = columnName.fields.map(f => f.label);
            const ws = XLSX.utils.aoa_to_sheet([headers]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Template");

            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
            const fileUri = `${FileSystem.cacheDirectory}participants_template.xlsx`;

            await FileSystem.writeAsStringAsync(fileUri, wbout, {
                encoding: FileSystem.EncodingType.Base64,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                showToast("Sharing not available on this device");
            }
        } catch (err) {
            console.error("Download error:", err);
            showToast("Download failed. Server error.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} >
            <Text style={styles.title}> Bulk Registration </Text>

            < Text style={styles.description} >
                Issue tickets to your Participants without asking them to register online.
            </Text>

            < Text style={styles.warning} >
                Participants will receive email, SMS and WhatsApp notifications after registration.
            </Text>

            < View style={styles.card} >
                <Text style={styles.note}>
                    NOTE: Please download and use the sample Excel file.
                </Text>

                < TouchableOpacity onPress={handleDownloadTemplate} style={styles.downloadButton} >
                    <Text style={styles.downloadText}>⬇️ Download sample Excel </Text>
                </TouchableOpacity>

                < Text style={styles.note} >
                    Fill the downloaded file and upload it with your participant data.
                </Text>

                < TouchableOpacity style={styles.uploadBox} onPress={handleFileUpload} >
                    <Text style={styles.uploadIcon}>📤</Text>
                    < Text style={styles.uploadText} > Tap here to upload your Excel file </Text>
                    < Text style={styles.uploadNote} > Max file size: 1 MB </Text>
                </TouchableOpacity>
            </View>

            {
                excelData.length > 0 && (
                    <View style={styles.previewBox}>
                        <Text style={styles.previewTitle}> Uploaded Preview: </Text>
                        < ScrollView style={styles.previewContent} >
                            <Text style={styles.jsonText}> {JSON.stringify(excelData, null, 2)} </Text>
                        </ScrollView>
                    </View>
                )
            }
        </ScrollView>
    );


}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5D5C8D',
        marginBottom: 8,
    },
    description: {
        marginBottom: 4,
    },
    warning: {
        color: 'red',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        elevation: 2,
    },
    note: {
        marginBottom: 8,
        fontSize: 14,
    },
    downloadButton: {
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 4,
        marginBottom: 8,
    },
    downloadText: {
        color: '#007bff',
        textAlign: 'center',
    },
    uploadBox: {
        borderWidth: 2,
        borderColor: '#b3b3ff',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#fafafa',
    },
    uploadIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    uploadText: {
        color: '#007bff',
        textDecorationLine: 'underline',
        marginBottom: 4,
    },
    uploadNote: {
        fontSize: 12,
        color: '#666',
    },
    previewBox: {
        marginTop: 16,
    },
    previewTitle: {
        fontSize: 18,
        marginBottom: 8,
    },
    previewContent: {
        maxHeight: 300,
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 4,
    },
    jsonText: {
        fontFamily: 'Courier',
        fontSize: 12,
    },
});
