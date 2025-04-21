import { View, Text } from "react-native";
import React from "react";
import { TextRegular, TextSemiBold } from "@/components/StyledText";

const Specializations = ({ doctor }: { doctor: any }) => {
  return (
    <View style={{ flexDirection: "column", gap: 8 }}>
      <TextSemiBold style={{ fontSize: 16, color: "#000" }}>
        Specializations
      </TextSemiBold>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {doctor.specializations?.map((specialty: string, idx: number) => (
          <View
            key={idx}
            style={{
              backgroundColor: idx === 0 ? "#8EFFC3" : "#E6E6FA",
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 4,
            }}
          >
            <TextRegular
              style={{
                fontSize: 12,
                color: "#000",
                textTransform: "capitalize",
              }}
            >
              {specialty}
            </TextRegular>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Specializations;
