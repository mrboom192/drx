import {
  View,
  Text,
  ListRenderItem,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Touchable,
  useColorScheme,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { defaultStyles, themedStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import { Doctor } from "@/types/doctor";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Rating from "./Rating";

interface Props {
  doctors: Doctor[];
  specialty: string;
  refresh: number;
}

const DoctorList = ({ doctors: items, specialty, refresh }: Props) => {
  const [loading, setLoading] = useState(false);
  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (refresh) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [refresh]);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [specialty]);

  const themeBorderStyle =
    colorScheme === "light"
      ? themedStyles.lightBorder
      : themedStyles.darkBorder;

  const themeTextStylePrimary =
    colorScheme === "light"
      ? themedStyles.lightTextPrimary
      : themedStyles.darkTextPrimary;

  const themeTextStyleSecondary =
    colorScheme === "light"
      ? themedStyles.lightTextSecondary
      : themedStyles.darkTextSecondary;

  const renderRow: ListRenderItem<Doctor> = ({ item }) => (
    <Link href={`/doctor/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View
          style={[
            {
              backgroundColor:
                colorScheme === "light"
                  ? Colors.light.background
                  : Colors.dark.background,
            },
            themeBorderStyle,
            styles.listing,
          ]}
          entering={FadeInRight}
          exiting={FadeOutLeft}
        >
          {/* Image */}
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Image source={{ uri: item.photo_url }} style={styles.image} />

            <View style={styles.info}>
              <View>
                <Text
                  style={[
                    themeTextStylePrimary,
                    { fontFamily: "dm-sb", fontSize: 16 },
                  ]}
                >
                  {item.name}
                </Text>
                <Text style={[themeTextStyleSecondary, { fontFamily: "dm" }]}>
                  {item.specialty}
                </Text>
              </View>
              <Rating rating={4.5} reviews={223} />
            </View>
          </View>
          <View style={[themeBorderStyle, styles.price]}>
            <Text
              style={[
                themeTextStylePrimary,
                { fontFamily: "dm-sb", fontSize: 20 },
              ]}
            >
              ${item.consultation_price}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <BottomSheetFlatList
      renderItem={renderRow}
      data={loading ? [] : items}
      ref={listRef}
      // ListHeaderComponent={
      //   <Text style={[themeTextStyleSecondary, { fontFamily: "dm-sb" }]}>
      //     {items.length} doctors
      //   </Text>
      // }
    />
  );
};

const styles = StyleSheet.create({
  listing: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: "row",
    borderRadius: 16,
    justifyContent: "space-between",
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 9999,
  },
  info: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  price: {
    height: 64,
    width: 64,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DoctorList;
