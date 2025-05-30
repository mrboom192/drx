import { ActivityIndicator, Alert, Image, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "@/constants/Colors";
import { useImagePicker } from "@/hooks/useImagePicker";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { auth, db } from "../../../../firebaseConfig";

import { uploadFile } from "@/api/files";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import { useUserData } from "@/stores/useUserStore";

const DoctorVerification = () => {
  const { pickImage, isUploading } = useImagePicker();
  const userData = useUserData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uri, setUri] = useState<string | null>(null);

  const isPending = userData?.verification === "pending";
  const isVerified = userData?.verification === "verified";

  const handlePickImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) setUri(imageUri);
  };

  const handleSubmit = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !uri) return;

    setIsSubmitting(true);

    try {
      const url = await uploadFile(uri, `licenses/${uid}.jpg`);
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
      {isVerified ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <TextSemiBold
            style={{
              fontSize: 18,
              color: Colors.green,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            You're verified!
          </TextSemiBold>
          <TextRegular
            style={{
              fontSize: 14,
              color: "#444",
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            You’ve already been approved and are visible to patients.
          </TextRegular>
        </View>
      ) : isPending ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <TextSemiBold
            style={{
              fontSize: 18,
              color: "#333",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Your verification is currently pending.
          </TextSemiBold>
          <TextRegular
            style={{
              fontSize: 14,
              color: "#666",
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            We'll notify you once your license has been reviewed and approved.
          </TextRegular>
        </View>
      ) : (
        <>
          <TextSemiBold
            style={{
              fontSize: 18,
              marginBottom: 16,
              color: "#000",
            }}
          >
            Upload your medical license
          </TextSemiBold>

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
              <TextRegular style={{ color: "#888" }}>Tap to upload</TextRegular>
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
              <TextSemiBold
                style={{
                  color: "#fff",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Submit for Verification
              </TextSemiBold>
            )}
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
};

export default DoctorVerification;
