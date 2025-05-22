import Avatar from "@/components/Avatar";
import PageScrollView from "@/components/PageScrollView";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useUserPresence } from "@/hooks/useUserPresence";
import { useChats } from "@/stores/useChatStore";
import { Chat } from "@/types/chat";
import { Link } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const Patients = () => {
  // Fetch the list of chats from the chat store, which is also used to manage the list of patients
  const chats = useChats();

  return (
    <PageScrollView>
      {chats.map((chat) => (
        <PatientRow key={chat.id} chat={chat} />
      ))}
    </PageScrollView>
  );
};

const PatientRow = ({ chat }: { chat: Chat }) => {
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
          uri={patient.image}
          presence={presence}
          initials={patient.firstName[0] + patient.lastName[0]}
        />
        <View style={{ flexDirection: "column", gap: 4 }}>
          <TextSemiBold>
            {patient.firstName} {patient.lastName}
          </TextSemiBold>
          <TextRegular>Status: {chat.status}</TextRegular>
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
          <TextSemiBold>View medical record</TextSemiBold>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Patients;
