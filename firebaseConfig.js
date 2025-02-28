// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDatPsHvrKYG6-bRaUdIud_b1rlcuEf9hI",
  authDomain: "doctorx-8f72d.firebaseapp.com",
  projectId: "doctorx-8f72d",
  storageBucket: "doctorx-8f72d.firebasestorage.app",
  messagingSenderId: "459117120227",
  appId: "1:459117120227:web:0567bbb88a7826386a53d6",
  measurementId: "G-P8SPCEFL06",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };

const analytics = getAnalytics(app);
