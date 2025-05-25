import Colors from "@/constants/Colors";
import { themedStyles } from "@/constants/Styles";
import { useFilteredDoctors } from "@/stores/useDoctorSearch";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import Avatar from "./Avatar";
import { TextRegular, TextSemiBold } from "./StyledText";

interface Props {
  specialty: string;
  refresh?: number;
}

const DoctorList = ({ specialty, refresh }: Props) => {
  const doctors = useFilteredDoctors(specialty);
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
          style={[themeBorderStyle, styles.listing]}
          entering={FadeInRight}
          exiting={FadeOutLeft}
        >
          {/* Image */}
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Avatar
              uri={item.image}
              size={64}
              initials={item.firstName[0] + item.lastName[0]}
            />

            <View style={styles.info}>
              <View>
                <TextSemiBold style={[themeTextStylePrimary, { fontSize: 16 }]}>
                  {item.firstName} {item.lastName}
                </TextSemiBold>
                <TextRegular style={themeTextStyleSecondary}>
                  {item.specializations.join(", ")}
                </TextRegular>
              </View>
              {/* <Rating rating={4.5} reviews={223} /> */}
            </View>
          </View>
          <View style={[themeBorderStyle, styles.price]}>
            <TextRegular style={[themeTextStylePrimary, { fontSize: 20 }]}>
              ${item.consultationPrice}
            </TextRegular>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  return doctors.length === 0 && !loading ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
      }}
    >
      <TextSemiBold
        style={[themeTextStylePrimary, { fontSize: 16, color: Colors.grey }]}
      >
        No doctors found
      </TextSemiBold>
    </View>
  ) : (
    <FlatList
      renderItem={renderRow}
      data={loading ? [] : doctors}
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
