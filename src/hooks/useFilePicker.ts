import * as DocumentPicker from "expo-document-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useState } from "react";

export function useFilePicker() {
  const [isPicking, setIsPicking] = useState(false);

  const pickFile = async () => {
    if (isPicking) return; // Prevent duplicate actions
    setIsPicking(true);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // All file types
        copyToCacheDirectory: true,
        multiple: false, // Optional: pick only one file
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        let { uri, name, mimeType } = asset;

        // If the picked file is an image, compress/resize it
        if (mimeType?.startsWith("image/")) {
          const manipulated = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 200, height: 200 } }],
            { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
          );
          uri = manipulated.uri;
        }

        return { uri, name, mimeType };
      }
    } catch (err) {
      console.error("File picking failed:", err);
    } finally {
      setIsPicking(false);
    }
  };

  return { pickFile, isPicking };
}
