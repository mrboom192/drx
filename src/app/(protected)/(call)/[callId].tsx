import CustomIcon from "@/components/icons/CustomIcon";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useWebRTCCall } from "@/hooks/useWebRTCCall";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RTCView } from "react-native-webrtc";

type CallProps = {
  otherPersonImage: string;
  otherPersonFirstName: string;
  otherPersonLastName: string;
  chatId: string;
  callId: string;
  callerType: string;
};

const Call = () => {
  // Get callId and callerType (either "caller" or "callee") from URL params
  const {
    chatId,
    callId,
    callerType,
    otherPersonFirstName,
    otherPersonLastName,
  } = useLocalSearchParams<CallProps>();
  const isCaller = callerType === "caller";
  const insets = useSafeAreaInsets();

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start the timer when the page mounts
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600).toString();
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const {
    localStream,
    remoteStream,
    switchCamera,
    toggleMute,
    toggleVideo,
    isVideoEnabled,
    isMuted,
  } = useWebRTCCall(chatId, callId, isCaller);

  const CallButtons = () => {
    return (
      <View style={[footer.container, { bottom: insets.bottom }]}>
        <BlurView intensity={50} tint="dark" style={footer.blurView}>
          <View style={footer.userRow}>
            <TextRegular style={footer.otherPersonName}>
              {otherPersonFirstName} {otherPersonLastName}
            </TextRegular>

            <TextSemiBold style={footer.timer}>
              {formatTime(secondsElapsed)}
            </TextSemiBold>
          </View>
          <View style={footer.divider} />
          <View style={footer.buttonsContainer}>
            <TouchableOpacity style={footer.button} onPress={toggleVideo}>
              <CustomIcon
                name={isVideoEnabled ? "videocam" : "videocam-off"}
                size={24}
                color="#FFF"
              />
            </TouchableOpacity>
            <TouchableOpacity style={footer.button} onPress={toggleMute}>
              <CustomIcon
                name={isMuted ? "mic-off" : "mic"}
                size={24}
                color="#FFF"
              />
            </TouchableOpacity>
            <TouchableOpacity style={footer.button} onPress={switchCamera}>
              <CustomIcon name="camera-switch" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={footer.endCallButton}
              onPress={() => router.back()}
            >
              <CustomIcon name="call" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      {localStream ? (
        <RTCView
          streamURL={localStream.toURL()}
          style={[styles.localVideo, { top: insets.top }]}
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
      <CallButtons />
    </View>
  );
};

const footer = StyleSheet.create({
  container: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: "-50%" }],
    zIndex: 9999,
    borderRadius: 24,
    overflow: "hidden",
  },
  userRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  timer: {
    fontSize: 14,
    color: "#FFF7",
  },
  otherPersonName: {
    fontSize: 14,
    color: "#FFF",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#FFF2",
  },
  blurView: {
    flexDirection: "column",
    gap: 16,
    padding: 16,
    backgroundColor: "#FFF2",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 24,
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF1",
    borderWidth: 1,
    borderColor: "#FFF1",
    alignItems: "center",
    justifyContent: "center",
  },
  endCallButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.pink,
    alignItems: "center",
    justifyContent: "center",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
    position: "relative",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  remoteVideo: {
    borderRadius: 8,
    width: "100%",
    height: "100%",
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  localVideo: {
    borderRadius: 8,
    zIndex: 9999,
    width: 128,
    height: 256,
    position: "absolute",
    right: 16,
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
