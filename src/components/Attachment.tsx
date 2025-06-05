import Colors from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import IconButton from "./IconButton";
import { TextRegular } from "./StyledText";
import CustomIcon from "./CustomIcon";

const SIZE = 64;

interface AttachmentProps {
  item: {
    uri: string;
    name?: string;
    mimeType?: string;
  };
  index: number;
  onRemove?: () => void; // New prop for remove action
}

type FileTypes = "pdf" | "txt" | "zip";

const Attachment: React.FC<AttachmentProps> = ({ item, index, onRemove }) => {
  const extension = item.name?.split(".").pop()?.toUpperCase() || "Unknown";
  const isImage = item.mimeType?.startsWith("image/");

  return (
    <View style={styles.wrapper}>
      {onRemove && (
        <IconButton
          containerStyle={styles.removeButton}
          buttonStyle={{ backgroundColor: "#FFF" }}
          size={24}
          name="close"
          onPress={onRemove}
        />
      )}

      {isImage ? (
        <Image
          source={{ uri: item.uri }}
          style={styles.attachmentImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.attachmentItem}>
          <TextRegular numberOfLines={1} ellipsizeMode="tail">
            {item.name || `File ${index + 1}`}
          </TextRegular>
          <View style={styles.fileType}>
            <CustomIcon
              name={extension.toLowerCase() as FileTypes}
              size={16}
              color={
                extension.toLowerCase() === "pdf" ? Colors.pink : Colors.grey
              }
            />
            <TextRegular style={styles.attachmentType}>{extension}</TextRegular>
          </View>
        </View>
      )}
    </View>
  );
};

export default Attachment;

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: -12,
    right: -12,
    zIndex: 1,
    borderRadius: 8,
    padding: 2,
  },
  attachmentItem: {
    padding: 12,
    height: SIZE,
    width: SIZE * 2.3,
    justifyContent: "center",
    alignItems: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
  },
  attachmentImage: {
    height: SIZE,
    width: SIZE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
  },
  fileType: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  attachmentType: {
    fontSize: 12,
    marginTop: 2,
    color: Colors.grey,
  },
});
