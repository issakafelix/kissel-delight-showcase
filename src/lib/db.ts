import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  Unsubscribe,
} from "firebase/firestore";
import { dbFirestore as firestoreDb } from "@/lib/firebase";
import { MenuItem, DEFAULT_MENU } from "@/lib/menu-data";

export { firestoreDb };

export interface OrderItemAddon {
  name: string;
  price: number; // pesewas
}

export interface OrderItem {
  itemId?: string;
  name: string;
  price: number; // pesewas — unit price incl. chosen variant + add-ons
  quantity: number;
  variantName?: string;
  addons?: OrderItemAddon[];
}

export type OrderStatus = "Pending" | "Preparing" | "Ready" | "Completed" | "Cancelled";
export type OrderType = "pickup" | "delivery";

export const ORDER_FLOW: OrderStatus[] = ["Pending", "Preparing", "Ready", "Completed"];

export interface Order {
  id: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderType: OrderType;
  deliveryAddress?: string;
  notes?: string;
  timestamp: string;
  paystackRef: string;
  status: OrderStatus;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  occasion: string;
  specialRequests: string;
  timestamp: string;
  status: "Confirmed" | "Seated";
}

const ordersCol = () => collection(firestoreDb, "orders");
const reservationsCol = () => collection(firestoreDb, "reservations");
const menuCol = () => collection(firestoreDb, "menuItems");

// Database helper functions using Firebase Firestore.
// Write helpers rethrow on failure so callers can surface real errors.
export const db = {
  // --- ORDERS ---
  // NOTE: orders are CREATED server-side only (api/orders.ts) after the
  // payment is verified with Paystack; Firestore rules block client creates.

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    await updateDoc(doc(firestoreDb, "orders", id), { status });
  },

  subscribeOrders: (onChange: (orders: Order[]) => void): Unsubscribe => {
    const q = query(ordersCol(), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Order[]);
    });
  },

  subscribeOrder: (
    id: string,
    onChange: (order: Order | null) => void,
    onError?: (e: Error) => void
  ): Unsubscribe => {
    return onSnapshot(
      doc(firestoreDb, "orders", id),
      (snapshot) => {
        onChange(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Order) : null);
      },
      onError
    );
  },

  // --- RESERVATIONS ---
  saveReservation: async (
    reservation: Omit<Reservation, "id" | "timestamp" | "status">
  ): Promise<string> => {
    const docRef = await addDoc(reservationsCol(), {
      ...reservation,
      status: "Confirmed",
      timestamp: new Date().toISOString(),
    });
    return docRef.id;
  },

  updateReservationStatus: async (id: string, status: "Confirmed" | "Seated") => {
    await updateDoc(doc(firestoreDb, "reservations", id), { status });
  },

  subscribeReservations: (onChange: (reservations: Reservation[]) => void): Unsubscribe => {
    const q = query(reservationsCol(), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Reservation[]);
    });
  },

  // --- MENU ---
  fetchMenu: async (): Promise<MenuItem[]> => {
    const snapshot = await getDocs(query(menuCol(), orderBy("sortOrder", "asc")));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as MenuItem[];
  },

  subscribeMenu: (onChange: (items: MenuItem[]) => void): Unsubscribe => {
    const q = query(menuCol(), orderBy("sortOrder", "asc"));
    return onSnapshot(q, (snapshot) => {
      onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as MenuItem[]);
    });
  },

  addMenuItem: async (item: Omit<MenuItem, "id">): Promise<string> => {
    const docRef = await addDoc(menuCol(), item);
    return docRef.id;
  },

  updateMenuItem: async (id: string, changes: Partial<Omit<MenuItem, "id">>) => {
    await updateDoc(doc(firestoreDb, "menuItems", id), changes);
  },

  deleteMenuItem: async (id: string) => {
    await deleteDoc(doc(firestoreDb, "menuItems", id));
  },

  // Reset the menu to the built-in default catalog: clears every existing
  // item, then writes DEFAULT_MENU. One batch (delete + set) is atomic.
  seedMenu: async () => {
    const existing = await getDocs(menuCol());
    const batch = writeBatch(firestoreDb);
    existing.docs.forEach((d) => batch.delete(d.ref));
    DEFAULT_MENU.forEach((item) => batch.set(doc(menuCol()), item));
    await batch.commit();
  },
};
