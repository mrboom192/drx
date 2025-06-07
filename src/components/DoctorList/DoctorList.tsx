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
import { TextSemiBold } from "../StyledText";
import { renderDoctorRow } from "./DoctorListItem";
import { useTranslation } from "react-i18next";

interface Props {
  specialty: string;
  refresh?: number;
}

const DoctorList = ({ specialty, refresh }: Props) => {
  const { t } = useTranslation();
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
        {t("common.no-doctors-found")}
      </TextSemiBold>
    </View>
  ) : (
    <FlatList
      renderItem={renderDoctorRow}
      data={loading ? [] : doctors}
      ref={listRef}
    />
  );
};

export default DoctorList;
