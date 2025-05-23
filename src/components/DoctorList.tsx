import { themedStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Rating from "./Rating";
import { TextRegular, TextSemiBold } from "./StyledText";

interface Props {
  doctors: any[];
  specialty: string;
  refresh?: number;
}

const DoctorList = ({ doctors: items, specialty, refresh }: Props) => {
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);
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
      : // : themedStyles.darkBorder;
        themedStyles.lightBorder;

  const themeTextStylePrimary =
    colorScheme === "light"
      ? themedStyles.lightTextPrimary
      : // : themedStyles.darkTextPrimary;
        themedStyles.lightTextPrimary;

  const themeTextStyleSecondary =
    colorScheme === "light"
      ? themedStyles.lightTextSecondary
      : // : themedStyles.darkTextSecondary;
        themedStyles.lightTextSecondary;

  const renderRow: ListRenderItem<any> = ({ item }) => (
    <Link href={`/doctor/${item.id}` as any} asChild>
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
                <TextSemiBold style={[themeTextStylePrimary, { fontSize: 16 }]}>
                  {item.name}
                </TextSemiBold>
                <TextRegular style={themeTextStyleSecondary}>
                  {item.specialty.join(", ")}
                </TextRegular>
              </View>
              <Rating rating={4.5} reviews={223} />
            </View>
          </View>
          <View style={[themeBorderStyle, styles.price]}>
            <TextRegular style={[themeTextStylePrimary, { fontSize: 20 }]}>
              ${item.consultation_price}
            </TextRegular>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <FlatList
      renderItem={renderRow}
      data={loading ? [] : items}
      ref={listRef}
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
