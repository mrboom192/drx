import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

const Call = () => {
  const { callId, caller } = useLocalSearchParams<{
    callId: string;
    caller?: string;
  }>();

  // Pass isCaller={true} if this user initiated the call, otherwise false
  return (
    <View style={{ flex: 1 }}>
      {/* <VideoCall callId={callId} isCaller={!!caller} /> */}
    </View>
  );
};

export default Call;
