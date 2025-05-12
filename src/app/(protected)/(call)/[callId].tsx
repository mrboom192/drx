import { TextSemiBold } from "@/components/StyledText";
import {
  mediaConstraints,
  peerConstraints,
  sessionConstraints,
} from "@/config/webrtcConfig";
import Colors from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from "react-native-webrtc";
import { db } from "../../../../firebaseConfig";

type CallProps = {
  callId: string;
  callerType: string;
};

const Call = () => {
  // Get callId and callerType (either "caller" or "callee") from URL params
  const { callId, callerType } = useLocalSearchParams<CallProps>();

  // State for managing media streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // Initialize peer connection
  const peerConnection = useRef<any>(null);

  //Firestore refs
  const callDocRef = doc(db, "calls", callId); // Call document
  const offersCollectionRef = collection(callDocRef, "offerCandidates"); // Offer candidates
  const answersCollectionRef = collection(callDocRef, "answerCandidates"); // Answer candidates
  const offersDocsRef = useRef<any[]>([]);
  const answersDocsRef = useRef<any[]>([]);

  // Check if current user is the one initiating the call
  const isCaller = callerType === "caller";

  // Track whether the remote SDP has been set already
  const hasSetRemoteDescription = useRef(false);

  // Refs for remote stream and seen ICE candidates to avoid duplicates
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const seenCandidates = useRef<Set<string>>(new Set());

  // Main setup effect: initiates the call flow based on caller type
  useEffect(() => {
    // Set up the peerconnection
    peerConnection.current = new RTCPeerConnection(peerConstraints);

    if (isCaller) {
      startCallAsHost(); // Caller creates offer
    } else {
      joinCallAsParticipant(); // Callee answers offer
    }

    return () => {
      endCall();
    };
  }, []);

  // Cleanup peer connection and media tracks on unmount
  async function endCall() {
    peerConnection.current.close();
    localStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());

    for (const doc of offersDocsRef.current) {
      await deleteDoc(doc.ref);
    }

    for (const doc of answersDocsRef.current) {
      await deleteDoc(doc.ref);
    }
  }

  // Helper function to request camera and microphone access
  async function getMediaStream() {
    try {
      const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
      setLocalStream(mediaStream);
      return mediaStream;
    } catch (err) {
      console.error("[Media] Failed to get user media:", err);
      return null;
    }
  }

  // The vast majority of the work is just signaling data between the two users
  // Caller logic: sets up offer, handles ICE, listens for answer
  async function startCallAsHost() {
    const mediaStream = await getMediaStream();
    if (!mediaStream) return;

    // References for storing ICE candidates
    const myCandidatesRef = offersCollectionRef;
    const theirCandidatesRef = answersCollectionRef;

    // Listen for ICE candidates and add them to Firestore
    peerConnection.current.addEventListener(
      "icecandidate",
      async (event: any) => {
        if (event.candidate) {
          const candidateJSON = event.candidate.toJSON();
          try {
            // About 20ish writes to Firestore
            await addDoc(myCandidatesRef, candidateJSON);
          } catch (err) {
            console.error("[Firestore] Failed to store ICE candidate:", err);
          }
        }
      }
    );

    // Handle incoming media tracks
    peerConnection.current.addEventListener("track", (event: any) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
        setRemoteStream(remoteStreamRef.current);
      }
      if (event.track.kind === "video" || event.track.kind === "audio") {
        remoteStreamRef.current.addTrack(event.track);
      }
    });

    peerConnection.current.addEventListener("iceconnectionstatechange", () => {
      const state = peerConnection.current.iceConnectionState;
      const peerDisconnected =
        state === "disconnected" || state === "failed" || state === "closed";

      if (peerDisconnected) {
        router.back();
      }
    });

    // Add local media tracks to peer connection
    mediaStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, mediaStream);
    });

    // Create and set local SDP offer
    const offer = await peerConnection.current.createOffer(sessionConstraints);
    await peerConnection.current.setLocalDescription(offer);

    // Save offer to Firestore
    await setDoc(callDocRef, { offer });

    // Listen for answer from callee
    onSnapshot(callDocRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.answer && !peerConnection.current.currentRemoteDescription) {
        peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      }
    });

    // Listen for ICE candidates from callee
    onSnapshot(theirCandidatesRef, (snapshot) => {
      // Save ref to these documents for cleanup later
      answersDocsRef.current = snapshot.docs;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const key = JSON.stringify(data);
        if (!seenCandidates.current.has(key)) {
          peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
          seenCandidates.current.add(key);
        }
      });
    });
  }

  // Callee logic: waits for offer, sends answer, handles ICE
  async function joinCallAsParticipant() {
    const mediaStream = await getMediaStream();
    if (!mediaStream) return;

    // ICE candidate references are inverted compared to caller
    const myCandidatesRef = answersCollectionRef;
    const theirCandidatesRef = offersCollectionRef;

    // Add local tracks
    mediaStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, mediaStream);
    });

    // Listen for own ICE candidates and save to Firestore
    peerConnection.current.addEventListener(
      "icecandidate",
      async (event: any) => {
        if (event.candidate) {
          const candidateJSON = event.candidate.toJSON();
          try {
            await addDoc(myCandidatesRef, candidateJSON);
          } catch (err) {
            console.error("[Firestore] Failed to store ICE candidate:", err);
          }
        }
      }
    );

    // Handle incoming tracks
    peerConnection.current.addEventListener("track", (event: any) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
        setRemoteStream(remoteStreamRef.current);
      }
      if (event.track.kind === "video" || event.track.kind === "audio") {
        remoteStreamRef.current.addTrack(event.track);
      }
    });

    peerConnection.current.addEventListener("iceconnectionstatechange", () => {
      const state = peerConnection.current.iceConnectionState;
      const peerDisconnected =
        state === "disconnected" || state === "failed" || state === "closed";

      if (peerDisconnected) {
        router.back();
      }
    });

    // Wait for offer and respond with an answer
    onSnapshot(callDocRef, async (snapshot) => {
      const data = snapshot.data();
      if (
        data?.offer &&
        !peerConnection.current.currentRemoteDescription &&
        !hasSetRemoteDescription.current
      ) {
        hasSetRemoteDescription.current = true;
        try {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          await updateDoc(callDocRef, { answer });
        } catch (err) {
          console.error("[Participant] Error handling offer/answer:", err);
        }
      }
    });

    // Listen for ICE candidates from caller
    // Listens to the entire collection!! Fix this
    onSnapshot(theirCandidatesRef, (snapshot) => {
      // Save ref to these documents for cleanup later
      offersDocsRef.current = snapshot.docs;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const key = JSON.stringify(data);
        if (!seenCandidates.current.has(key)) {
          peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
          seenCandidates.current.add(key);
        }
      });
    });
  }

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
