import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import {
  ListRenderItem,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { SPECIALIZATIONS } from "@/constants/specializations";
import Avatar from "../Avatar";
import { TextRegular, TextSemiBold } from "../StyledText";

export const renderDoctorRow: ListRenderItem<any> = ({ item }) => {
  const maxRows = 1;
  const itemsPerRow = 2; // Adjust based on your design
  const maxPills = maxRows * itemsPerRow;

  const specializations = item.specializations || [];
  const pillsToShow = specializations.slice(0, maxPills);
  const remaining = specializations.length - maxPills;

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
                      <TextRegular style={styles.pillText}>{spec}</TextRegular>
                    </View>
                  );
                })}
                {remaining > 0 && (
                  <View
                    style={[styles.pill, { backgroundColor: Colors.faintGrey }]}
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
