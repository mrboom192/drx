import {
  mediaConstraints,
  peerConstraints,
  sessionConstraints,
} from "@/config/webrtcConfig";
import { onChildAdded, push, ref, remove, set } from "@firebase/database";
import { router } from "expo-router";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";
import { database, db } from "../../firebaseConfig";

type ICECandidateKeyRef = { key: string };

export function useWebRTCCall(
  chatId: string,
  callId: string,
  isCaller: boolean
) {
  // State to hold local and remote media streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peerConnection = useRef<any>(null); // Peer connection reference
  const remoteStreamRef = useRef<MediaStream | null>(null); // Remote stream reference
  const hasSetRemoteDescription = useRef(false); // Flag to check if remote description is set to prevent constant updates
  const queuedCandidates = useRef<RTCIceCandidateInit[]>([]);

  // Firestore reference
  const callDocRef = doc(db, "calls", callId); // The call document

  // Realtime Database references
  const offerCandidatesRef = ref(database, `calls/${callId}/offerCandidates`);
  const answerCandidatesRef = ref(database, `calls/${callId}/answerCandidates`);

  useEffect(() => {
    peerConnection.current = new RTCPeerConnection(peerConstraints);

    if (isCaller) {
      hostCall();
    } else {
      joinCall();
    }

    return () => {
      // Just in case the call is not ended properly
      endCall(false);
    };
  }, []);

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

  async function hostCall() {
    const mediaStream = await getMediaStream();
    if (!mediaStream) return;

    peerConnection.current.addEventListener(
      "icecandidate",
      async (event: any) => {
        if (event.candidate) {
          const candidateJSON = event.candidate.toJSON();
          try {
            const newRef = push(offerCandidatesRef);
            await set(newRef, candidateJSON);
          } catch (err) {
            console.error("[RTDB] Failed to store ICE candidate:", err);
          }
        }
      }
    );

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
        endCall();
      }
    });

    mediaStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, mediaStream);
    });

    const offer = await peerConnection.current.createOffer(sessionConstraints);
    await peerConnection.current.setLocalDescription(offer);
    await setDoc(callDocRef, { offer });

    onSnapshot(callDocRef, async (snapshot) => {
      const data = snapshot.data();
      if (
        data?.answer &&
        !peerConnection.current.currentRemoteDescription &&
        !hasSetRemoteDescription.current
      ) {
        hasSetRemoteDescription.current = true;
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );

        for (const candidate of queuedCandidates.current) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
        queuedCandidates.current = [];
      }
    });

    onChildAdded(answerCandidatesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const candidate = new RTCIceCandidate(data);
        if (peerConnection.current.remoteDescription) {
          peerConnection.current.addIceCandidate(candidate);
        } else {
          queuedCandidates.current.push(data);
        }
      }
    });
  }

  async function joinCall() {
    const mediaStream = await getMediaStream();
    if (!mediaStream) return;

    mediaStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, mediaStream);
    });

    peerConnection.current.addEventListener(
      "icecandidate",
      async (event: any) => {
        if (event.candidate) {
          const candidateJSON = event.candidate.toJSON();
          try {
            const newRef = push(answerCandidatesRef);
            await set(newRef, candidateJSON);
          } catch (err) {
            console.error("[RTDB] Failed to store ICE candidate:", err);
          }
        }
      }
    );

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
        endCall();
      }
    });

    // Listen to the call document, then set remote description
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

          for (const candidate of queuedCandidates.current) {
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          }
          queuedCandidates.current = [];
        } catch (err) {
          console.error("[Participant] Error handling offer/answer:", err);
        }
      }
    });

    // Listen for ICE candidates from the caller
    onChildAdded(offerCandidatesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const candidate = new RTCIceCandidate(data);
        if (peerConnection.current.remoteDescription) {
          peerConnection.current.addIceCandidate(candidate);
        } else {
          queuedCandidates.current.push(data);
        }
      }
    });
  }

  async function endCall(canGoBack = true) {
    peerConnection.current?.close();
    localStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());

    const chatDocRef = doc(db, "chats", chatId);
    await updateDoc(chatDocRef, { hasActiveCall: false });

    await remove(offerCandidatesRef);
    await remove(answerCandidatesRef);

    canGoBack && router.back();
  }

  return { localStream, remoteStream };
}
