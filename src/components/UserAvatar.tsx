import Avatar from "./Avatar";
import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useImagePicker } from "@/hooks/useImagePicker";

const UserAvatar = ({
  size,
  canUpload = false,
}: {
  size: number;
  canUpload?: boolean;
}) => {
  const { data } = useUser();
  const { pickAndUploadImage, isUploading } = useImagePicker();
  const [isUpdatingUserDoc, setIsUpdatingUserDoc] = useState(false);

  const handleUpload = async () => {
    setIsUpdatingUserDoc(true);
    const imageURL = await pickAndUploadImage();

    if (!imageURL) {
      setIsUpdatingUserDoc(false);
      return;
    }

    // Update or set the user document in Firestore
    const userRef = doc(db, "users", auth.currentUser?.uid as string);

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
