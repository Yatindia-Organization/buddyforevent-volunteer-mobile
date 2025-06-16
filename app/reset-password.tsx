import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useRouter } from "expo-router";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const evaluateStrength = (pwd: string) => {
        if (pwd.length < 6) return "Weak";
        if (/\d/.test(pwd) && /[A-Z]/.test(pwd) && /[!@#$%^&*]/.test(pwd))
            return "Strong";
        return "Medium";
    };

    const handleSubmit = async () => {
        setError("");
        setMessage("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            const res = await fetch("https://your-api.com/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Password reset successfully");
                setTimeout(() => {
                    router.push("/login");
                }, 1000);
            } else {
                setError(data.message || "Failed to reset password");
            }
        } catch {
            setError("Server error. Try again.");
        }
    };

    const handleChange = (pwd: string) => {
        setPassword(pwd);
        setStrength(evaluateStrength(pwd));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Reset your password</Text>
                <Text style={styles.subtitle}>Choose a new secure password.</Text>

                {error ? <Text style={styles.error}>{error}</Text> : null}
                {message ? <Text style={styles.success}>{message}</Text> : null}

                <TextInput
                    placeholder="New Password"
                    secureTextEntry
                    value={password}
                    onChangeText={handleChange}
                    style={styles.input}
                    placeholderTextColor="#666"
                />

                {password ? (
                    <Text
                        style={[
                            styles.strength,
                            strength === "Strong"
                                ? styles.strong
                                : strength === "Medium"
                                    ? styles.medium
                                    : styles.weak,
                        ]}
                    >
                        Strength: {strength}
                    </Text>
                ) : null}

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Reset Password</Text>
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
        paddingVertical: 10,
        paddingHorizontal: 4,
        marginBottom: 16,
        color: "#000",
    },
    button: {
        backgroundColor: "#000",
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: "center",
        marginTop: 10,
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
    strength: {
        fontSize: 14,
        marginBottom: 10,
    },
    weak: {
        color: "red",
    },
    medium: {
        color: "orange",
    },
    strong: {
        color: "green",
    },
});
