import ListPage from "@/components/ListPage";
import RecordListItem from "@/components/RecordListItem";
import {
  useMedicalRecord,
  useRecordStoreAllergies,
} from "@/stores/useRecordStore";
import React from "react";

const Allergies = () => {
  const allergies = useRecordStoreAllergies();
  const medicalRecord = useMedicalRecord();

  return (
    <ListPage
      data={allergies}
      renderItem={({ item }) => (
        <RecordListItem
          id={item.id}
          medicalRecord={medicalRecord}
          mainText={item.name}
          subText={item.reaction}
          editPath="/(protected)/(modals)/update-allergy"
          deleteType="allergies"
        />
      )}
      emptyMessage="No medications found."
    />
  );
};

export default Allergies;
