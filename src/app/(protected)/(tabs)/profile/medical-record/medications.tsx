import RecordListItem from "@/components/RecordListItem";
import ListPage from "@/components/ListPage";
import {
  useMedicalRecord,
  useRecordStoreMedications,
} from "@/stores/useRecordStore";
import React from "react";

const Medications = () => {
  const medicalRecord = useMedicalRecord();
  const medications = useRecordStoreMedications();

  return (
    <ListPage
      data={medications}
      renderItem={({ item }) => (
        <RecordListItem
          id={item.id}
          medicalRecord={medicalRecord}
          mainText={item.name}
          subText={`${item.dosage}${item.route ? ` (${item.route})` : ""}`}
          extraInfo={`${item.frequency}/${item.interval}`}
          editPath="/(protected)/(modals)/update-medication"
          deleteType="medications"
        />
      )}
      emptyMessage="No medications found."
    />
  );
};

export default Medications;
