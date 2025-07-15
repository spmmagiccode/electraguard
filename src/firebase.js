// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔐 Replace these values with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAbKwUkfNHB0JDaPundGMHyv5m7BECCkjQ",
  authDomain: "egv1-46e7d.firebaseapp.com",
  projectId: "egv1-46e7d",
  storageBucket: "egv1-46e7d.firebasestorage.app",
  messagingSenderId: "977259524191",
  appId: "1:977259524191:web:2ff0190b595318122aabea",
  databaseURL: "https://egv1-46e7d.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
