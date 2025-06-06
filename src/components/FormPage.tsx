import Colors from "@/constants/Colors";
import useGradualAnimation from "@/hooks/useGradualAnimation";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Footer from "./AddFooter";
import PageScrollView from "./PageScrollView";

interface FormPageProps {
  canSubmit: boolean;
  isSubmitting: boolean;
  handleSubmit: () => void;
  children: React.ReactNode;
}

const FormPage: React.FC<FormPageProps> = ({
  canSubmit,
  isSubmitting,
  handleSubmit,
  children,
}) => {
  const { height: animatedHeight } = useGradualAnimation();

  const fakeHeightStyle = useAnimatedStyle(() => ({
    height: Math.abs(animatedHeight.value),
  }));

  return (
    <>
      <PageScrollView contentContainerStyle={styles.pageScrollViewContent}>
        {children}
      </PageScrollView>

      <Footer
        keyboardHeightShared={animatedHeight}
        canSubmit={canSubmit}
        submitting={isSubmitting}
        handleSubmit={handleSubmit}
      />

      <Animated.View style={fakeHeightStyle} />
    </>
  );
};

export default FormPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pageScrollViewContent: {
    flexDirection: "column",
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timesPer: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  dropdownWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
});
