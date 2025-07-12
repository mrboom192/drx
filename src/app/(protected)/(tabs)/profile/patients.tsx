import Avatar from "@/components/Avatar";
import PageScrollView from "@/components/PageScrollView";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useUserPresence } from "@/hooks/useUserPresence";
import { useChats } from "@/stores/useChatStore";
import { Chat } from "@/types/chat";
import { Link } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

const Patients = () => {
  const { t } = useTranslation();
  // Fetch the list of chats from the chat store, which is also used to manage the list of patients
  const chats = useChats();

  return (
    <PageScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
      {chats.map((chat) => (
        <PatientRow key={chat.id} chat={chat} />
      ))}
      {chats.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <TextSemiBold style={{ color: Colors.grey }}>
            {t("error.no-patients-found")}
          </TextSemiBold>
        </View>
      )}
    </PageScrollView>
  );
};

const PatientRow = ({ chat }: { chat: Chat }) => {
  const { t } = useTranslation();
  const patient = chat.participants.patient;
  const presence = useUserPresence(patient.uid);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: Colors.light.faintGrey,
      }}
    >
      <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
        <Avatar
          size={64}
          source={patient.image}
          presence={presence}
          initials={patient.firstName[0] + patient.lastName[0]}
        />
        <View style={{ flexDirection: "column", gap: 4 }}>
          <TextSemiBold style={{ textAlign: "left" }}>
            {patient.firstName} {patient.lastName}
          </TextSemiBold>
          <TextRegular style={{ textAlign: "left" }}>
            {t("other.status", { status: chat.status })}
          </TextRegular>
        </View>
      </View>
      <Link
        href={{
          pathname: `/(protected)/medical-records/[id]`,
          params: { id: patient.uid },
        }}
        asChild
      >
        <TouchableOpacity>
          <TextSemiBold>{t("page.view-medical-record")}</TextSemiBold>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Patients;
