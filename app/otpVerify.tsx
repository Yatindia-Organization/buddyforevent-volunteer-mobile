import React, { useState, useRef } from "react";
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

export default function OtpVerify() {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [error, setError] = useState("");
    const inputRefs = useRef([]);

    const router = useRouter();

    const handleChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only allow last character
        setOtp(newOtp);

        // Move to next input if available
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleSubmit = async () => {
        const enteredOtp = otp.join("");

        if (enteredOtp.length !== 4) {
            setError("Please enter the complete OTP");
            return;
        }

        try {
            const res = await fetch("https://your-api.com/api/verify-reset-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp: enteredOtp }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/reset-password");
            } else {
                setError(data.message || "Invalid OTP");
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
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.subtitle}>A 4-digit code was sent to your email.</Text>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(value) => handleChange(value, index)}
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Verify OTP</Text>
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
    error: {
        color: "red",
        marginBottom: 10,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    otpInput: {
        width: 50,
        height: 50,
        borderBottomWidth: 2,
        borderColor: "#ccc",
        fontSize: 18,
        textAlign: "center",
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
});
