import { uploadFile } from "@/api/files";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useUserPresence } from "@/hooks/useUserPresence";
import { useUserData } from "@/stores/useUserStore";
import { MaterialIcons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { View } from "react-native";
import { auth, db } from "../../firebaseConfig";
import Avatar from "./Avatar";

const UserAvatar = ({
  size,
  canUpload = false,
}: {
  size: number;
  canUpload?: boolean;
}) => {
  const userData = useUserData();
  const { pickImage, isUploading } = useImagePicker();
  const [isUpdatingUserDoc, setIsUpdatingUserDoc] = useState(false);
  const uid = auth.currentUser?.uid;

  const handleUpload = async () => {
    setIsUpdatingUserDoc(true);
    const uri = await pickImage();
    const imageURL = await uploadFile(
      uri as string,
      `users/${uid}/profile.jpg`
    );

    if (!imageURL) {
      setIsUpdatingUserDoc(false);
      return;
    }

    // Update or set the user document in Firestore
    const userRef = doc(db, "users", uid as string);

    try {
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Update existing user document
        await updateDoc(userRef, {
          image: imageURL,
        });
      }
      setIsUpdatingUserDoc(false);
    } catch (error) {
      console.error("Error updating Firestore user doc:", error);
    }
  };

  if (!userData) return null;

  const presence = useUserPresence(userData.uid);

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
        initials={`${userData.firstName[0]}${userData.lastName[0]}`}
        uri={userData.image || null}
        presence={presence}
        onPress={canUpload ? handleUpload : null}
        loading={isUploading || isUpdatingUserDoc}
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
