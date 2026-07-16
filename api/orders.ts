import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Must match DELIVERY_FEE in src/components/Cart.tsx — the server value is
// authoritative; a mismatch causes the paid-amount check to reject the order.
const DELIVERY_FEE = 10;
const MAX_ITEMS = 30;
const MAX_QTY = 50;

interface IncomingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Accepts the service account as base64 (FIREBASE_SERVICE_ACCOUNT_B64) or raw
// JSON (FIREBASE_SERVICE_ACCOUNT). Tolerant of paste artifacts: BOM, wrapping
// quotes, whitespace, a "KISSEL::" sacrificial prefix (absorbs a dropped first
// character), and a dropped leading "{" / trailing "}" on raw JSON.
const getServiceAccount = (): object => {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  let raw: string | undefined;

  if (b64) {
    // Drop anything up to and including a "::" marker, then keep only
    // base64 characters — a dropped first char lands in the discarded prefix.
    const afterMarker = b64.includes("::") ? b64.slice(b64.lastIndexOf("::") + 2) : b64;
    const clean = afterMarker.replace(/[^A-Za-z0-9+/=]/g, "");
    raw = Buffer.from(clean, "base64").toString("utf8");
  } else {
    raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  }
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT / _B64 env var is not set");

  let s = raw.replace(/^﻿/, "").trim().replace(/^['"]+|['"]+$/g, "").trim();
  if (!s.startsWith("{")) s = "{" + s;
  if (!s.endsWith("}")) s = s + "}";

  const parsed = JSON.parse(s);
  if (!parsed.private_key || !parsed.client_email || !parsed.project_id)
    throw new Error("service account JSON is missing required fields");
  return parsed;
};

const getDb = (): Firestore => {
  if (!getApps().length) {
    initializeApp({ credential: cert(getServiceAccount()) });
  }
  return getFirestore();
};

const bad = (res: VercelResponse, status: number, message: string) =>
  res.status(status).json({ error: message });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return bad(res, 405, "Method not allowed");

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return bad(res, 500, "Payment verification is not configured (PAYSTACK_SECRET_KEY missing)");

  const {
    reference,
    items,
    customerEmail,
    customerPhone,
    orderType,
    deliveryAddress,
    notes,
  } = (req.body ?? {}) as {
    reference?: string;
    items?: IncomingItem[];
    customerEmail?: string;
    customerPhone?: string;
    orderType?: string;
    deliveryAddress?: string;
    notes?: string;
  };

  // ── Basic input validation ──────────────────────────────────────────────
  if (!reference || typeof reference !== "string" || reference.length > 100)
    return bad(res, 400, "Missing or invalid payment reference");
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS)
    return bad(res, 400, "Missing or invalid order items");
  if (!customerEmail || typeof customerEmail !== "string" || customerEmail.length > 255)
    return bad(res, 400, "Missing customer email");
  if (!customerPhone || typeof customerPhone !== "string" || customerPhone.length > 30)
    return bad(res, 400, "Missing customer phone");
  if (orderType !== "pickup" && orderType !== "delivery")
    return bad(res, 400, "Invalid order type");
  if (orderType === "delivery" && (!deliveryAddress || typeof deliveryAddress !== "string"))
    return bad(res, 400, "Delivery orders require an address");

  for (const item of items) {
    if (typeof item?.id !== "string" || typeof item?.name !== "string" || item.name.length > 200)
      return bad(res, 400, "Invalid item in order");
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QTY)
      return bad(res, 400, "Invalid item quantity");
    if (typeof item.price !== "number" || item.price < 0 || item.price > 100000)
      return bad(res, 400, "Invalid item price");
  }

  let db: Firestore;
  try {
    db = getDb();
  } catch (e) {
    console.error("firebase-admin init failed:", e);
    const reason = e instanceof Error ? e.message.slice(0, 120) : "unknown";
    return bad(res, 500, `Order service is not configured (service account: ${reason})`);
  }

  // ── 1. Verify the payment with Paystack (server-to-server) ─────────────
  let paidPesewas: number;
  try {
    const psRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    const ps = (await psRes.json()) as {
      status: boolean;
      data?: { status: string; amount: number; currency: string };
    };
    if (!ps.status || ps.data?.status !== "success")
      return bad(res, 402, "Payment could not be verified with Paystack");
    if (ps.data.currency !== "GHS")
      return bad(res, 402, "Unexpected payment currency");
    paidPesewas = ps.data.amount;
  } catch (e) {
    console.error("Paystack verify failed:", e);
    return bad(res, 502, "Could not reach Paystack to verify the payment. Your money is safe — contact us with your reference.");
  }

  // ── 2. Recompute the total using server-side menu prices ────────────────
  // Client-sent prices are only trusted if the menu collection is empty
  // (pre-seed fallback); once the menu is in Firestore its prices win.
  const menuSnap = await db.collection("menuItems").get();
  const menuPrices = new Map<string, number>(
    menuSnap.docs.map((d) => [d.id, (d.data().price as number) ?? 0])
  );

  let subtotal = 0;
  const cleanItems: IncomingItem[] = [];
  for (const item of items) {
    const serverPrice = menuPrices.get(item.id);
    if (menuSnap.size > 0 && serverPrice === undefined && !item.id.startsWith("static-"))
      return bad(res, 400, `Unknown menu item: ${item.id}`);
    const price = serverPrice ?? item.price;
    subtotal += price * item.quantity;
    cleanItems.push({ id: item.id, name: item.name.slice(0, 200), price, quantity: item.quantity });
  }

  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const total = Math.round((subtotal + deliveryFee) * 100) / 100;

  // ── 3. The amount actually paid must match the order total ─────────────
  if (Math.round(total * 100) !== paidPesewas)
    return bad(res, 402, "Paid amount does not match the order total");

  // ── 4. Idempotency: one order per payment reference ────────────────────
  const existing = await db.collection("orders").where("paystackRef", "==", reference).limit(1).get();
  if (!existing.empty)
    return res.status(200).json({ orderId: existing.docs[0].id, duplicate: true });

  // ── 5. Save the verified order ──────────────────────────────────────────
  const docRef = await db.collection("orders").add({
    customerEmail: customerEmail.slice(0, 255),
    customerPhone: customerPhone.slice(0, 30),
    items: cleanItems,
    subtotal: Math.round(subtotal * 100) / 100,
    deliveryFee,
    total,
    orderType,
    deliveryAddress: orderType === "delivery" ? String(deliveryAddress).slice(0, 300) : "",
    notes: typeof notes === "string" ? notes.slice(0, 300) : "",
    paystackRef: reference,
    status: "Pending",
    timestamp: new Date().toISOString(),
  });

  return res.status(201).json({ orderId: docRef.id });
}
