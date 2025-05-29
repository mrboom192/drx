import { Chat } from "@/types/chat";

export const getSenderName = (uid: string, chat: Chat): string => {
  if (uid === "system") return "System";

  if (chat.participants.doctor.uid === uid) {
    return `${chat.participants.doctor.firstName} ${chat.participants.doctor.lastName}`;
  }

  if (chat.participants.patient.uid === uid) {
    return `${chat.participants.patient.firstName} ${chat.participants.patient.lastName}`;
  }

  return "Unknown";
};

export const getSenderAvatar = (uid: string, chat: Chat): string => {
  if (uid === "system") return ""; // or a default system icon

  const { doctor, patient } = chat.participants;

  if (doctor.uid === uid) return doctor.image || "";
  if (patient.uid === uid) return patient.image || "";

  return "";
};

export const getChatId = (doctorId: string, patientId: string): string => {
  // Ensure the IDs are sorted to maintain consistency
  return [doctorId, patientId].sort().join("_");
};
