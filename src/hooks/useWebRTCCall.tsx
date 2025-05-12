import {
  mediaConstraints,
  peerConstraints,
  sessionConstraints,
} from "@/config/webrtcConfig";
import { onChildAdded, push, ref, remove, set } from "@firebase/database";
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

export function useWebRTCCall(
  chatId: string,
  callId: string,
  isCaller: boolean
) {
  // State to hold local and remote media streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // For UX
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

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
      endCall();
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

  async function endCall() {
    peerConnection.current?.close();
    localStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());

    const chatDocRef = doc(db, "chats", chatId);
    await updateDoc(chatDocRef, { hasActiveCall: false });

    await remove(offerCandidatesRef);
    await remove(answerCandidatesRef);
  }

  async function switchCamera() {
    if (!localStream || !peerConnection.current) return;

    const newFacingMode = facingMode === "user" ? "environment" : "user";

    try {
      // Stop old video tracks
      localStream.getVideoTracks().forEach((track) => track.stop());

      // Get new stream with the opposite facing mode
      const newStream = await mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: newFacingMode,
        },
      });

      const newVideoTrack = newStream.getVideoTracks()[0];
      const videoSender = peerConnection.current
        .getSenders()
        .find((s: { track: { kind: string } }) => s.track?.kind === "video");

      if (videoSender && newVideoTrack) {
        await videoSender.replaceTrack(newVideoTrack);
      }

      // Combine with existing audio tracks
      const updatedStream = new MediaStream([
        newVideoTrack,
        ...localStream.getAudioTracks(),
      ]);
      setLocalStream(updatedStream);
      setFacingMode(newFacingMode);
    } catch (error) {
      console.error("[Camera Switch] Failed to switch camera:", error);
    }
  }

  function toggleMute() {
    if (!localStream) return;

    const newMuteState = !isMuted;

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !newMuteState; // false = muted, true = unmuted
    });

    setIsMuted(newMuteState);
  }

  function toggleVideo() {
    if (!localStream) return;

    const newVideoState = !isVideoEnabled;

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = newVideoState;
    });

    setIsVideoEnabled(newVideoState);
  }

  return {
    localStream,
    remoteStream,
    switchCamera,
    toggleMute,
    toggleVideo,
    isVideoEnabled,
    isMuted,
    endCall,
    facingMode,
  };
}
