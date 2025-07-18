import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // ⬅️ Import Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyAbKwUkfNHB0JDaPundGMHyv5m7BECCkjQ",
  authDomain: "egv1-46e7d.firebaseapp.com",
  projectId: "egv1-46e7d",
  storageBucket: "egv1-46e7d.appspot.com", // 🛠️ fixed the typo here: changed `.app` to `.appspot.com`
  messagingSenderId: "977259524191",
  appId: "1:977259524191:web:2ff0190b595318122aabea",
  databaseURL: "https://egv1-46e7d-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app); // ✅ Export Realtime Database instance
export const firestore = getFirestore(app);
