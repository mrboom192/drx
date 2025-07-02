import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { TextRegular } from "./StyledText";
import countryCodes from "@/../assets/data/country_codes.json";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Divider from "./Divider";

const CountryCodes = () => {
  return (
    <FlatList
      data={countryCodes.countries}
      keyExtractor={(item) => `${item.name}-${item.code}`}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => (
        <TouchableOpacity style={{ paddingVertical: 8 }}>
          <TextRegular>
            {item.name} ({item.code})
          </TextRegular>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
      style={{ backgroundColor: "#fff", height: 256 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CountryCodes;
