import { getHeaderTitle } from "@react-navigation/elements";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IconButton from "./IconButton";
import { TextSemiBold } from "./StyledText";

const HEADER_HEIGHT = 56;

const PageHeader = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const insets = useSafeAreaInsets();
  const title = getHeaderTitle(options, route.name);
  const headerRight = options.headerRight;
  const isModal = Platform.OS === "ios" && options.presentation === "modal";

  return (
    <View
      style={[
        header.container,
        {
          height: isModal ? HEADER_HEIGHT + 16 : HEADER_HEIGHT + insets.top,
          paddingTop: isModal ? 16 : insets.top,
        },
      ]}
    >
      {back && (
        <View style={[header.backButton]}>
          <IconButton name="arrow-back" onPress={navigation.goBack} />
        </View>
      )}
      <TextSemiBold style={header.title}>{title}</TextSemiBold>
      {headerRight && <View style={header.rightButton}>{headerRight({})}</View>}
    </View>
  );
};

export default PageHeader;

const header = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    bottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
  },
  rightButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 16,
    bottom: 8,
  },
});
