import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useGlobalInfo } from "../../context/GlobalContext";
import { API_ROUTE } from "../../lib/config";


const Dashboard = () => {
    const { userId, changeEvent } = useGlobalInfo();
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;
    const router = useRouter();

    const eventPayload: any[] = [{
        cover_image: "https://res.cloudinary.com/dovrpnbxe/image/upload/v1747848227/cx1sxhgj7qigcsbh61gc.jpg",
        description: "This is the static description",
        end_date: "2025:05:22",
        end_time: "23:00",
        event_images: [
            "https://res.cloudinary.com/dovrpnbxe/image/upload/v1747848228/inpjgb3qysrzvman4cuw.jpg",
            "https://res.cloudinary.com/dovrpnbxe/image/upload/v1747848229/upjkuudpbge9ocigeh2u.jpg",
            "https://res.cloudinary.com/dovrpnbxe/image/upload/v1747848229/pbbucoabh47qtt2y6ibt.jpg"
        ],
        food_tracking: true,
        gift_tracking: true,
        location: "chennai",
        logo_image: "https://res.cloudinary.com/dovrpnbxe/image/upload/v1747848227/q9baewl0z1k9trnay0zc.jpg",
        name: "event_102",
        public_event: true,
        start_date: "2025:05:22",
        start_time: "19:00",
        user: "681bc76f713723b2769a6bf5"
    }];

    useEffect(() => {
        if (!userId) return;

        const fetchEvents = async () => {
            console.log("useEffect", API_ROUTE);
            try {
                const response = await fetch(`${API_ROUTE}/api/v1/event/userid/${userId}`);
                const result = await response.json();
                setEvents(result?.data || eventPayload);
            } catch (error) {
                console.error("Failed to fetch events", error);
                setEvents(eventPayload);
            }
        };

        fetchEvents();
    }, [userId]);

    const handleClick = (id: string) => {
        changeEvent(id)
        router.push(`/event-dashboard/${id}/`);
    };

    const paginatedEvents = events.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Top Cards */}
            <View style={styles.cardContainer}>
                <StatCard label="Events Completed" value="12" backgroundColor="#D1FAE5" />
                <StatCard label="Total Events" value="21" backgroundColor="#D6D1FA" />
                <StatCard label="Total Registration" value="22" backgroundColor="#FFDFDF" />
                <StatCard label="Total Participants" value="225" backgroundColor="#F8E5DA" />
            </View>

            {/* Event List */}
            <Text style={styles.title}>Latest Events</Text>
            <View style={styles.tableHeader}>
                <Text style={styles.tableCellHeader}>Name</Text>
                <Text style={styles.tableCellHeader}>Start Date</Text>
                <Text style={styles.tableCellHeader}>End Date</Text>
                <Text style={styles.tableCellHeader}>Public</Text>
            </View>

            {paginatedEvents.map((item, index) => (
                <TouchableOpacity key={index} style={styles.tableRow} onPress={() => handleClick(item._id)}>
                    <Text style={styles.tableCell}>{item.name}</Text>
                    <Text style={styles.tableCell}>
                        {new Date(item.start_date || item.startDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.tableCell}>
                        {new Date(item.end_date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.tableCell}>{item.public_event ? "Yes" : "No"}</Text>
                </TouchableOpacity>
            ))}


            {/* Pagination Buttons */}
            <View style={styles.pagination}>
                <TouchableOpacity
                    disabled={page === 0}
                    onPress={() => setPage((prev) => Math.max(prev - 1, 0))}
                >
                    <Text style={styles.pageBtn}>Prev</Text>
                </TouchableOpacity>
                <Text style={styles.pageLabel}>Page {page + 1}</Text>
                <TouchableOpacity
                    disabled={(page + 1) * rowsPerPage >= events.length}
                    onPress={() => setPage((prev) => prev + 1)}
                >
                    <Text style={styles.pageBtn}>Next</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const StatCard = ({ label, value, backgroundColor }) => (
    <View style={[styles.statCard, { backgroundColor }]}>
        {/* Replace this with <Image /> for icons if needed */}
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    cardContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        marginBottom: 20,
    },
    statCard: {
        width: "47%",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: "center",
    },
    statLabel: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: "700",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#140088",
        marginBottom: 10,
    },
    eventItem: {
        padding: 14,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 10,
    },
    eventName: {
        fontSize: 16,
        fontWeight: "600",
    },
    eventDate: {
        fontSize: 14,
        marginBottom: 4,
        color: "#555",
    },
    noData: {
        textAlign: "center",
        marginTop: 20,
        color: "#999",
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
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
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#dbeafe",
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
        paddingVertical: 18,
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

});

export default Dashboard;
