# Kissel Kitchen — Restaurant Ordering & Management Platform

A production-ready restaurant website with online ordering, live order tracking, table
reservations, and a real-time admin dashboard.

**Stack**: Vite · React 18 · TypeScript · Tailwind CSS · shadcn/ui · Firebase (Firestore +
Auth) · Paystack (GHS) · Vercel serverless functions.

## Features

**Customer**
- Menu with live search, category filters, and sold-out states (served from Firestore, edits go live instantly)
- Cart with pickup/delivery, delivery fee, order notes; persists across reloads
- Paystack checkout (card + mobile money) — payments are **verified server-side** before an order is accepted
- Printable receipt with WhatsApp share and a live order-tracking page (`/track`)
- Table reservations with occasion + special requests
- Light/dark theme, responsive, SPA

**Staff (`/admin`, Firebase Auth login)**
- Live orders board with lifecycle: Pending → Preparing → Ready → Completed (+ Cancel)
- New-order sound + toast alerts, search, and status filters
- Reservations board (Confirmed → Seated)
- Analytics: today's/all-time revenue, active orders, average order value, 7-day revenue chart, top sellers
- Menu manager: add/edit/delete dishes, prices, images, availability toggle, one-click seeding

## Architecture

```
Browser ── Paystack inline JS ──► Paystack (payment)
   │                                   ▲
   │ POST /api/orders (reference+cart) │ verify (secret key)
   ▼                                   │
Vercel serverless fn ──────────────────┘
   │  recompute totals from menu prices, reject mismatches,
   │  idempotent per payment reference
   ▼
Firestore ◄── security rules: clients can't create/edit orders;
              staff (Firebase Auth) manage everything; menu is public-read
```

## Local development

```sh
npm install
npm run dev          # UI only — checkout API is not served by Vite
npx vercel dev       # full stack (UI + /api/orders) — needs .env, see below
```

## Production setup (one-time)

### 1. Firebase
1. Create/open your Firebase project → **Firestore Database → Create database** (Standard edition, ID `(default)`).
2. **Rules tab** → paste the contents of [`firestore.rules`](firestore.rules) → Publish.
3. **Authentication → Sign-in method** → enable **Email/Password**.
4. **Authentication → Users → Add user** → create the staff login (e.g. `admin@yourrestaurant.com` + strong password).
5. **Authentication → Settings → User actions** → **disable "Enable create (sign-up)"** so nobody can self-register.
6. **Project settings → Service accounts → Generate new private key** — you'll paste this JSON into Vercel as `FIREBASE_SERVICE_ACCOUNT`.

### 2. Paystack
1. Complete Paystack business verification to get **live** keys.
2. Copy the **public** (`pk_live_…`) and **secret** (`sk_live_…`) keys from Settings → API Keys.

### 3. Vercel environment variables
Project → Settings → Environment Variables (see [`.env.example`](.env.example)):

| Variable | Value |
|---|---|
| `PAYSTACK_SECRET_KEY` | `sk_live_…` (server-only, never expose) |
| `FIREBASE_SERVICE_ACCOUNT` | the service-account JSON, on one line |
| `VITE_PAYSTACK_PUBLIC_KEY` | `pk_live_…` |
| `VITE_FIREBASE_*` | your Firebase web config (optional — defaults are compiled in) |

Redeploy after setting them.

### 4. Seed the menu
Open `https://your-domain/admin` → sign in → **Menu** tab → **Seed Default Menu**, then edit
dishes/prices/photos to taste.

## Security model

- **Payments**: the client never decides what was paid. `/api/orders` verifies the Paystack
  reference with the secret key, recomputes the total from Firestore menu prices, rejects
  amount mismatches, and is idempotent per reference.
- **Database**: Firestore rules block clients from creating/editing orders; staff actions
  require a Firebase Auth session; the menu is read-only to the public.
- **Admin**: real Firebase Auth (email/password), self-signup disabled.
- Order tracking uses unguessable Firestore document IDs as capability URLs.

## Customizing for a new restaurant

1. Search & replace branding (name, phone `+233549910292`, address) in `src/components/` and `src/lib/menu-data.ts`.
2. Swap images in `public/menu/` and `src/assets/`.
3. Point env vars at the new Firebase project + Paystack account.
4. Adjust `DELIVERY_FEE` in `api/orders.ts` **and** `src/components/Cart.tsx` (must match).
