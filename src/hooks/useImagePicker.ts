import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../../firebaseConfig";

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

  async function uploadImage(imageUri: string, path: string) {
    let uploadedImageURL: string | null = null;
    const uid = auth.currentUser?.uid;

    if (!uid || !imageUri) return null;

    // Upload image if exists
    const fileRef = ref(storage, path);

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
    return uploadedImageURL;
  }

  return { pickImage, uploadImage, isUploading };
}
