import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAC9HZxPMxdOmSNtTiA6l942F3FptxRGp8",
  authDomain: "kissel-food-production.firebaseapp.com",
  projectId: "kissel-food-production",
  storageBucket: "kissel-food-production.firebasestorage.app",
  messagingSenderId: "27054489438",
  appId: "1:27054489438:web:a353b95f2ec52d263bd9cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const dbFirestore = getFirestore(app);
