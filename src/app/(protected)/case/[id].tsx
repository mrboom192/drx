import PageScrollView from "@/components/PageScrollView";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useCaseById } from "@/stores/useCaseStore";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const Case = () => {
  const { id } = useLocalSearchParams();
  const caseData = useCaseById(id as string);

  if (!caseData) {
    return (
      <PageScrollView contentContainerStyle={styles.container}>
        <TextRegular style={styles.emptyText}>Loading case data...</TextRegular>
      </PageScrollView>
    );
  }

  const { name, description, attachments } = caseData;

  return (
    <PageScrollView contentContainerStyle={styles.container}>
      <TextSemiBold style={styles.title}>{name}</TextSemiBold>

      <View style={styles.section}>
        <TextSemiBold style={styles.sectionTitle}>Description</TextSemiBold>
        <TextRegular style={styles.description}>{description}</TextRegular>
      </View>

      {/* Test */}
      <WebView
        style={{ width: 500, height: 500 }}
        source={{ uri: caseData.attachments[0] }}
      />

      {attachments && attachments.length > 0 && (
        <View style={styles.section}>
          <TextSemiBold style={styles.sectionTitle}>Attachments</TextSemiBold>
          <View style={styles.attachments}>
            {attachments.map((uri: string, index: number) => (
              <Image
                key={`${uri}-${index}`}
                source={{ uri }}
                style={styles.attachmentImage}
                resizeMode="cover"
              />
            ))}
          </View>
        </View>
      )}
    </PageScrollView>
  );
};

export default Case;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: Colors.black,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: Colors.grey,
  },
  description: {
    fontSize: 16,
    color: Colors.black,
    lineHeight: 22,
  },
  attachments: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  attachmentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.grey,
    fontSize: 16,
    marginTop: 20,
  },
});
