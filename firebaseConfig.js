// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDatPsHvrKYG6-bRaUdIud_b1rlcuEf9hI",
  authDomain: "doctorx-8f72d.firebaseapp.com",
  databaseURL: "https://doctorx-8f72d-default-rtdb.firebaseio.com",
  projectId: "doctorx-8f72d",
  storageBucket: "doctorx-8f72d.firebasestorage.app",
  messagingSenderId: "459117120227",
  appId: "1:459117120227:web:0567bbb88a7826386a53d6",
  measurementId: "G-P8SPCEFL06",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firebase Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

const functions = getFunctions(app);

export { auth, database, db, functions, storage };

// const analytics = getAnalytics(app);
