import { fetchMedicalRecord } from "@/api/medicalRecords";
import PageScrollView from "@/components/PageScrollView";
import { TextRegular } from "@/components/StyledText";
import { MedicalRecord as Rec } from "@/types/medicalRecord";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";

const MedicalRecord = () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const [record, setRecord] = useState<Rec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecord = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMedicalRecord(id as string);
        setRecord(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch medical record");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadRecord();
  }, [id]);

  return (
    <PageScrollView>
      {loading ? (
        <View style={{ padding: 24 }}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <TextRegular style={{ padding: 24, color: "red" }}>{error}</TextRegular>
      ) : record ? (
        <View style={{ gap: 12 }}>
          <TextRegular style={{ fontSize: 18, fontWeight: "bold" }}>
            {t("record.medical-record")}
          </TextRegular>
          <TextRegular>
            Medications: {record.medications[0]?.name || "None"}
          </TextRegular>
          <TextRegular>Allergies: {record.allergies.join(", ")}</TextRegular>
          <TextRegular>
            Last Updated: {record.updatedAt?.toDate().toLocaleString()}
          </TextRegular>
        </View>
      ) : (
        <TextRegular style={{ padding: 24 }}>
          {t("error.no-record-found")}
        </TextRegular>
      )}
    </PageScrollView>
  );
};

export default MedicalRecord;
