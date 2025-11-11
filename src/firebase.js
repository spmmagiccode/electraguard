import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // ⬅️ Import Realtime Database

const firebaseConfig = {
  databaseURL: "https://electraguard-e0f02-default-rtdb.firebaseio.com",
  apiKey: "AIzaSyBfVIm2SJP0C_YshYTmPVxR0n7B1okxwUo",
  authDomain: "electraguard-e0f02.firebaseapp.com",
  projectId: "electraguard-e0f02",
  storageBucket: "electraguard-e0f02.firebasestorage.app",
  messagingSenderId: "362016057053",
  appId: "1:362016057053:web:095e27d067e208260d1d34",
  measurementId: "G-3XWMLESRRR",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app); // ✅ Export Realtime Database instance
export const firestore = getFirestore(app);
