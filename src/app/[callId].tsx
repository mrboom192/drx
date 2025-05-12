import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import VideoCall from "@/components/VideoCall";

const Call = () => {
  const { callId, caller } = useLocalSearchParams<{
    callId: string;
    caller?: string;
  }>();
  // Pass isCaller={true} if this user initiated the call, otherwise false
  return (
    <View style={{ flex: 1 }}>
      <VideoCall callId={callId} isCaller={!!caller} />
    </View>
  );
};

export default Call;
