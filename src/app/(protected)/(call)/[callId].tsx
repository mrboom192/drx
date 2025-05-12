import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useWebRTCCall } from "@/hooks/useWebRTCCall";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { RTCView } from "react-native-webrtc";

type CallProps = {
  chatId: string;
  callId: string;
  callerType: string;
};

const Call = () => {
  // Get callId and callerType (either "caller" or "callee") from URL params
  const { chatId, callId, callerType } = useLocalSearchParams<CallProps>();
  const isCaller = callerType === "caller";

  const { localStream, remoteStream } = useWebRTCCall(chatId, callId, isCaller);
  return (
    <View style={[styles.container]}>
      {localStream ? (
        <RTCView
          streamURL={localStream.toURL()}
          style={styles.localVideo}
          objectFit="cover"
        />
      ) : (
        <View style={styles.localVideo}>
          <TextSemiBold style={styles.status}>
            Waiting for local stream...
          </TextSemiBold>
        </View>
      )}
      {remoteStream ? (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="cover"
        />
      ) : (
        <View style={styles.remoteVideo}>
          <TextSemiBold style={styles.status}>
            Waiting for remote stream...
          </TextSemiBold>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  localVideo: {
    borderRadius: 8,
    width: "100%",
    height: "50%",
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  remoteVideo: {
    borderRadius: 8,
    width: "100%",
    height: "50%",
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    color: Colors.grey,
    textAlign: "center",
    fontSize: 16,
  },
});

export default Call;
