import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Button, Snackbar, Divider, IconButton } from 'react-native-paper';
// import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
// import PollResultsChart from '../../echarts/PollResultsChart'; // Replace with your RN-compatible chart

export default function CreatePoll() {
    const [modalOpen, setModalOpen] = useState(false);
    const [poll, setPoll] = useState({ question: '', options: [''] });
    const [snackbar, setSnackbar] = useState({
        visible: false,
        message: '',
        severity: 'success',
    });

    const questions = [
        {
            id: 1,
            question: 'Which feature do you like most?',
            results: [
                { label: 'Option A', count: 74779 },
                { label: 'Option B', count: 56565 },
                { label: 'Option C', count: 43837 },
                { label: 'Option D', count: 19027 },
            ],
            total: 507,
        },
        {
            id: 2,
            question: 'What is your preferred tool?',
            results: [
                { label: 'Tool X', count: 30567 },
                { label: 'Tool Y', count: 25000 },
                { label: 'Tool Z', count: 21000 },
                { label: 'Tool W', count: 12765 },
            ],
            total: 415,
        },
        {
            id: 3,
            question: 'Your go-to programming language?',
            results: [
                { label: 'Python', count: 60000 },
                { label: 'JavaScript', count: 58000 },
                { label: 'Java', count: 30000 },
                { label: 'C++', count: 20000 },
            ],
            total: 600,
        },
    ];

    const [selectedQuestionId, setSelectedQuestionId] = useState(questions[0].id);
    const [pollData, setPollData] = useState({
        total: questions[0].total,
        options: questions[0].results,
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            visible: true,
            message,
            severity,
        });
    };

    const handleQuestionSelect = (id) => {
        setSelectedQuestionId(id);
        const selected = questions.find((q) => q.id === id);
        if (selected) {
            setPollData({ total: selected.total, options: selected.results });
        }
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
        const validOptions = poll.options.filter((opt) => opt.trim() !== '');
        if (!poll.question.trim()) {
            showSnackbar('Poll question cannot be empty', 'error');
            return;
        }
        if (validOptions.length < 2) {
            showSnackbar('Please add at least two poll options.', 'error');
            return;
        }

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            showSnackbar('Poll created successfully!', 'success');
            setModalOpen(false);
            setPoll({ question: '', options: [''] });
        } catch (err) {
            showSnackbar('Failed to create poll', 'error');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Event Name</Text>

            {/* Dropdown and Create Poll Button */}
            <View style={styles.topRow}>
                <View style={styles.pickerContainer}>
                    {/* <Picker
                        selectedValue={selectedQuestionId}
                        onValueChange={(itemValue) => handleQuestionSelect(itemValue)}
                        mode="dropdown"
                    >
                        {questions.map((q) => (
                            <Picker.Item key={q.id} label={q.question} value={q.id} />
                        ))}
                    </Picker> */}
                </View>
                <Button mode="contained" onPress={() => setModalOpen(true)}>
                    Create Poll
                </Button>
            </View>

            {/* Chart */}
            {/* <PollResultsChart data={pollData} /> */}

            {/* Modal */}
            <Modal
                visible={modalOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Create a Poll</Text>
                        <TextInput
                            label="Enter your question"
                            value={poll.question}
                            onChangeText={(text) => setPoll({ ...poll, question: text })}
                            mode="outlined"
                            style={styles.input}
                        />
                        {poll.options.map((option, idx) => (
                            <TextInput
                                key={idx}
                                label={`Option ${idx + 1}`}
                                value={option}
                                onChangeText={(text) => handlePollChange(idx, text)}
                                mode="outlined"
                                style={styles.input}
                            />
                        ))}
                        <TouchableOpacity onPress={addPollOption}>
                            <Text style={styles.addOption}>+ Add Option</Text>
                        </TouchableOpacity>
                        <Divider style={{ marginVertical: 8 }} />
                        <View style={styles.modalButtonRow}>
                            <Button mode="outlined" onPress={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button mode="contained" onPress={handlePollSubmit}>
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
                action={{
                    label: 'Close',
                    onPress: () => setSnackbar((prev) => ({ ...prev, visible: false })),
                }}
            >
                {snackbar.message}
            </Snackbar>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        alignItems: 'center',
    },
    pickerContainer: {
        flex: 1,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    input: {
        marginBottom: 12,
    },
    addOption: {
        color: '#007bff',
        fontSize: 14,
        marginBottom: 8,
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
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
});
