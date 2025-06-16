import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TextInput,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Alert as RNAlert
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Button, Snackbar, Card } from 'react-native-paper';
import { API_ROUTE } from '../../../../lib/config';
import { useGlobalInfo } from '../../../../context/GlobalContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Event() {
    const context = useGlobalInfo();
    const route = useRoute();
    const params: any = route.params || "";
    const id: string = params?.eventId
    const userId = context?.userId;


    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [poll, setPoll] = useState({ question: '', options: [''] });
    const [imageSize, setImageSize] = useState('medium');
    const [snackbar, setSnackbar] = useState({
        visible: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`${API_ROUTE}/api/v1/event/eventid/${id}`);
                if (!res.ok) throw new Error('Event not found');
                const data = await res.json();
                setEvent(data?.data);
            } catch (err) {
                console.error(err);
                setEvent(null);
            } finally {
                setLoading(false);
            }
            // console.log(event?.start_date, "this is the id of the event ")
        };

        fetchEvent();
    }, [id]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            visible: true,
            message,
            severity,
        });
    };

    const handlePollChange = (index, value) => {
        const newOptions = [...poll.options];
        newOptions[index] = value;
        setPoll({ ...poll, options: newOptions });
    };

    const addPollOption = () => {
        setPoll({ ...poll, options: [...poll.options, ''] });
    };

    const handlePollSubmit = async () => {
        const validOptions = poll.options.filter(opt => opt.trim() !== '');
        if (!poll.question.trim()) {
            showSnackbar('Poll question cannot be empty', 'error');
            return;
        }
        if (validOptions.length < 2) {
            showSnackbar('Please add at least two poll options.', 'error');
            return;
        }

        try {
            const payload = {
                event: id,
                question: poll.question.trim(),
                options: validOptions,
                userId,
            };
            const res = await fetch(`${API_ROUTE}/api/v1/event/poll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                showSnackbar('Poll created successfully!', 'success');
                setModalOpen(false);
                setPoll({ question: '', options: [''] });
            } else {
                throw new Error('Failed to create poll');
            }
        } catch (err) {
            showSnackbar(err.message, 'error');
        }
    };

    const getImageHeight = () => {
        switch (imageSize) {
            case 'small': return 150;
            case 'large': return 350;
            default: return 250;
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.notFoundTitle}>Event Not Found</Text>
                <Text style={styles.notFoundText}>The event you're looking for doesn't exist or has been removed.</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider >

            <SafeAreaView style={styles.container} >
                <ScrollView >
                    {/* LEFT */}
                    <Card style={styles.card}>
                        <Image
                            source={{ uri: event?.cover_image }}
                            style={[styles.coverImage, { height: getImageHeight() }]}
                            resizeMode="cover"
                        />
                        <Text style={styles.note}>Please enter a picture of size 1280 x 720 px</Text>

                        {/* Action Buttons */}
                        <View style={styles.actionRow}>
                            {['Edit Event', 'Edit Design', 'Preview'].map((label, index) => (
                                <TouchableOpacity key={index} style={styles.actionItem}>
                                    <Image source={{ uri: '/svg/edit.svg' }} style={styles.icon} />
                                    <Text style={styles.actionText}>{label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Links */}
                        <View style={styles.linkRow}>
                            <TouchableOpacity onPress={() => { }}>
                                <Text style={styles.linkText}>View Live Count</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { }}>
                                <Text style={styles.linkText}>Event Feedback</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalOpen(true)}>
                                <Text style={styles.linkText}>Add Live Poll</Text>
                            </TouchableOpacity>
                        </View>

                        {/* URLs */}
                        {['Live Update URL', 'Event Feedback URL', 'Live Poll URL'].map((label, idx) => (
                            <View key={idx} style={styles.urlRow}>
                                <Text style={styles.urlLabel}>{label}</Text>
                                <Text style={styles.urlValue} numberOfLines={1}>https://in.explara.com/e/abc-event-oejqyfepdf92ob5</Text>
                                <TouchableOpacity onPress={() => RNAlert.alert('Copied!')}>
                                    <Text style={styles.urlAction}>COPY</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/?text=https://in.explara.com/e/abc-event-oejqyfepdf92ob5')}>
                                    <Text style={styles.urlAction}>SHARE</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </Card>

                    {/* RIGHT */}
                    <Card style={styles.card}>
                        {/* Status Buttons */}
                        <View style={styles.statusRow}>
                            <Button mode="contained" style={{ backgroundColor: '#419B01' }}>PUBLISHED</Button>
                            <Button mode="contained" style={{ backgroundColor: '#2C96FF' }}>PAUSE EVENT</Button>
                            <Button mode="contained" style={{ backgroundColor: '#2C96FF' }}>CANCEL EVENT</Button>
                        </View>

                        {/* Logo */}
                        <View style={styles.logoRow}>
                            <Text style={styles.logoText}>EVENT LOGO</Text>
                            <Image source={{ uri: event?.logo_image }} style={styles.logoImage} />
                        </View>

                        {/* Description & Stats */}
                        <Text style={styles.sectionTitle}>EVENT DESCRIPTION</Text>
                        <Text>{event.description}</Text>

                        <Text style={styles.sectionTitle}>SALES OVERVIEW</Text>
                        <View style={styles.salesRow}>
                            {['REGISTERED', 'GUEST REGISTERED', 'VIEWS'].map((label, idx) => (
                                <View key={idx} style={styles.salesItem}>
                                    <Text style={styles.salesValue}>23</Text>
                                    <Text>{label}</Text>
                                </View>
                            ))}
                        </View>

                        <Text style={styles.sectionTitle}>EVENT OVERVIEW</Text>
                        <View style={styles.overviewRow}>
                            <Text>📍 CHENNAI</Text>
                        </View>
                        <View style={styles.overviewRow}>
                            <Text>📅 {event.start_date}</Text>
                        </View>
                        <View style={styles.overviewRow}>
                            <Text>⏰ {event.start_time}</Text>
                        </View>

                        {/* Chart */}
                        {/* <EventStatsChart /> */}
                    </Card>

                    {/* Poll Modal */}
                    <Modal
                        transparent
                        visible={modalOpen}
                        animationType="slide"
                        onRequestClose={() => setModalOpen(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Create a Poll</Text>
                                <TextInput
                                    value={poll.question}
                                    onChangeText={(text) => setPoll({ ...poll, question: text })}
                                    placeholder="Enter your question"
                                    style={styles.input}
                                />
                                {poll.options.map((option, idx) => (
                                    <TextInput
                                        key={idx}
                                        value={option}
                                        onChangeText={(text) => handlePollChange(idx, text)}
                                        placeholder={`Option ${idx + 1}`}
                                        style={styles.input}
                                    />
                                ))}
                                <TouchableOpacity onPress={addPollOption}>
                                    <Text style={styles.addOption}>+ Add Option</Text>
                                </TouchableOpacity>
                                <View style={styles.modalButtonRow}>
                                    <Button mode="outlined" onPress={() => setModalOpen(false)}>Cancel</Button>
                                    <Button
                                        mode="contained"
                                        disabled={!poll.question.trim() || poll.options.filter(o => o.trim()).length < 2}
                                        onPress={handlePollSubmit}
                                    >
                                        Submit
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Snackbar */}
                    <Snackbar
                        visible={snackbar.visible}
                        onDismiss={() => setSnackbar((prev) => ({ ...prev, visible: false }))}
                        duration={4000}
                    >
                        {snackbar.message}
                    </Snackbar>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>

    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 780,
        padding: 16,
        backgroundColor: '#f9f9f9',
        paddingVertical: 20
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFoundTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    notFoundText: {
        fontSize: 14,
        color: 'gray',
    },
    card: {
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    coverImage: {
        width: '100%',
        borderRadius: 8,
        marginBottom: 8,
    },
    note: {
        fontSize: 12,
        color: '#C11215',
        textAlign: 'center',
        marginBottom: 8,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    actionItem: {
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
    },
    actionText: {
        color: '#140088',
        fontSize: 14,
    },
    linkRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    linkText: {
        color: '#2A8BF2',
        textDecorationLine: 'underline',
        fontSize: 16,
    },
    urlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    urlLabel: {
        fontWeight: '600',
        width: '35%',
    },
    urlValue: {
        flex: 1,
        color: '#2A8BF2',
        textDecorationLine: 'underline',
    },
    urlAction: {
        marginLeft: 12,
        color: '#2A8BF2',
        fontWeight: '600',
    },
    statusRow: {
        flexDirection: 'row',
        fontSize: 10,
        marginBottom: 16,
    },
    logoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 16,
        color: '#140088',
        fontWeight: '600',
    },
    logoImage: {
        width: 80,
        height: 40,
        resizeMode: 'contain',
    },
    sectionTitle: {
        fontSize: 14,
        color: '#140088',
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 4,
    },
    salesRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    salesItem: {
        alignItems: 'center',
    },
    salesValue: {
        color: '#0CA31D',
        fontSize: 16,
        fontWeight: '600',
    },
    overviewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: 400,
        borderRadius: 8,
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
    },
    addOption: {
        color: '#2A8BF2',
        marginBottom: 8,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
});
