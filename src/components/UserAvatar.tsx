import { uploadFile } from "@/api/files";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useUserPresence } from "@/hooks/useUserPresence";
import { useUserData } from "@/stores/useUserStore";
import { MaterialIcons } from "@expo/vector-icons";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { auth, db } from "../../firebaseConfig";
import Avatar from "./Avatar";

type UserAvatarProps = {
  size: number;
  canUpload?: boolean;
  onPressFallback?: () => void;
};

const UserAvatar = ({
  size,
  canUpload = false,
  onPressFallback,
}: UserAvatarProps) => {
  const userData = useUserData();
  const { pickImage, isUploading } = useImagePicker();
  const [isUpdating, setIsUpdating] = useState(false);
  const uid = auth.currentUser?.uid;
  const presence = useUserPresence(userData?.uid);

  const handleUpload = async () => {
    try {
      setIsUpdating(true);
      const uri = await pickImage();
      if (!uri) return;

      const imageURL = await uploadFile(uri, `users/${uid}/profile.jpg`);
      if (!imageURL) return;

      await updateDoc(doc(db, "users", uid!), { image: imageURL });
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePress = () => {
    if (canUpload) handleUpload();
    else onPressFallback?.();
  };

  if (!userData) return null;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Avatar
        size={size}
        initials={`${userData.firstName[0]}${userData.lastName[0]}`}
        source={userData.image || null}
        presence={presence}
        onPress={handlePress}
        loading={isUploading || isUpdating}
      />

      {canUpload && !isUploading && (
        <View style={styles.uploadIconWrapper}>
          <MaterialIcons name="file-upload" size={16} color="#000" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  uploadIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 9999,
    padding: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    pointerEvents: "none",
  },
});

export default UserAvatar;
