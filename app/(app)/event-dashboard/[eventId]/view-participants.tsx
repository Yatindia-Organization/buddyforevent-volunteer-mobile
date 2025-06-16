
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Button, Chip, Menu } from 'react-native-paper';
import { useGlobalInfo } from '../../../../context/GlobalContext';
import { API_ROUTE } from '../../../../lib/config';

export default function Participants() {
    const context = useGlobalInfo();

    const [filter, setFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [participantData, setParticipantData] = useState([]);

    const [menuVisible, setMenuVisible] = useState(false);

    const getBoxStyle = (value) => {
        if (value === 'YES') return styles.yesBox;
        if (value === 'NO') return styles.noBox;
        return styles.maybeBox;
    };

    const isPresent = (entry, exit) => {
        return entry !== '00:00' && exit !== '00:00';
    };

    const filteredData = participantData.filter((row) => {
        if (filter === 'All') return true;
        if (filter === 'Present') return isPresent(row.entryTime, row.exitTime);
        if (filter === 'Not Present') return !isPresent(row.entryTime, row.exitTime);
        return true;
    });

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(value);
        setPage(1);
        setMenuVisible(false);
    };

    const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${API_ROUTE}/api/v1/event/form-submission`);
                const result = await response.json();
                const filteredData = result.filter(
                    (item) => item?.eventId === '6647159f56a4bfcf3a4f21d3'
                );
                setParticipantData(filteredData);
            } catch (error) {
                console.error('Failed to fetch the data ', error);
            }
        };

        fetchContent();
    }, []);

    const renderParticipant = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.responses[0]?.value || 'N/A'}</Text>
            <Text style={styles.cell}>{item.entryTime || 'Not Entered'}</Text>
            <Text style={styles.cell}>{item.exitTime || 'Not Left'}</Text>
            <View style={[styles.cell, getBoxStyle(item.gift)]}>
                <Text>{item.gift || 'NO'}</Text>
            </View>
            <View style={[styles.cell, getBoxStyle(item.food)]}>
                <Text>{item.food || 'NO'}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.subtitle}>Event Participant live data</Text>
            <Text style={styles.title}>Participant Overview</Text>

            <View style={styles.filterContainer}>
                {['All', 'Present', 'Not Present'].map((option) => (
                    <Chip
                        key={option}
                        selected={filter === option}
                        onPress={() => setFilter(option)}
                        style={styles.chip}
                    >
                        {option}
                    </Chip>
                ))}
            </View>

            <View style={styles.tableHeader}>
                <Text style={styles.tableCellHeader}>Name</Text>
                <Text style={styles.tableCellHeader}>Entry Time</Text>
                <Text style={styles.tableCellHeader}>Exit Time</Text>
                <Text style={styles.tableCellHeader}>Gift</Text>
                <Text style={styles.tableCellHeader}>Food</Text>
            </View>

            {paginatedData.map((item, index) => (
                <TouchableOpacity key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.responses[0]?.value || 'N/A'}</Text>
                    <Text style={styles.tableCell}>{item.entryTime || 'Not Entered'}</Text>
                    <Text style={styles.tableCell}>{item.exitTime || 'Not Left'}</Text>
                    <Text style={[styles.tableCell, item.gift === 'YES' ? styles.yesBox : styles.noBox]}>
                        {item.gift || 'NO'}
                    </Text>
                    <Text style={[styles.tableCell, item.food === 'YES' ? styles.yesBox : styles.noBox]}>
                        {item.food || 'NO'}
                    </Text>
                </TouchableOpacity>
            ))}

            <View style={styles.pagination}>
                <TouchableOpacity
                    disabled={page === 0}
                    onPress={() => setPage((prev) => Math.max(prev - 1, 0))}
                >
                    <Text style={styles.pageBtn}>Prev</Text>
                </TouchableOpacity>
                <Text style={styles.pageLabel}>Page {page + 1}</Text>
                <TouchableOpacity
                    disabled={(page + 1) * rowsPerPage >= filteredData.length}
                    onPress={() => setPage((prev) => prev + 1)}
                >
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
    subtitle: {
        color: 'gray',
        marginBottom: 4,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    chip: {
        marginRight: 8,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingVertical: 4,
    },
    cell: {
        flex: 1,
        paddingHorizontal: 4,
        fontSize: 12,
    },
    headerCell: {
        fontWeight: 'bold',
    },
    maybeBox: {
        backgroundColor: '#fff5cc',
        alignItems: 'center',
        borderRadius: 4,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    tableCellHeader: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 13,
        paddingHorizontal: 6,
    },
    tableCell: {
        flex: 1,
        fontSize: 13,
        paddingHorizontal: 6,
    },
    yesBox: {
        color: '#007B00',
    },
    noBox: {
        color: '#B00020',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    pageBtn: {
        fontSize: 14,
        color: '#007BFF',
    },
    pageLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },

});
