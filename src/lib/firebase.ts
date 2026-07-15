import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase web config is not a secret (it ships in every client bundle);
// env vars let a buyer rebrand/redeploy this template without code changes.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyAC9HZxPMxdOmSNtTiA6l942F3FptxRGp8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "kissel-food-production.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "kissel-food-production",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "kissel-food-production.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "27054489438",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:27054489438:web:a353b95f2ec52d263bd9cf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Cloud Firestore
export const dbFirestore = getFirestore(app);

// Firebase Auth (admin dashboard login)
export const firebaseAuth = getAuth(app);
