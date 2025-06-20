import { View, StyleSheet } from "react-native";
import React from "react";
import { TextRegular } from "./StyledText";
import Colors from "@/constants/Colors";

const Pills = ({ items, maxPills }: { items: string[]; maxPills?: number }) => {
  const pillsToShow = items.slice(0, maxPills || items.length);
  const remaining = !!maxPills ? items.length - maxPills : 0;

  return (
    <View style={styles.container}>
      {pillsToShow.map((specializationName: string, index: number) => {
        return (
          <View key={index} style={styles.pill}>
            <TextRegular style={styles.pillText}>
              {specializationName}
            </TextRegular>
          </View>
        );
      })}
      {remaining > 0 && (
        <View style={styles.pill}>
          <TextRegular style={styles.pillText}>+{remaining}</TextRegular>
        </View>
      )}
    </View>
  );
};

export default Pills;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  pill: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderColor: Colors.faintGrey,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    color: Colors.black,
    textTransform: "capitalize",
  },
});
