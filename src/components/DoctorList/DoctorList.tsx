import Colors from "@/constants/Colors";
import { useFilteredDoctors } from "@/stores/useDoctorSearch";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { TextSemiBold } from "../StyledText";
import { renderDoctorRow } from "./DoctorListItem";
import { useTranslation } from "react-i18next";
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetView,
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

  return (
    <BottomSheetFlatList
      renderItem={renderDoctorRow}
      data={doctors}
      ref={listRef}
      ListEmptyComponent={
        <TextSemiBold style={styles.emptyListText}>
          {t("common.no-doctors-found")}
        </TextSemiBold>
      }
    />
  );
};

export default DoctorList;

const styles = StyleSheet.create({
  emptyStateContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 48,
    fontSize: 16,
    color: Colors.lightText,
  },
});
