import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { useImagePicker } from "@/hooks/useImagePicker";
import { auth, db } from "../../../../firebaseConfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import Colors from "@/constants/Colors";

import { useUser } from "@/contexts/UserContext"; // <- make sure you import this

const DoctorVerification = () => {
  const { pickImage, uploadImage, isUploading } = useImagePicker();
  const { data } = useUser(); // <- get current user
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uri, setUri] = useState<string | null>(null);

  const isPending = data?.verification === "pending"; // <- flag for conditional UI

  const handlePickImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) setUri(imageUri);
  };

  const handleSubmit = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !uri) return;

    setIsSubmitting(true);

    try {
      const url = await uploadImage(uri, `licenses/${uid}.jpg`);
      if (!url) throw new Error("Upload failed");

      await setDoc(doc(db, "pendingVerifications", uid), {
        uid,
        licenseImage: url,
        submittedAt: new Date(),
      });

      await updateDoc(doc(db, "users", uid), {
        verification: "pending",
        licenseImage: url,
      });

      Alert.alert("Submitted", "Verification successfully submitted!");
    } catch (err) {
      console.error("Error submitting verification:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Stack.Screen
        options={{
          title: "Verification",
          headerTitleStyle: { fontFamily: "dm-sb" },
          headerTitleAlign: "center",
        }}
      />

      {isPending ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text
            style={{
              fontFamily: "dm-sb",
              fontSize: 18,
              color: "#333",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Your verification is currently pending.
          </Text>
          <Text
            style={{
              fontFamily: "dm",
              fontSize: 14,
              color: "#666",
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            We'll notify you once your license has been reviewed and approved.
          </Text>
        </View>
      ) : (
        <>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "dm-sb",
              marginBottom: 16,
              color: "#000",
            }}
          >
            Upload your medical license
          </Text>

          <Pressable
            onPress={handlePickImage}
            disabled={isUploading || isSubmitting}
            style={{
              width: 220,
              height: 220,
              backgroundColor: uri ? "transparent" : "#f1f1f1",
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
              overflow: "hidden",
            }}
          >
            {uri ? (
              <Image
                source={{ uri }}
                style={{ width: "100%", height: "100%", borderRadius: 16 }}
              />
            ) : isUploading ? (
              <ActivityIndicator />
            ) : (
              <Text style={{ fontFamily: "dm", color: "#888" }}>
                Tap to upload
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            disabled={!uri || isSubmitting || isUploading}
            style={{
              backgroundColor:
                !uri || isSubmitting || isUploading ? "#ccc" : Colors.green,
              paddingVertical: 12,
              borderRadius: 10,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "dm-sb",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Submit for Verification
              </Text>
            )}
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
};

export default DoctorVerification;
