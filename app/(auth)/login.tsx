import React, { useState } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Image,
    Animated,
    Easing,
    TouchableOpacity
} from "react-native";
import { Button } from 'react-native-paper';
import { useGlobalInfo } from "@/context/GlobalContext";
import { API_ROUTE } from "@/lib/config";
import { router } from "expo-router";


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const slideAnim = useState(new Animated.Value(-100))[0];

    const { changeIsLoggedIn, changeUserType, changeUserId } = useGlobalInfo();

    const showTopSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();

        setTimeout(() => {
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.in(Easing.ease),
            }).start(() => setSnackbarVisible(false));
        }, 3000);
    };

    const validateInputs = () => {
        const newErrors: typeof errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) newErrors.email = "Email is required";
        else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";

        if (!password.trim()) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Min 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateInputs()) return;

        try {
            const response = await fetch(`${API_ROUTE}/api/v1/auth/sign-in`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {

                const userTypeFromApi = data?.data?.existingUser?.user_type;

                if (userTypeFromApi) {
                    // Update global context
                    changeUserType(userTypeFromApi);
                    changeIsLoggedIn(true);
                    changeUserId(data?.data?.existingUser?._id);

                    router.replace("/dashboard");

                } else {
                    showTopSnackbar("User type not found. Cannot continue.");
                }
            } else {
                const errorMessage = data.message || "Invalid email or password";
                showTopSnackbar(errorMessage);
            }
        } catch (error) {
            console.error("Login error:", error);
            showTopSnackbar("An error occurred. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../../assets/images/logo-company.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Buddyforevent</Text>
            </View>

            <TextInput
                placeholder="Email"
                style={styles.input}
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                }}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                }}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TouchableOpacity
                onPress={() => router.push("/forgot-password")}
                style={styles.forgotPasswordContainer}
            >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                labelStyle={styles.loginButtonLabel}
            // loading={loading}
            >
                Login
            </Button>


            {snackbarVisible && (
                <Animated.View
                    style={[styles.snackbar, { transform: [{ translateY: slideAnim }] }]}
                >
                    <Text style={styles.snackbarText}>{snackbarMessage}</Text>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
        resizeMode: "contain",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 15,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    error: {
        color: "red",
        marginBottom: 12,
    },
    forgotPasswordContainer: {
        alignItems: "flex-end",
        marginBottom: 10,
    },
    forgotPasswordText: {
        color: "#6200ee",
        fontSize: 14,
        fontWeight: "bold",
    },
    loginButton: {
        marginTop: 10,
        paddingVertical: 8,
        backgroundColor: "#000",
        borderRadius: 6,
    },
    loginButtonLabel: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    snackbar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#e53935",
        padding: 14,
        zIndex: 1000,
        alignItems: "center",
    },
    snackbarText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
