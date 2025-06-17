// src/components/TopNavBar.tsx

import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TopNavBar: React.FC = () => {
    const router = useRouter();

    return (
        <SafeAreaView >
            <View style={styles.container}>

                <Text style={styles.title}>Buddy For Events</Text>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => { }}>
                        <Text style={styles.actionIcon}>🔔</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/profile")}>
                        <Text style={styles.actionIcon}>👤</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        justifyContent: "space-between",
        borderBottomWidth: 1
    },
    menuButton: {
        fontSize: 24,
        color: "#fff",
    },
    title: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
        color: "#00000",
    },
    actions: {
        flexDirection: "row",
    },
    actionIcon: {
        fontSize: 20,
        color: "#fff",
        marginLeft: 16,
    },
});

export default TopNavBar;
