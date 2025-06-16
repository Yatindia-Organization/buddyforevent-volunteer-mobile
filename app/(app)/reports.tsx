import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Linking,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Card, IconButton, Divider } from 'react-native-paper';
// import * as Clipboard from 'expo-clipboard';

const urlItems = [
    { label: 'LIVE UPDATE URL', url: 'https://in.explara.com/e/abc-event-qeajeyfepdf92ob5' },
    { label: 'EVENT FEEDBACK URL', url: 'https://in.explara.com/e/abc-event-qeajeyfepdf92ob5' },
    { label: 'LIVE POLL URL', url: 'https://in.explara.com/e/abc-event-qeajeyfepdf92ob5' },
];

const tableData = [
    { id: '#15267', date: 'Mar 1, 2023', participant: 100, details: 1 },
    { id: '#153587', date: 'Jan 26, 2023', participant: 300, details: 3 },
    { id: '#12436', date: 'Feb 12, 2033', participant: 100, details: 1 },
    { id: '#16879', date: 'Feb 12, 2033', participant: 500, details: 5 },
    { id: '#16378', date: 'Feb 28, 2033', participant: 500, details: 5 },
    { id: '#16609', date: 'March 13, 2033', participant: 100, details: 1 },
    { id: '#16907', date: 'March 18, 2033', participant: 100, details: 1 },
];

export default function Report() {
    const handleCopy = async (text) => {
        // await Clipboard.setStringAsync(text);
        Alert.alert('Copied to clipboard');
    };

    const handleShare = (url) => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
        Linking.openURL(whatsappUrl);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Event Report</Text>

            {/* URL Sections */}
            <Card style={styles.card}>
                {urlItems.map((item, i) => (
                    <View key={i} style={styles.urlRow}>
                        <Text style={styles.urlLabel}>{item.label}</Text>
                        <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                            <Text style={styles.urlLink}>{item.url}</Text>
                        </TouchableOpacity>
                        <IconButton
                            icon="content-copy"
                            size={20}
                            onPress={() => handleCopy(item.url)}
                        />
                        <IconButton
                            icon="whatsapp"
                            size={20}
                            iconColor="green"
                            onPress={() => handleShare(item.url)}
                        />
                    </View>
                ))}
            </Card>

            {/* Tabs-like Links */}
            <View style={styles.linkRow}>
                <TouchableOpacity onPress={() => Alert.alert('Link Clicked')}>
                    <Text style={styles.tabLink}>View Live Count</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Link Clicked')}>
                    <Text style={styles.tabLink}>Event FeedBack</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Link Clicked')}>
                    <Text style={styles.tabLink}>Add Live Poll</Text>
                </TouchableOpacity>
            </View>


            <Card style={styles.card}>
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Event Name</Text>
                    <Text style={styles.tableHeaderCell}>Time</Text>
                    <Text style={styles.tableHeaderCell}>Participant</Text>
                    <Text style={styles.tableHeaderCell}>Event Details</Text>
                </View>
                <Divider />
                {tableData.map((row, idx) => (
                    <View key={idx} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{row.id}</Text>
                        <Text style={styles.tableCell}>{row.date}</Text>
                        <Text style={styles.tableCell}>{row.participant}</Text>
                        <Text style={styles.tableCell}>{row.details}</Text>
                    </View>
                ))}
            </Card>

            {/* Pagination UI (static) */}
            <View style={styles.pagination}>
                <TouchableOpacity onPress={() => Alert.alert('Previous Page')}>
                    <Text style={styles.pageBtn}>Prev</Text>
                </TouchableOpacity>
                <Text style={styles.pageLabel}>Page 1</Text>
                <TouchableOpacity onPress={() => Alert.alert('Next Page')}>
                    <Text style={styles.pageBtn}>Next</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    card: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    urlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    linkRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    paginationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    paginationLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paginationRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paginationInput: {
        width: 50,
        height: 40,
        marginRight: 8,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#000000',
    },
    urlLabel: {
        width: 150,
        fontWeight: '600',
        fontSize: 12,
        color: '#000000',
    },
    urlLink: {
        color: '#0066cc',
        textDecorationLine: 'underline',
        marginRight: 8,
    },
    tabLink: {
        color: '#0066cc',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    tableHeaderCell: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 12,
        color: '#000000',
    },
    paginationText: {
        fontSize: 12,
        marginRight: 8,
        color: '#000000',
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#dbeafe",
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    tableCellHeader: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 14,
        color: "#1e3a8a",
    },
    tableCell: {
        flex: 1,
        fontSize: 13,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        alignItems: "center",
    },
    pageBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "#eee",
        borderRadius: 4,
    },
    pageLabel: {
        fontWeight: "bold",
    },

});
