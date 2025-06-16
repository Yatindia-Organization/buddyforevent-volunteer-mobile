import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Slot, usePathname, useRouter } from "expo-router";
import { useGlobalInfo } from "@/context/GlobalContext";

export default function EventLayout() {
    const { event } = useGlobalInfo();
    const router = useRouter();
    const pathname = usePathname();

    const eventId = event

    const dashboardTabs = [
        { name: "Event Dashboard", path: `/event-dashboard/${eventId}` },
        { name: "Participant Registration", path: `/event-dashboard/${eventId}/participant-registration` },
        { name: "Bulk Ticket", path: `/event-dashboard/${eventId}/bulk-ticket` },
        { name: "Single Registration", path: `/event-dashboard/${eventId}/single-registration` },
        { name: "View Participants", path: `/event-dashboard/${eventId}/view-participants` },
        { name: "Payment History", path: `/event-dashboard/${eventId}/payment-history` },
        { name: "Email/Message", path: `/event-dashboard/${eventId}/email-message` },
        { name: "Reports", path: `/event-dashboard/${eventId}/reports` },
    ];


    const ROOT_PATH = `/event-dashboard/${eventId}`;
    const isTabActive = (tabPath: string) => {
        if (pathname === tabPath) return true;
        return tabPath !== ROOT_PATH && pathname.startsWith(`${tabPath}/`);
    };

    return (
        <View style={{}}>
            {/* Event Name */}
            <Text style={styles.header}>{event?.name || "Event Dashboard"}</Text>

            {/* Tab Links */}
            <ScrollView horizontal style={styles.tabs} showsHorizontalScrollIndicator={false}>
                {dashboardTabs.map((tab, index) => {
                    const isActive = isTabActive(tab.path);
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => router.push(tab.path)}
                            style={[styles.tabItem, isActive && styles.activeTab]}
                        >
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Nested Slot */}
            <View style={{}}>
                <Slot />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 16,
        backgroundColor: "#f1f5f9",
    },
    tabs: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        paddingHorizontal: 10,
    },
    tabItem: {
        marginRight: 16,
        paddingVertical: 16,
    },
    tabText: {
        fontSize: 14,
        color: "#666",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: "#2563eb",
    },
    activeTabText: {
        color: "#2563eb",
        fontWeight: "bold",
    },
});
