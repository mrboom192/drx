import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { styles } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";
import { themedStyles } from "@/constants/Styles";

const Page = () => {
  const colorScheme = useColorScheme();

  const themeTextStylePrimary =
    colorScheme === "light"
      ? themedStyles.lightTextPrimary
      : themedStyles.darkTextPrimary;

  return (
    <View>
      <Link href={`/(app)/(tabs)/doctors/search`} asChild>
        <TouchableOpacity>
          <Text style={themeTextStylePrimary}>Search for Doctors</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Page;
