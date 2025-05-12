import {
  mediaConstraints,
  peerConstraints,
  sessionConstraints,
} from "@/config/webrtcConfig";
import { router } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";
import { db } from "../../firebaseConfig";

type ICECandidateDocRef = { ref: DocumentReference };

export function useWebRTCCall(callId: string, isCaller: boolean) {
  // State to hold local and remote media streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peerConnection = useRef<any>(null); // Peer connection reference
  const remoteStreamRef = useRef<MediaStream | null>(null); // Remote stream reference
  const hasSetRemoteDescription = useRef(false); // Flag to check if remote description is set to prevent constant updates

  // Firestore references
  const callDocRef = doc(db, "calls", callId); // The call document
  const offersCollectionRef = collection(callDocRef, "offerCandidates"); // Offers collection
  const answersCollectionRef = collection(callDocRef, "answerCandidates"); // Answers collection
  const offersDocsRef = useRef<ICECandidateDocRef[]>([]); // Refs to each offer to delete later
  const answersDocsRef = useRef<ICECandidateDocRef[]>([]); // Refs to each answer to delete later

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

    const myCandidatesRef = offersCollectionRef;
    const theirCandidatesRef = answersCollectionRef;

    peerConnection.current.addEventListener(
      "icecandidate",
      async (event: any) => {
        if (event.candidate) {
          const candidateJSON = event.candidate.toJSON();
          try {
            const docRef = await addDoc(myCandidatesRef, candidateJSON);
            offersDocsRef.current.push({ ref: docRef });
          } catch (err) {
            console.error("[Firestore] Failed to store ICE candidate:", err);
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

    onSnapshot(callDocRef, (snapshot) => {
      const data = snapshot.data();
      if (
        data?.answer &&
        !peerConnection.current.currentRemoteDescription &&
        !hasSetRemoteDescription.current
      ) {
        hasSetRemoteDescription.current = true;
        peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      }
    });

    onSnapshot(theirCandidatesRef, (snapshot) => {
      answersDocsRef.current = snapshot.docs;

      snapshot.forEach((doc) => {
        const data = doc.data();
        peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
      });
    });
  }

  async function joinCall() {
    const mediaStream = await getMediaStream();
    if (!mediaStream) return;

    const myCandidatesRef = answersCollectionRef;
    const theirCandidatesRef = offersCollectionRef;

    mediaStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, mediaStream);
    });

    peerConnection.current.addEventListener(
      "icecandidate",
      async (event: any) => {
        if (event.candidate) {
          const candidateJSON = event.candidate.toJSON();
          try {
            const docRef = await addDoc(myCandidatesRef, candidateJSON);
            answersDocsRef.current.push({ ref: docRef });
          } catch (err) {
            console.error("[Firestore] Failed to store ICE candidate:", err);
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
        } catch (err) {
          console.error("[Participant] Error handling offer/answer:", err);
        }
      }
    });

    // Listen for ICE candidates from the caller
    onSnapshot(theirCandidatesRef, (snapshot) => {
      offersDocsRef.current = snapshot.docs;

      snapshot.forEach((doc) => {
        const data = doc.data();
        peerConnection.current.addIceCandidate(new RTCIceCandidate(data));
      });
    });
  }

  async function endCall(canGoBack = true) {
    peerConnection.current?.close();
    localStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());
    for (const doc of offersDocsRef.current) await deleteDoc(doc.ref);
    for (const doc of answersDocsRef.current) await deleteDoc(doc.ref);

    canGoBack && router.back();
  }

  return { localStream, remoteStream };
}
