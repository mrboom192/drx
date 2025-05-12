import { useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from "react-native-webrtc";
import { db } from "../../../../firebaseConfig";

const peerConstraints = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "turn:turn.anyfirewall.com:443?transport=tcp",
      username: "webrtc",
      credential: "webrtc",
    },
  ],
};

let sessionConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true,
  },
};

const Call = () => {
  const { callId, callerType } = useLocalSearchParams<{
    callId: string;
    callerType: string;
  }>();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const isCaller = callerType === "caller";
  const hasSetRemoteDescription = useRef(false);

  const peerConnection = new RTCPeerConnection(peerConstraints) as any;
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const seenCandidates = useRef<Set<string>>(new Set());

  const callDocRef = doc(db, "calls", callId);

  useEffect(() => {
    console.log("[DEBUG] Call component rendered at", new Date().toISOString());
    console.log(
      `[Init] Role: ${isCaller ? "Caller" : "Participant"} | Call ID: ${callId}`
    );

    if (!peerConnection.current) {
      console.log("[PeerConnection] Creating new RTCPeerConnection");
      peerConnection.current = new RTCPeerConnection(peerConstraints);
    }

    if (isCaller) {
      startCallAsHost();
    } else {
      joinCallAsParticipant();
    }

    return () => {
      console.log("[Cleanup] Closing peer connection and stopping all tracks");
      peerConnection.current?.close();
      localStream?.getTracks().forEach((track) => {
        console.log("[Cleanup] Stopping local track:", track.kind);
        track.stop();
      });
      remoteStream?.getTracks().forEach((track) => {
        console.log("[Cleanup] Stopping remote track:", track.kind);
        track.stop();
      });
    };
  }, []);

  async function getMediaStream() {
    try {
      console.log("[Media] Requesting user media...");
      const mediaStream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          frameRate: 24,
          facingMode: "user",
        },
      });
      console.log("[Media] Got user media stream");
      setLocalStream(mediaStream);
      return mediaStream;
    } catch (err) {
      console.error("[Media] Failed to get user media:", err);
      return null;
    }
  }

  async function startCallAsHost() {
    console.log("[Caller] Initializing host call...");
    const mediaStream = await getMediaStream();
    if (!mediaStream) return;

    const myCandidatesRef = collection(callDocRef, "offerCandidates");
    const theirCandidatesRef = collection(callDocRef, "answerCandidates");

    peerConnection.current.addEventListener(
      "icecandidate",
      async (event: any) => {
        if (event.candidate) {
          const candidateJSON = event.candidate.toJSON();
          console.log("[ICE] New ICE candidate:", candidateJSON);

          try {
            await addDoc(myCandidatesRef, candidateJSON);
            console.log("[Firestore] ICE candidate stored in subcollection");
          } catch (err) {
            console.error("[Firestore] Failed to store ICE candidate:", err);
          }
        }
      }
    );

    peerConnection.current.addEventListener("track", (event: any) => {
      console.log("[Track Event] Received track:", event.track.kind);

      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
        setRemoteStream(remoteStreamRef.current);
      }

      if (event.track.kind === "video" || event.track.kind === "audio") {
        remoteStreamRef.current.addTrack(event.track);
        console.log(
          "[Track Event] Added track to remote stream:",
          event.track.kind
        );
      }
    });

    peerConnection.current.addEventListener("icegatheringstatechange", () => {
      console.log(
        "[ICE] Gathering state:",
        peerConnection.current.iceGatheringState
      );
    });

    mediaStream.getTracks().forEach((track) => {
      console.log(
        "[Caller] Adding local track to peer connection:",
        track.kind
      );
      peerConnection.current.addTrack(track, mediaStream);
    });

    const offer = await peerConnection.current.createOffer(sessionConstraints);
    console.log("[Caller] Created offer:", offer);
    await peerConnection.current.setLocalDescription(offer);
    console.log("[Caller] Set local description (offer)");

    await setDoc(callDocRef, { offer });
    console.log("[Firebase] Stored offer in Firestore");

    onSnapshot(callDocRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.answer && !peerConnection.current.currentRemoteDescription) {
        console.log("[Caller] Received answer from Firestore:", data.answer);
        peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      }
    });

    onSnapshot(theirCandidatesRef, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        const key = JSON.stringify(data);
        if (!seenCandidates.current.has(key)) {
          console.log(
            "[Caller] Adding answer ICE candidate from Firestore:",
            data
          );
          peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
          seenCandidates.current.add(key);
        }
      });
    });
  }

  async function joinCallAsParticipant() {
    console.log("[Participant] Joining call...");
    const mediaStream = await getMediaStream();
    if (!mediaStream) return;

    const myCandidatesRef = collection(callDocRef, "answerCandidates");
    const theirCandidatesRef = collection(callDocRef, "offerCandidates");

    mediaStream.getTracks().forEach((track) => {
      console.log(
        "[Participant] Adding local track to peer connection:",
        track.kind
      );
      peerConnection.current.addTrack(track, mediaStream);
    });

    peerConnection.current.addEventListener(
      "icecandidate",
      async (event: any) => {
        if (event.candidate) {
          const candidateJSON = event.candidate.toJSON();
          console.log("[ICE] New ICE candidate:", candidateJSON);

          try {
            await addDoc(myCandidatesRef, candidateJSON);
            console.log("[Firestore] ICE candidate stored in subcollection");
          } catch (err) {
            console.error("[Firestore] Failed to store ICE candidate:", err);
          }
        }
      }
    );

    peerConnection.current.addEventListener("track", (event: any) => {
      console.log("[Track Event] Received track:", event.track.kind);

      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
        setRemoteStream(remoteStreamRef.current);
      }

      if (event.track.kind === "video" || event.track.kind === "audio") {
        remoteStreamRef.current.addTrack(event.track);
        console.log(
          "[Track Event] Added track to remote stream:",
          event.track.kind
        );
      }
    });

    peerConnection.current.addEventListener("icegatheringstatechange", () => {
      console.log(
        "[ICE] Gathering state:",
        peerConnection.current.iceGatheringState
      );
    });

    onSnapshot(callDocRef, async (snapshot) => {
      const data = snapshot.data();
      if (
        data?.offer &&
        !peerConnection.current.currentRemoteDescription &&
        !hasSetRemoteDescription.current
      ) {
        hasSetRemoteDescription.current = true;
        console.log("[Participant] Received offer from Firestore:", data.offer);
        try {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          console.log("[Participant] Set remote description (offer)");

          const answer = await peerConnection.current.createAnswer();
          console.log("[Participant] Created answer:", answer);

          await peerConnection.current.setLocalDescription(answer);
          console.log("[Participant] Set local description (answer)");

          await updateDoc(callDocRef, { answer });
          console.log("[Firebase] Stored answer in Firestore");
        } catch (err) {
          console.error("[Participant] Error handling offer/answer:", err);
        }
      }
    });

    onSnapshot(theirCandidatesRef, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        const key = JSON.stringify(data);
        if (!seenCandidates.current.has(key)) {
          console.log(
            "[Participant] Adding offer ICE candidate from Firestore:",
            data
          );
          peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
          seenCandidates.current.add(key);
        }
      });
    });
  }

  return (
    <View style={styles.container}>
      {localStream ? (
        <>
          {console.log("[RTCView] localStream.toURL():", localStream?.toURL())}
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            objectFit="contain" // Use 'contain' to avoid cropping during debugging
          />
        </>
      ) : (
        <Text style={styles.status}>Waiting for local stream...</Text>
      )}

      {remoteStream ? (
        <>
          {console.log(
            "[RTCView] remoteStream.toURL():",
            remoteStream?.toURL()
          )}
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
            objectFit="cover"
          />
        </>
      ) : (
        <Text style={styles.status}>Waiting for remote stream...</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  localVideo: {
    width: 200, // fixed size for debugging visibility
    height: 300,
    backgroundColor: "#333",
    zIndex: 2,
    marginBottom: 20,
  },
  remoteVideo: {
    width: "100%",
    height: "50%",
    backgroundColor: "#111",
    zIndex: 1,
  },
  status: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default Call;
