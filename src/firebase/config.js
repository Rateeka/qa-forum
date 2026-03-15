// src/firebase/config.js
// IMPORTANT: Replace these values with your actual Firebase project config
// Go to: Firebase Console → Project Settings → Your Apps → Web App → Config

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBb9Mf0q-J-MUMSrDdi-6Qofd4lUqjWN6Q",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "qa-forum-40011.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "qa-forum-40011",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "qa-forum-40011.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "327942420212",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:327942420212:web:8ca112f9f4c2e7b6be50a1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;
