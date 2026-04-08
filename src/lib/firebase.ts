import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7SphPeu7L1d1Pay_bDssoYnPnPlZdOLA",
  authDomain: "chatbot-85fe6.firebaseapp.com",
  projectId: "chatbot-85fe6",
  storageBucket: "chatbot-85fe6.firebasestorage.app",
  messagingSenderId: "108894032043",
  appId: "1:108894032043:web:abcd1234abcd1234abcd12" // Placeholder, Firebase may complain without it
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const dbFirestore = getFirestore(app);
