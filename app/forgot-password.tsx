import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Animated,
    Image,
    KeyboardAvoidingView,
    PanResponder,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { useGlobalInfo } from "../context/GlobalContext";

export default function ForgotPassword() {
    const { theme } = useGlobalInfo();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Swipe right gesture (for go back)
    const translateX = useRef(new Animated.Value(0)).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                if (gesture.dx > 0) {
                    translateX.setValue(gesture.dx);
                }
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx > 70) {
                    Animated.timing(translateX, {
                        toValue: 400,
                        duration: 150,
                        useNativeDriver: true,
                    }).start(() => {
                        router.back();
                    });
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handleSubmit = async () => {
        setError("");
        setMessage("");

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Invalid email address");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("https://your-api.com/api/send-reset-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("OTP sent successfully!");
                setTimeout(() => {
                    router.push("/otpVerify");
                }, 1000);
            } else {
                setError(data.message || "Failed to send OTP.");
            }
        } catch (err) {
            setError("Server error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={[styles.container, { backgroundColor: Colors[theme].background }]}
        >
            <Animated.View
                style={[
                    styles.card,
                    { backgroundColor: Colors[theme].card, transform: [{ translateX }] },
                ]}
                {...panResponder.panHandlers}
            >
                <View style={styles.header}>
                    <Image
                        source={require("../assets/images/logo-company.png")}
                        style={styles.logo}
                    />
                </View>

                <Text style={[styles.title, { color: Colors[theme].text }]}>
                    Forgot your password?
                </Text>
                <Text style={[styles.subtitle, { color: Colors[theme].secondaryText }]}>
                    Enter your email to receive an OTP.
                </Text>

                {error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : null}
                {message ? (
                    <Text style={styles.success}>{message}</Text>
                ) : null}

                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: Colors[theme].dropdownBackground,
                            borderColor: Colors[theme].secondaryText,
                            color: Colors[theme].text,
                        },
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors[theme].secondaryText}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: Colors[theme].button,
                            opacity: loading ? 0.7 : 1,
                        },
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={[styles.buttonText, { color: Colors[theme].buttonText }]}>
                        {loading ? "Sending..." : "Send OTP"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.goBack}
                    onPress={() => router.back()}
                >
                    <Text style={{ color: Colors[theme].button, fontWeight: "bold" }}>
                        Back to Login
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
    },
    logo: {
        width: 70,
        height: 70,
        resizeMode: "contain",
        marginTop: 12,
    },
    card: {
        width: "100%",
        padding: 20,
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 6,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        fontWeight: "600",
        fontSize: 16,
    },
    error: {
        color: "#e53935",
        marginBottom: 10,
        textAlign: "center",
    },
    success: {
        color: "green",
        marginBottom: 10,
        textAlign: "center",
    },
    goBack: {
        alignItems: "center",
        marginTop: 16,
    },
});
