import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
    Switch,
    Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "../../lib/utils/cloudinary";
import { useGlobalInfo } from "../../context/GlobalContext";
import { Snackbar } from 'react-native-paper';
import { API_ROUTE } from "@/lib/config";

type ImageAsset = {
    uri: string;
    url?: string;
    [key: string]: any;
};

type FormDataType = {
    name: string;
    start_date: Date | null;
    end_date: Date | null;
    start_time: Date | null;
    end_time: Date | null;
    user: string | null;
    location: string;
    description: string;
    cover_image: ImageAsset | null;
    logo_image: ImageAsset | null;
    event_images: ImageAsset[];
    public_event: boolean;
    food_tracking: boolean;
    gift_tracking: boolean;
};

type PickerMode = "start_date" | "end_date" | "start_time" | "end_time" | null;


export default function CreateEvent() {
    const { userId } = useGlobalInfo();
    console.log(userId, "this is the userIds")
    const router = useRouter();

    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        start_date: null,
        end_date: null,
        start_time: null,
        end_time: null,
        user: userId,
        location: "",
        description: "",
        cover_image: null,
        logo_image: null,
        event_images: [],
        public_event: true,
        food_tracking: true,
        gift_tracking: true,
    });

    const [pickerMode, setPickerMode] = useState<PickerMode>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());
    const [iosPickerVisible, setIosPickerVisible] = useState(false);
    const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; color: string }>({
        visible: false,
        message: "",
        color: "red",
    });


    const handleChange = (name: keyof FormDataType, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const formatDate = (input: Date | string | null): string => {
        if (!input) return "";

        const date = typeof input === "string" ? new Date(input) : input;

        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
            date.getDate()
        ).padStart(2, "0")}`;
    };


    const formatTime = (date: Date) => {
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    };


    const handleImagePick = async (key: keyof Pick<FormDataType, "cover_image" | "logo_image" | "event_images">, multiple = false) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: multiple,
            quality: 0.7,
        });

        if (!result.canceled) {
            const selectedImages = multiple ? result.assets : [result.assets[0]];

            if (key === "event_images") {
                setFormData((prev) => ({
                    ...prev,
                    event_images: [...prev.event_images, ...selectedImages],
                }));
            } else {
                setFormData((prev) => ({ ...prev, [key]: selectedImages[0] }));
            }
        }
    };


    const showDatePicker = (field) => {
        const initialDate = formData[field] ? new Date(formData[field]) : new Date();
        setPickerMode(field);
        setTempDate(initialDate);
        if (Platform.OS === "ios") {
            setIosPickerVisible(true);
        } else {
            setShowPicker(true);
        }
    };


    const onDateTimeChange = (_event: any, selectedDate?: Date) => {
        if (Platform.OS === "android") {
            setShowPicker(false);
            if (selectedDate && pickerMode) {
                handleChange(pickerMode, selectedDate);
            }
        } else {
            if (selectedDate) {
                setTempDate(selectedDate);
            }
        }
    };

    const handleIOSPickerDone = () => {
        if (pickerMode) {
            handleChange(pickerMode, tempDate);
            setIosPickerVisible(false);
        }
    };


    const handleCreateEvent = async (payload: Omit<FormDataType, "cover_image" | "logo_image" | "event_images"> & {
        cover_image: string;
        logo_image: string;
        event_images: string[];
        start_date: string;
        end_date: string;
        start_time: string;
        end_time: string;
    }) => {
        const response = await fetch(`${API_ROUTE}/api/v1/event`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Event creation failed");
        const data = await response.json();
        return data;
    };


    const handleSubmit = async () => {
        const mandatoryFields = [
            "name",
            "location",
            "description",
            "cover_image",
            "logo_image",
            "start_date",
            "end_date",
            "start_time",
            "end_time",
        ];

        const missingFields = mandatoryFields.filter((field) => !formData[field]);
        if (missingFields.length > 0) {
            setSnackbar({
                visible: true,
                message: `Please fill in all required fields: ${missingFields.join(", ")}`,
                color: "red",
            });
            return;
        }

        try {
            setSnackbar({ visible: true, message: "Uploading images...", color: "blue" });

            // Upload cover image
            if (formData.cover_image?.uri) {
                const [uploadedCover] = await uploadToCloudinary([
                    {
                        uri: formData.cover_image.uri,
                        name: "cover.jpg",
                        type: "image/jpeg",
                    },
                ]);
                formData.cover_image = uploadedCover;
            }

            if (formData.logo_image?.uri) {
                const [uploadedLogo] = await uploadToCloudinary([
                    {
                        uri: formData.logo_image.uri,
                        name: "logo.jpg",
                        type: "image/jpeg",
                    },
                ]);
                formData.logo_image = uploadedLogo;
            }

            if (formData.event_images.length > 0) {
                const imageFiles = formData.event_images.map((img, index) => ({
                    uri: img.uri,
                    name: `event_${index}.jpg`,
                    type: "image/jpeg",
                }));

                const uploadedEventImages = await uploadToCloudinary(imageFiles);
                formData.event_images = uploadedEventImages;
            }



            // Prepare API payload
            const payload = {
                ...formData,
                cover_image: formData.cover_image,
                logo_image: formData.logo_image,
                event_images: formData.event_images,
                start_date: formatDate(formData.start_date),
                end_date: formatDate(formData.end_date),
                start_time: formatTime(formData.start_time),
                end_time: formatTime(formData.end_time),
            };

            // Send API request
            setSnackbar({ visible: true, message: "Creating event...", color: "blue" });
            console.log(payload, "this is payload")
            const response = await handleCreateEvent(payload);

            if (response.success) {
                setSnackbar({ visible: true, message: "Event created successfully!", color: "green" });
                router.replace("/dashboard");
            } else {
                throw new Error(response.message || "Event creation failed.");
            }
        } catch (error) {
            setSnackbar({ visible: true, message: error.message, color: "red" });
        }
    };


    const handleCancel = () => {
        router.back();
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 32 }}
        >
            <Text style={styles.heading}>Create Event</Text>

            {/* Event Name */}
            <TextInput
                style={styles.input}
                placeholder="Event Name *"
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
            />

            {/* Location */}
            <TextInput
                style={styles.input}
                placeholder="Location *"
                value={formData.location}
                onChangeText={(text) => handleChange("location", text)}
            />

            {/* Description */}
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description *"
                value={formData.description}
                onChangeText={(text) => handleChange("description", text)}
                multiline
            />

            {/* Images */}
            <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => handleImagePick("cover_image")}
            >
                <Text>Upload Cover Image *</Text>
                {formData.cover_image && (
                    <Image
                        source={{ uri: formData.cover_image.uri }}
                        style={styles.previewImage}
                    />
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => handleImagePick("logo_image")}
            >
                <Text>Upload Logo Image *</Text>
                {formData.logo_image && (
                    <Image
                        source={{ uri: formData.logo_image.uri }}
                        style={styles.previewImage}
                    />
                )}
            </TouchableOpacity>

            {/* Event images  */}

            <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => handleImagePick("event_images", true)}
            >
                <Text>Upload Event Images</Text>
                {formData.event_images.length > 0 && (
                    <ScrollView horizontal style={{ marginTop: 8 }}>
                        {formData.event_images.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img.uri }}
                                style={styles.eventImageThumbnail}
                            />
                        ))}
                    </ScrollView>
                )}
            </TouchableOpacity>

            {/* Date & Time */}
            <TouchableOpacity
                style={styles.input}
                onPress={() => showDatePicker("start_date")}
            >
                <Text style={styles.inputText}>
                    {formData.start_date
                        ? `Start Date: ${formatDate(formData.start_date)}`
                        : "Select Start Date *"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.input}
                onPress={() => showDatePicker("end_date")}
            >
                <Text style={styles.inputText}>
                    {formData.end_date
                        ? `End Date: ${formatDate(formData.end_date)}`
                        : "Select End Date *"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.input}
                onPress={() => showDatePicker("start_time")}
            >
                <Text style={styles.inputText}>
                    {formData.start_time
                        ? `Start Time: ${formatTime(formData.start_time)}`
                        : "Select Start Time *"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.input}
                onPress={() => showDatePicker("end_time")}
            >
                <Text style={styles.inputText}>
                    {formData.end_time
                        ? `End Time: ${formatTime(formData.end_time)}`
                        : "Select End Time *"}
                </Text>
            </TouchableOpacity>

            {showPicker && Platform.OS === "android" && (
                <DateTimePicker
                    value={tempDate}
                    mode={pickerMode?.includes("date") ? "date" : "time"}
                    is24Hour={true}
                    display="default"
                    onChange={onDateTimeChange}
                />
            )}

            {Platform.OS === "ios" && iosPickerVisible && (
                <View style={{ backgroundColor: "#fff", padding: 16 }}>
                    <DateTimePicker
                        value={tempDate}
                        mode={pickerMode.includes("date") ? "date" : "time"}
                        display="spinner"
                        onChange={onDateTimeChange}
                        style={{ height: 200 }}
                    />
                    <TouchableOpacity onPress={handleIOSPickerDone} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Food Tracking */}
            <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Food Tracking *</Text>
                <Switch
                    value={formData.food_tracking}
                    onValueChange={(val) => handleChange("food_tracking", val)}
                />
            </View>

            {/* Gift Tracking */}
            <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Gift Tracking *</Text>
                <Switch
                    value={formData.gift_tracking}
                    onValueChange={(val) => handleChange("gift_tracking", val)}
                />
            </View>

            {/* Public / Private */}
            <Text style={styles.subHeading}>Event Visibility *</Text>
            <View style={styles.radioContainer}>
                {[
                    { label: "Public", value: true },
                    { label: "Private", value: false },
                ].map((option) => (
                    <TouchableOpacity
                        key={option.label}
                        style={styles.radioRow}
                        onPress={() => handleChange("public_event", option.value)}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.radioButton,
                                formData.public_event === option.value && styles.radioButtonSelected,
                            ]}
                        />
                        <Text style={styles.radioLabel}>{option.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>

            <Snackbar
                visible={snackbar.visible}
                onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
                duration={3000}
                style={{ backgroundColor: snackbar.color }}
            >
                {snackbar.message}
            </Snackbar>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
    },
    subHeading: {
        fontSize: 16,
        fontWeight: "600",
        marginVertical: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 12,
        borderRadius: 6,
    },
    inputText: {
        color: "#000",
    },
    textArea: {
        height: 100,
    },
    eventImageThumbnail: {
        width: 80,
        height: 80,
        marginRight: 8,
        borderRadius: 6,
    },
    uploadBox: {
        borderWidth: 1,
        borderColor: "#aaa",
        padding: 12,
        borderRadius: 6,
        marginBottom: 12,
        alignItems: "center",
    },
    previewImage: {
        marginTop: 8,
        width: 100,
        height: 100,
        borderRadius: 6,
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    switchLabel: {
        fontSize: 16,
    },
    radioText: {
        fontSize: 16,
        color: "#333",
    },
    radioTextSelected: {
        color: "#fff",
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    cancelButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: "center",
        marginRight: 8,
    },
    cancelButtonText: {
        color: "#333",
        fontWeight: "600",
    },
    submitButton: {
        flex: 1,
        backgroundColor: "#007BFF",
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: "center",
        marginLeft: 8,
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    radioContainer: {
        flexDirection: "row",
        marginBottom: 16,
        justifyContent: "space-around",
    },
    radioRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#ccc",
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    radioButtonSelected: {
        backgroundColor: "#007BFF",
        borderColor: "#007BFF",
    },
    radioLabel: {
        fontSize: 16,
        color: "#333",
    },

});
