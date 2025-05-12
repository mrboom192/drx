import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const listenForCall = (
  callId: string,
  onSignal: (data: any) => void
) => {
  return onSnapshot(doc(db, "calls", callId), (snapshot) => {
    if (snapshot.exists()) {
      onSignal(snapshot.data());
    }
  });
};

export const sendSignal = async (callId: string, data: any) => {
  const ref = doc(db, "calls", callId);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    await updateDoc(ref, data);
  } else {
    await setDoc(ref, data);
  }
};
