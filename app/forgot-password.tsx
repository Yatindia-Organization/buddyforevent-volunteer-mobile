import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        setError("");
        setMessage("");

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Invalid email address");
            return;
        }

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
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Forgot your password?</Text>
                <Text style={styles.subtitle}>Enter your email to receive an OTP.</Text>

                {error ? <Text style={styles.error}>{error}</Text> : null}
                {message ? <Text style={styles.success}>{message}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Send OTP</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    card: {
        width: "100%",
        padding: 20,
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 20,
        color: "#444",
    },
    input: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 8,
        paddingHorizontal: 4,
        marginBottom: 20,
        color: "#000",
    },
    button: {
        backgroundColor: "#000",
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    error: {
        color: "red",
        marginBottom: 10,
    },
    success: {
        color: "green",
        marginBottom: 10,
    },
});
