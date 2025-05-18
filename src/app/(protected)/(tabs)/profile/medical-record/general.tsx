import { Accordion } from "@/components/AccordionItem";
import PageScrollView from "@/components/PageScrollView";
import { TextSemiBold } from "@/components/StyledText";
import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

const General = () => {
  const open = useSharedValue(false);
  const onPress = () => {
    open.value = !open.value;
  };

  return (
    <PageScrollView>
      <View style={styles.buttonContainer}>
        <Button onPress={onPress} title="Click me" />
      </View>

      <View style={styles.content}>
        <Accordion open={open}>
          <TextSemiBold>Accordion Content</TextSemiBold>
          <TextSemiBold>More content here...</TextSemiBold>
        </Accordion>
      </View>
    </PageScrollView>
  );
};

export default General;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    flex: 1,
    paddingBottom: 16, // use a numeric value instead of "1rem"
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
