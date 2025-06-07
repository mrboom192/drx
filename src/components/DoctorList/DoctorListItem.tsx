import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import {
  ListRenderItem,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Avatar from "../Avatar";
import { TextRegular, TextSemiBold } from "../StyledText";
import { getSpecializations } from "@/constants/specializations";
import i18next from "i18next";
import { useMemo } from "react";
import Pills from "../Pills";

export const renderDoctorRow: ListRenderItem<any> = ({ item }) => {
  const specializationMap = Object.fromEntries(
    getSpecializations(i18next.t).map((item) => [item.id, item.name])
  );

  // Map the specialization IDs to their names
  const specializations = item.specializations
    .map((specId: string) => specializationMap[specId])
    .filter(Boolean);

  return (
    <Link href={`/doctor/${item.id}` as any} asChild>
      <TouchableOpacity style={styles.listing}>
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

              <Pills items={specializations} maxPills={2} />
            </View>
          </View>
        </View>

        <View style={styles.price}>
          <TextSemiBold style={styles.priceText}>
            {" "}
            ${item.consultationPrice}
          </TextSemiBold>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  listing: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    alignItems: "flex-start",
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
  priceText: {
    fontSize: 16,
  },
});
