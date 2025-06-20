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
  contentContainerStyle?: StyleProp<ViewStyle>;
};

const PageScrollView = ({
  children,
  style,
  contentContainerStyle,
  ...props
}: PageScrollViewProps) => {
  return (
    <ScrollView
      {...props}
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
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
    position: "relative",
  },
});
