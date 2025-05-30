import { uploadFile } from "@/api/files";
import Attachment from "@/components/Attachment";
import ControllerInput from "@/components/form/ControllerInput";
import FormPage from "@/components/FormPage";
import IconButton from "@/components/IconButton";
import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useFilePicker } from "@/hooks/useFilePicker";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useUserData } from "@/stores/useUserStore";
import { router } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { auth, db } from "../../../../firebaseConfig";

const CreateSecondOpinion = () => {
  const { pickFile } = useFilePicker();
  const { pickImage } = useImagePicker();
  const userData = useUserData();
  const { control, handleSubmit, formState, setValue, watch } =
    useForm<FieldValues>({
      defaultValues: {
        attachments: [],
      },
    });
  const { isDirty, isValid, isSubmitting } = formState;

  const attachments = watch("attachments") as {
    uri: string;
    name: string;
    mimeType: string;
  }[];

  const handlePickImage = async () => {
    try {
      const imageUri = await pickImage();
      if (imageUri) {
        const timestamp = Date.now();
        const imageAttachment = {
          uri: imageUri,
          name: `image-${timestamp}.jpg`, // Ensure a valid name
          mimeType: "image/jpeg", // Assuming JPEG
        };
        setValue("attachments", [...attachments, imageAttachment], {
          shouldDirty: true,
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handlePickFile = async () => {
    try {
      const file = await pickFile();
      if (file) {
        setValue("attachments", [...attachments, file], { shouldDirty: true });
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const uploadedUrls = await Promise.all(
        (data.attachments as { uri: string; name: string }[]).map(
          async (file) => {
            const storagePath = `users/${auth.currentUser?.uid}/attachments/${
              file.name || file
            }`;
            return await uploadFile(file.uri, storagePath);
          }
        )
      );

      await addDoc(collection(db, "secondOpinions"), {
        ...data,
        attachments: uploadedUrls,
        uid: auth.currentUser?.uid,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      router.dismiss();
    } catch (error) {
      console.error("Error saving second opinion:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FormPage
        canSubmit={isValid && isDirty}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <ControllerInput
          control={control}
          name="name"
          rules={{ required: "Please give your case a name" }}
          label="Case Name"
          placeholder="e.g. Cancer Diagnosis"
        />
        <ControllerInput
          control={control}
          name="description"
          rules={{ required: "Please provide a description" }}
          label="Description"
          placeholder="Describe your case in detail"
          multiline
          textInputStyle={{ height: 100 }}
        />
        <View style={styles.actionRow}>
          <TextSemiBold>Add attachments</TextSemiBold>
          <View style={styles.buttons}>
            <IconButton name="attach-file-add" onPress={handlePickFile} />
            <IconButton name="add-photo-alternate" onPress={handlePickImage} />
          </View>
        </View>

        <View style={styles.attachments}>
          {attachments.length > 0 ? (
            attachments.map((item, index) => (
              <Attachment
                key={`${item.uri}-${index}`}
                item={item}
                index={index}
                onRemove={() => {
                  const updated = attachments.filter((_, i) => i !== index);
                  setValue("attachments", updated, { shouldDirty: true });
                }}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No attachments added.</Text>
          )}
        </View>
      </FormPage>
    </View>
  );
};

export default CreateSecondOpinion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 8,
    borderBottomColor: Colors.faintGrey,
  },
  buttons: {
    flexDirection: "row",
    gap: 8,
  },
  attachments: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  emptyText: {
    textAlign: "center",
    color: Colors.grey,
    marginTop: 8,
  },
});
