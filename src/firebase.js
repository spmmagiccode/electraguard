import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // ⬅️ Import Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyB_9JFKJRp8byB1wRhryEfnW-HSv6DQIdk",
  authDomain: "finalproject-7d0bc.firebaseapp.com",
  databaseURL: "https://finalproject-7d0bc-default-rtdb.firebaseio.com",
  projectId: "finalproject-7d0bc",
  storageBucket: "finalproject-7d0bc.firebasestorage.app",
  messagingSenderId: "1008219642891",
  appId: "1:1008219642891:web:667a568b397415811fbb0e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app); // ✅ Export Realtime Database instance
export const firestore = getFirestore(app);
