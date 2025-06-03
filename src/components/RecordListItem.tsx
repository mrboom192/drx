import { deleteItemFromMedicalRecord } from "@/api/medicalRecords";
import IconButton from "@/components/IconButton";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { Href, router } from "expo-router";
import { NavigationOptions } from "expo-router/build/global-state/routing";
import { StyleSheet, View } from "react-native";
import { auth } from "../../firebaseConfig";

type RecordListItemProps = {
  id: string;
  medicalRecord: any; // or MedicalRecord type if consistent
  mainText: string; // e.g. "Atorvastatin" or "Peanut Allergy"
  subText?: string; // e.g. "10mg (oral)" or "Hives and swelling"
  extraInfo?: string; // e.g. "2/daily"
  editPath: Href; // e.g. "/(protected)/(modals)/update-allergy"
  deleteType: "allergies" | "medications" | "conditions";
};

const RecordListItem = ({
  id,
  medicalRecord,
  mainText,
  subText,
  extraInfo,
  editPath,
  deleteType,
}: RecordListItemProps) => {
  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.nameContainer}>
        <TextSemiBold
          style={itemStyles.name}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {mainText}
        </TextSemiBold>
        {subText && (
          <TextRegular
            style={itemStyles.subText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subText}
          </TextRegular>
        )}
      </View>
      {extraInfo && (
        <TextSemiBold style={itemStyles.extraInfo}>{extraInfo}</TextSemiBold>
      )}
      <View style={itemStyles.buttons}>
        <IconButton
          name="stylus"
          onPress={() =>
            router.navigate({
              pathname: editPath,
              params: { mode: "edit", id },
            } as Href & NavigationOptions)
          }
        />
        <IconButton
          name="close"
          onPress={() => {
            deleteItemFromMedicalRecord(
              auth.currentUser!.uid,
              medicalRecord,
              id,
              deleteType
            );
          }}
        />
      </View>
    </View>
  );
};

export default RecordListItem;

const itemStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.faintGrey,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameContainer: {
    flexDirection: "column",
    flex: 1,
  },
  name: {
    fontSize: 16,
  },
  subText: {
    fontSize: 16,
    color: Colors.grey,
  },
  extraInfo: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    flex: 1,
  },
});
