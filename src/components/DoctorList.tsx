import {
  View,
  Text,
  ListRenderItem,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Touchable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import { Doctor } from "@/types/doctor";

interface Props {
  doctors: Doctor[];
  specialty: string;
  refresh: number;
}

const DoctorList = ({ doctors: items, specialty, refresh }: Props) => {
  const [loading, setLoading] = useState(false);
  const listRef = useRef<BottomSheetFlatListMethods>(null);

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

  const renderRow: ListRenderItem<Doctor> = ({ item }) => (
    <Link href={`/`} asChild>
      <TouchableOpacity>
        <Animated.View
          style={styles.listing}
          entering={FadeInRight}
          exiting={FadeOutLeft}
        >
          {/* Image */}
          <Image source={{ uri: item.photo_url }} style={styles.image} />

          <View style={styles.info}>
            <View>
              <Text style={{ fontFamily: "dm-sb" }}>{item.name}</Text>
              <Text
                style={{ fontFamily: "dm", color: "#6E6E6E", fontSize: 12 }}
              >
                {item.specialty}
              </Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <BottomSheetFlatList
        renderItem={renderRow}
        data={loading ? [] : items}
        ref={listRef}
        ListHeaderComponent={
          <Text style={styles.info}>{items.length} doctors</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listing: {
    padding: 16,
    gap: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#DDDDDD",
    borderRadius: 16,
    backgroundColor: "#FFF",
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 9999,
  },
  info: {
    textAlign: "center",
    fontFamily: "dm-sb",
    fontSize: 16,
    marginTop: 4,
  },
});

export default DoctorList;
