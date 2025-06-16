import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Image,
} from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useGlobalInfo } from "../context/GlobalContext";
import navItems from "../lib/config/navItems";

const SidebarMenu = () => {
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const segments = useSegments();

    const currentPath = "/" + segments.join("/");

    const { isLoggedIn, userType } = useGlobalInfo();

    // If user is not logged in, do not render the sidebar at all
    if (!isLoggedIn) {
        return null;
    }

    const items = userType ? navItems[userType] || [] : [];

    return (
        <View>
            {/* Toggle Button */}
            <TouchableOpacity onPress={() => setVisible(true)} style={styles.menuButton}>
                <Text style={styles.icon}>☰</Text>
            </TouchableOpacity>

            {/* Sidebar Menu */}
            <Modal
                transparent
                visible={visible}
                animationType="slide"
                onRequestClose={() => setVisible(false)} // Handles Android back button
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPressOut={() => setVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        {items.length === 0 ? (
                            <Text style={styles.noItemsText}>No navigation items available.</Text>
                        ) : (
                            items.map((item, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={[
                                        styles.menuItem,
                                        currentPath.startsWith(item.path) && styles.activeMenuItem
                                    ]}
                                    onPress={() => {
                                        setVisible(false);
                                        router.push(item.path);
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.icon }} // adjust if needed
                                        style={styles.iconImage}
                                    />
                                    <Text style={styles.menuText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    menuButton: {
        position: "absolute",
        top: 22,
        right: 20,
        zIndex: 100,
    },
    icon: {
        fontSize: 24,
        color: "#fff",
    },
    overlay: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    menuContainer: {
        width: 240,
        backgroundColor: "#fff",
        padding: 16,
        paddingTop: 48,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    noItemsText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        padding: 8,
        borderRadius: 6,
    },
    activeMenuItem: {
        backgroundColor: "#d0e0ff",
    },
    iconImage: {
        width: 20,
        height: 20,
        marginRight: 12,
        resizeMode: "contain",
    },
    menuText: {
        fontSize: 16,
    },
});

export default SidebarMenu;
