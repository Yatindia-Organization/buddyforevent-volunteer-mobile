import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useGlobalInfo } from "../context/GlobalContext";
import navItems from "../lib/config/navItems";

const TopNavBar = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const { userType } = useGlobalInfo();
    const router = useRouter();
    const items = navItems[userType] || [];

    return (
        <View style={styles.navbar}>
            {/* Left: Menu Button */}
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>

            {/* Center: Title */}
            <Text style={styles.title}>Buddy For Events</Text>

            {/* Right: Icons */}
            <View style={styles.rightIcons}>
                <TouchableOpacity onPress={() => { }}>
                    <Text style={styles.icon}>🔔</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { router.push("/profile")}}>
                    <Text style={styles.icon}>👤</Text>
                </TouchableOpacity>
            </View>

            {/* Nav Items Modal */}
            <Modal transparent visible={menuVisible} animationType="slide">
                <TouchableOpacity
                    style={styles.overlay}
                    onPressOut={() => setMenuVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        {items.map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.menuItem}
                                onPress={() => {
                                    setMenuVisible(false);
                                    router.push(item.path);
                                }}
                            >
                                <Image
                                    source={{ uri: `https://your-cdn.com${item.icon}` }}
                                    style={styles.iconImage}
                                />
                                <Text style={styles.menuText}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        height: 90,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop:40,
        borderBottomWidth:1
    },
    menuIcon: {
        fontSize: 30,
        color: "#000",
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        flex: 1,
        marginLeft: 16,
    },
    rightIcons: {
        flexDirection: "row",
        gap: 12,
    },
    icon: {
        fontSize: 20,
        color: "#fff",
        marginLeft: 12,
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
        paddingTop: 40,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
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

export default TopNavBar;
