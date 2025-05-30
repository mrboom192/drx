import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export function useImagePicker() {
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

        return manipulated.uri;
      }
    } catch (err) {
      console.error("Image picking failed:", err);
    } finally {
      setIsUploading(false); // unlock after picker closes or error
    }
  };

  return { pickImage, isUploading };
}
