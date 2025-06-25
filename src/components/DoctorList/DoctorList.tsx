import Colors from "@/constants/Colors";
import { useFilteredDoctors } from "@/stores/useDoctorSearch";
import { Link } from "expo-router";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { TextSemiBold } from "../StyledText";
import { renderDoctorRow } from "./DoctorListItem";
import { useTranslation } from "react-i18next";
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import { useFilters } from "@/stores/useFilterStore";

interface Props {
  refresh?: number;
}

const DoctorList = ({ refresh }: Props) => {
  const { t } = useTranslation();
  const filters = useFilters();
  const doctors = useFilteredDoctors(filters);
  const listRef = useRef<BottomSheetFlatListMethods>(null);

  useEffect(() => {
    if (refresh) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [refresh]);

  return doctors.length === 0 ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
      }}
    >
      <TextSemiBold style={{ fontSize: 16, color: Colors.grey }}>
        {t("common.no-doctors-found")}
      </TextSemiBold>
    </View>
  ) : (
    <BottomSheetFlatList
      renderItem={renderDoctorRow}
      data={doctors}
      ref={listRef}
    />
    // <FlatList renderItem={renderDoctorRow} data={doctors} ref={listRef} />
  );
};

export default DoctorList;
