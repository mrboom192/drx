import { BillingDetails } from "@stripe/stripe-react-native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export const addBillingDetails = async (billingDetails: BillingDetails) => {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error("User must be authenticated to add billing details.");
  }

  const billingRef = collection(
    db,
    "stripe_customers",
    userId,
    "billing_addresses"
  );

  const docRef = await addDoc(billingRef, {
    ...billingDetails,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};
