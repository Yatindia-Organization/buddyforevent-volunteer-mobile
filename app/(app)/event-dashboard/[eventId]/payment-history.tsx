import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';

const mockData = [
    { id: '#15267', date: 'Mar 1, 2023', amount: 100, questions: 1, status: 'Success' },
    { id: '#153587', date: 'Jan 26, 2023', amount: 300, questions: 3, status: 'Success' },
    { id: '#12436', date: 'Feb 12, 2033', amount: 100, questions: 1, status: 'Success' },
    { id: '#16879', date: 'Feb 12, 2033', amount: 500, questions: 5, status: 'Success' },
    { id: '#16378', date: 'Feb 28, 2033', amount: 500, questions: 5, status: 'Rejected' },
    { id: '#16609', date: 'March 13, 2033', amount: 100, questions: 1, status: 'Success' },
    { id: '#16907', date: 'March 18, 2033', amount: 100, questions: 1, status: 'Pending' },
];

export default function PaymentHistory() {
    const [filter, setFilter] = useState('All');
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Success':
                return '#0A8754';
            case 'Pending':
                return '#2C96FF';
            case 'Rejected':
                return '#B00020';
            default:
                return '#000';
        }
    };

    const filteredData = mockData.filter((item) => {
        if (filter === 'All') return true;
        return item.status.toLowerCase() === filter.toLowerCase();
    });

    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Payment History</Text>

            {/* Earnings Summary */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.summaryCarousel}
            >
                {/* card #1 ---------------------------------------------------- */}
                <Card style={[styles.summaryCard, { backgroundColor: '#e9fef3' }]}>
                    <Card.Content>
                        <Text style={styles.summarySubtitle}>Total Earnings</Text>
                        <Text style={[styles.summaryAmount, { color: 'green' }]}>₹430.00</Text>
                        <Text style={styles.summaryCaption}>as of 1-December-2022</Text>
                    </Card.Content>
                </Card>
                {/* card #2 ---------------------------------------------------- */}
                <Card style={[styles.summaryCard, { backgroundColor: '#f0f7ff' }]}>
                    <Card.Content>
                        <Text style={styles.summarySubtitle}>Pending Payments</Text>
                        <Text style={[styles.summaryAmount, { color: 'blue' }]}>₹100.00</Text>
                        <Text style={styles.summaryCaption}>as of 1-December-2022</Text>
                    </Card.Content>
                </Card>
                {/* card #3 ---------------------------------------------------- */}
                <Card style={styles.summaryCard}>
                    <Card.Content>
                        <Text style={styles.summarySubtitle}>Withdrawal Method</Text>
                        <View style={styles.withdrawalRow}>
                            <Text style={styles.withdrawalText}>🏦 1502********4832</Text>
                            <View style={styles.iconRow}>
                                <IconButton icon="check-circle" iconColor="green" size={20} />
                                <IconButton icon="delete" iconColor="red" size={20} />
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>

            <Text style={styles.subtitle}>Payment History</Text>

            {/* Filter Chips */}
            <View style={styles.filterContainer}>
                {['All', 'Success', 'Pending', 'Rejected'].map((status) => (
                    <Chip
                        key={status}
                        selected={filter === status}
                        onPress={() => {
                            setFilter(status);
                            setPage(0); // reset page when filter changes
                        }}
                        style={styles.chip}
                    >
                        {status === 'Success' ? 'Complete' : status}
                    </Chip>
                ))}
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.headerCell]}>Order ID</Text>
                <Text style={[styles.cell, styles.headerCell]}>Date</Text>
                <Text style={[styles.cell, styles.headerCell]}>Amount</Text>
                <Text style={[styles.cell, styles.headerCell]}>Questions</Text>
                <Text style={[styles.cell, styles.headerCell]}>Status</Text>
            </View>

            {/* Table Body */}
            {paginatedData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                    <Text style={styles.cell}>{item.id}</Text>
                    <Text style={styles.cell}>{item.date}</Text>
                    <Text style={styles.cell}>₹{item.amount}</Text>
                    <Text style={styles.cell}>{item.questions}</Text>
                    <Text style={[styles.cell, { color: getStatusColor(item.status), fontWeight: '600' }]}>
                        {item.status}
                    </Text>
                </View>
            ))}

            {/* Pagination */}
            <View style={styles.pagination}>
                <TouchableOpacity
                    onPress={() => setPage((p) => Math.max(p - 1, 0))}
                    disabled={page === 0}
                >
                    <Text style={[styles.pageBtn, page === 0 && styles.disabledBtn]}>Prev</Text>
                </TouchableOpacity>

                <Text style={styles.pageLabel}>
                    Page {page + 1} of {totalPages}
                </Text>

                <TouchableOpacity
                    onPress={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                    disabled={page + 1 >= totalPages}
                >
                    <Text style={[styles.pageBtn, page + 1 >= totalPages && styles.disabledBtn]}>Next</Text>
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 8,
    },
    summaryContainer: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    summaryCard: {
        flex: 1,
        minWidth: 250,
        margin: 4,
    },
    summarySubtitle: {
        fontSize: 14,
        marginBottom: 4,
    },
    summaryAmount: {
        fontSize: 18,
        paddingVertical: 10,
        fontWeight: 'bold',

    },
    summaryCaption: {
        fontSize: 12,
        color: 'gray',
    },
    withdrawalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    withdrawalText: {
        fontSize: 14,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    chip: {
        marginRight: 8,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingVertical: 12,
    },
    cell: {
        flex: 1,
        fontSize: 13,
    },
    headerCell: {
        fontWeight: 'bold',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    pageBtn: {
        fontSize: 14,
        color: '#2C96FF',
    },
    disabledBtn: {
        color: '#ccc',
    },
    pageLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
});
