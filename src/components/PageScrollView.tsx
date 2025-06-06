import React, { ReactNode } from "react";
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

type PageScrollViewProps = ScrollViewProps & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const PageScrollView = ({ children, style, ...props }: PageScrollViewProps) => {
  return (
    <ScrollView
      {...props}
      style={[styles.container]}
      contentContainerStyle={[styles.contentContainer, style]}
    >
      {children}
    </ScrollView>
  );
};

export default PageScrollView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingHorizontal: 16,
    position: "relative",
  },
});
