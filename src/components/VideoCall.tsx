import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RTCPeerConnection, mediaDevices } from "react-native-webrtc";

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default async function VideoCall({
  callId,
  isCaller,
}: {
  callId: string;
  isCaller: boolean;
}) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);

  // Define the media constraints
  let mediaConstraints = {
    audio: true, // Enable audio track
    video: {
      // Enable video track
      frameRate: 30,
      facingMode: "user",
    },
  };

  let localMediaStream;
  let remoteMediaStream;
  let isVoiceOnly = false;

  try {
    const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

    if (isVoiceOnly) {
      let videoTrack = await mediaStream.getVideoTracks()[0];
      videoTrack.enabled = false;
    }

    localMediaStream = mediaStream;
  } catch (err) {
    // Handle Error
  }

  return (
    <View style={styles.container}>
      {/* {localStream && (
        <RTCView
          streamURL={localStream.get}
          style={styles.selfView}
          objectFit="cover"
        />
      )} */}
      {/* {remoteStream && (
        <RTCView
          streamURL={remoteStream}
          style={styles.remoteView}
          objectFit="cover"
        />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  selfView: {
    width: 120,
    height: 160,
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 2,
  },
  remoteView: { flex: 1 },
});
