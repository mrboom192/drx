import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import { filterMap } from "@/constants/filterMap";
import LoadingScreen from "@/components/LoadingScreen";
import { useFetchDoctorsByField } from "@/stores/useDoctorSearch";
import { renderDoctorRow } from "@/components/DoctorList/DoctorListItem";

type Filter = { filter: keyof typeof filterMap };

type Content = {
  title: string;
  description: string;
  image: any | null;
  key: string | null;
  filters: any[];
};

const FilteredListPage = () => {
  const { filter } = useLocalSearchParams<Filter>();
  const [doctors, setDoctors] = useState<any[]>([]);
  const fetchDoctorsByField = useFetchDoctorsByField();
  const [loading, setLoading] = useState<boolean>(true);

  const content: Content = filterMap[filter] ?? filterMap.fallback;

  useEffect(() => {
    const fetchDoctors = async () => {
      if (content && content.key && content.filters.length > 0) {
        setLoading(true);
        const result = await fetchDoctorsByField(content.key, content.filters);
        setDoctors(result);
        setLoading(false);
      } else {
        setDoctors([]);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [filter]);

  if (loading) return <LoadingScreen />;

  return (
    <View style={{ backgroundColor: "#FFF", flex: 1 }}>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctorRow}
        ListHeaderComponent={
          <View style={styles.pageHeader}>
            {content.image && (
              <Image
                style={styles.image}
                source={content.image}
                contentFit="contain"
                transition={250}
              />
            )}
            <TextSemiBold style={styles.pageHeaderTitle}>
              {content.title}
            </TextSemiBold>
            <TextRegular style={styles.pageHeaderDescription}>
              {content.description}
            </TextRegular>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          <TextSemiBold style={styles.emptyListText}>
            No doctors found.
          </TextSemiBold>
        }
      />
    </View>
  );
};

export default FilteredListPage;

const styles = StyleSheet.create({
  pageHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.faintGrey,
  },
  pageHeaderTitle: {
    fontSize: 24,
  },
  pageHeaderDescription: {
    fontSize: 16,
    color: Colors.grey,
    marginTop: 8,
  },
  image: {
    width: "100%",
    height: 128,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 48,
    fontSize: 16,
    color: Colors.lightText,
  },
});
