import { onCall, HttpsError } from "firebase-functions/v2/https";
import { admin } from "../lib/admin";

const listUsers = onCall(async (request) => {
  const { pageSize = 20, pageToken } = request.data as {
    pageSize?: number;
    pageToken?: string; // last uid you got from the previous page
  };

  try {
    let query = admin
      .firestore()
      .collection("users")
      .orderBy("createdAt", "desc")
      .limit(pageSize);

    if (pageToken) {
      const lastDoc = await admin.firestore().doc(`users/${pageToken}`).get();
      if (!lastDoc.exists) {
        throw new HttpsError("not-found", "Invalid pageToken");
      }
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Next page token = last doc’s id
    const nextPageToken =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;

    return { users, nextPageToken };
  } catch (error: any) {
    console.error("Error listing users:", error);
    throw new HttpsError("internal", error.message || "Failed to list users");
  }
});

export { listUsers };
