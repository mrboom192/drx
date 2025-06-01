import Colors from "@/constants/Colors";
import { SPECIALIZATIONS } from "@/constants/specializations";
import { useFilteredDoctors } from "@/stores/useDoctorSearch";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
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

  const renderRow: ListRenderItem<any> = ({ item }) => {
    const maxRows = 1;
    const itemsPerRow = 3; // Adjust based on your design
    const maxPills = maxRows * itemsPerRow;

    const specializations = item.specializations || [];
    const pillsToShow = specializations.slice(0, maxPills);
    const remaining = specializations.length - maxPills;

    return (
      <Link href={`/doctor/${item.id}` as any} asChild>
        <TouchableOpacity>
          <Animated.View
            style={styles.listing}
            entering={FadeInRight}
            exiting={FadeOutLeft}
          >
            <View style={styles.left}>
              <Avatar
                uri={item.image}
                size={48}
                initials={item.firstName[0] + item.lastName[0]}
              />

              <View style={styles.info}>
                <View>
                  <TextSemiBold style={{ fontSize: 16, width: "100%" }}>
                    {item.firstName} {item.lastName}
                  </TextSemiBold>

                  <View style={styles.specializationsContainer}>
                    {pillsToShow.map((spec: string, index: number) => {
                      const specialization = SPECIALIZATIONS.find(
                        (s) => s.name.toLowerCase() === spec.toLowerCase()
                      );
                      const pillColor = specialization?.color;
                      return (
                        <View
                          key={index}
                          style={[styles.pill, { backgroundColor: pillColor }]}
                        >
                          <TextRegular style={styles.pillText}>
                            {spec}
                          </TextRegular>
                        </View>
                      );
                    })}
                    {remaining > 0 && (
                      <View
                        style={[
                          styles.pill,
                          { backgroundColor: Colors.faintGrey },
                        ]}
                      >
                        <TextRegular style={styles.pillText}>
                          +{remaining}
                        </TextRegular>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.price}>
              <TextSemiBold style={styles.priceText}>
                {" "}
                ${item.consultationPrice}
              </TextSemiBold>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    );
  };

  return doctors.length === 0 && !loading ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
      }}
    >
      <TextSemiBold style={{ fontSize: 16, color: Colors.grey }}>
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
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.faintGrey,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  info: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  specializations: {
    textTransform: "capitalize",
    color: Colors.grey,
  },
  price: {
    height: 64,
    width: 64,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  specializationsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  pill: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 12,
    color: Colors.black,
    textTransform: "capitalize",
  },
  priceText: {
    fontSize: 16,
  },
});

export default DoctorList;
