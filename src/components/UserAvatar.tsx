import Avatar from "./Avatar";
import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { auth, db, storage } from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const UserAvatar = ({
  size,
  canUpload = false,
}: {
  size: number;
  canUpload?: boolean;
}) => {
  const { data } = useUser();
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    if (isUploading) return; // prevent spamming while uploading or during picker load
    setIsUploading(true); // lock interaction before picker opens

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.01,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        const manipulated = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 200, height: 200 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );

        await uploadImage(manipulated.uri);
      }
    } catch (err) {
      console.error("Image picking failed:", err);
    } finally {
      setIsUploading(false); // unlock after picker closes or error
    }
  };

  async function uploadImage(imageUri: string) {
    let uploadedImageURL: string | null = null;
    const uid = auth.currentUser?.uid;

    // Upload image if exists
    if (imageUri) {
      const fileRef = ref(storage, `users/${uid}.jpg`);

      const blob: Blob = await new Promise<Blob>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", imageUri, true);
        xhr.send(null);
      });

      try {
        await uploadBytes(fileRef, blob);
        console.log("Ran"); // Only logs if successful
      } catch (error) {
        console.error("uploadBytes failed:", error);
      }

      // Clean up blob (optional chaining for safety)
      // @ts-ignore
      blob.close?.();

      uploadedImageURL = await getDownloadURL(fileRef);
    }

    // Update or set the user document in Firestore
    const userRef = doc(db, "users", uid as string);

    try {
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Update existing user document
        await updateDoc(userRef, {
          image: uploadedImageURL,
        });
      }
    } catch (error) {
      console.error("Error updating Firestore user doc:", error);
    }

    setIsUploading(false);
  }

  return (
    <View
      style={{
        position: "relative",
        width: size,
        height: size,
      }}
    >
      <Avatar
        size={size}
        initials={`${data.firstName[0]}${data.lastName[0]}`}
        uri={data.image || null}
        onPress={canUpload ? pickImage : null}
        loading={isUploading}
      />

      {canUpload && !isUploading && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "#fff",
            borderRadius: 9999,
            padding: 4,
            elevation: 3, // for Android shadow
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            pointerEvents: "none",
          }}
        >
          <MaterialIcons name="file-upload" size={16} color="#000" />
        </View>
      )}
    </View>
  );
};

export default UserAvatar;
