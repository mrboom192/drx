import ListPage from "@/components/ListPage";
import RecordListItem from "@/components/RecordListItem";
import {
  useMedicalRecord,
  useRecordStoreConditions,
} from "@/stores/useRecordStore";
import React from "react";

const Allergies = () => {
  const conditions = useRecordStoreConditions();
  const medicalRecord = useMedicalRecord();

  return (
    <ListPage
      data={conditions}
      renderItem={({ item }) => (
        <RecordListItem
          id={item.id}
          medicalRecord={medicalRecord}
          mainText={item.name}
          subText={item.description}
          editPath="/(protected)/(modals)/update-condition"
          deleteType="conditions"
        />
      )}
      emptyMessage="No diseases & conditions found."
    />
  );
};

export default Allergies;
