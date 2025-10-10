// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ <-- You forgot this import

const firebaseConfig = {
  apiKey: "AIzaSyBW7eF7k8WM-whI9pwYkkd-5qqttbggQbc",
  authDomain: "blogify-8401a.firebaseapp.com",
  projectId: "blogify-8401a",
  storageBucket: "blogify-8401a.firebasestorage.app",
  messagingSenderId: "736504626871",
  appId: "1:736504626871:web:2f9af09f2867133a6cd732",
  measurementId: "G-BBW27QFH3P",
};

// ✅ Prevent multiple initializations (important for Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ now properly imported and used
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export default app;
