import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAC9HZxPMxdOmSNtTiA6l942F3FptxRGp8",
  authDomain: "kissel-food-production.firebaseapp.com",
  projectId: "kissel-food-production",
  storageBucket: "kissel-food-production.firebasestorage.app",
  messagingSenderId: "27054489438",
  appId: "1:27054489438:web:a353b95f2ec52d263bd9cf"
};

const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  timestamp: string;
  paystackRef: string;
  status: "Pending" | "Completed";
}

export interface Reservation {
  id: string;
  name: string;
  date: string;
  time: string;
  guests: string;
  occasion: string;
  specialRequests: string;
  timestamp: string;
  status: "Confirmed" | "Seated";
}

// Database helper functions using Firebase Firestore
export const db = {
  // --- ORDERS ---
  saveOrder: async (order: Omit<Order, "id" | "timestamp" | "status">) => {
    try {
      const docRef = await addDoc(collection(firestoreDb, "orders"), {
        ...order,
        status: "Pending",
        timestamp: new Date().toISOString()
      });
      return docRef.id;
    } catch (e) {
      console.error("Error saving order: ", e);
    }
  },

  updateOrderStatus: async (id: string, status: "Pending" | "Completed") => {
    try {
      await updateDoc(doc(firestoreDb, "orders", id), { status });
    } catch (e) {
      console.error("Error updating order: ", e);
    }
  },

  // --- RESERVATIONS ---
  saveReservation: async (reservation: Omit<Reservation, "id" | "timestamp" | "status">) => {
    try {
      const docRef = await addDoc(collection(firestoreDb, "reservations"), {
        ...reservation,
        status: "Confirmed",
        timestamp: new Date().toISOString()
      });
      return docRef.id;
    } catch (e) {
      console.error("Error saving reservation: ", e);
    }
  },

  updateReservationStatus: async (id: string, status: "Confirmed" | "Seated") => {
    try {
      await updateDoc(doc(firestoreDb, "reservations", id), { status });
    } catch (e) {
      console.error("Error updating reservation: ", e);
    }
  }
};
