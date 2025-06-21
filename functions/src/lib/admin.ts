import admin from "firebase-admin";

if (!admin.app.length) {
  admin.initializeApp();
}

export { admin };
