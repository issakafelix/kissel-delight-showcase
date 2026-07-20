import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Bike, Clock, Minus, Plus, ShoppingBag, Store, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { db, DEFAULT_STORE_SETTINGS, hourLabel, OrderType, StoreSettings } from "@/lib/db";
import { formatPrice } from "@/lib/menu-data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Receipt, { OrderReceiptData } from "@/components/Receipt";

// Pesewas. Must match DELIVERY_FEE in api/orders.ts — server value is authoritative.
export const DELIVERY_FEE = 1000;

// In production the key MUST come from the environment; silently falling back
// to a test key would let "payments" through that move no real money.
const PAYSTACK_PUBLIC_KEY: string =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ??
  (import.meta.env.DEV ? "pk_test_7912835ae75c1fccc7a9f6ccb7df343ead3daad7" : "");
const IS_TEST_MODE = PAYSTACK_PUBLIC_KEY.startsWith("pk_test_");

// Current hour in Ghana (Africa/Accra), regardless of the visitor's device TZ.
const accraHour = () =>
  parseInt(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Accra", hour: "2-digit", hour12: false }).format(new Date()),
    10
  ) % 24;

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<OrderReceiptData | null>(null);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  useEffect(() => db.subscribeStoreSettings(setSettings), []);

  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const grandTotal = cartTotal + deliveryFee;

  const hourNow = accraHour();
  const withinHours = hourNow >= settings.openHour && hourNow < settings.closeHour;
  const closedReason = settings.ordersPaused
    ? "Ordering is temporarily paused — please check back soon or WhatsApp us on +233 54 991 0292."
    : !withinHours
      ? `We're closed right now. Ordering is open ${hourLabel(settings.openHour)} – ${hourLabel(settings.closeHour)} (Ghana time).`
      : null;

  const onSuccess = async (reference: Record<string, unknown>) => {
    const ref = String(reference.reference || "");
    // The server resolves prices from the menu itself — it only needs ids +
    // chosen variant/add-ons + quantity to recompute the authoritative total.
    const payload = {
      reference: ref,
      customerEmail: email,
      customerPhone: phone,
      items: cartItems.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        variantId: item.variantId,
        addonIds: item.addons.map((a) => a.id),
        quantity: item.quantity,
      })),
      orderType,
      deliveryAddress: orderType === "delivery" ? deliveryAddress : "",
      notes,
    };

    // Snapshot for the receipt before we clear the cart.
    const receiptItems = cartItems.map((item) => ({
      name: item.name,
      price: item.unitPrice,
      quantity: item.quantity,
      variantName: item.variantName,
      addons: item.addons.map((a) => ({ name: a.name, price: a.price })),
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Order service responded with ${res.status}`);
      }

      setReceiptData({
        type: "order",
        refNumber: ref,
        trackingId: data.orderId,
        customerEmail: email,
        customerPhone: phone,
        items: receiptItems,
        subtotal: cartTotal,
        deliveryFee,
        total: grandTotal,
        orderType,
        deliveryAddress: payload.deliveryAddress,
        notes,
        timestamp: new Date().toISOString(),
      });

      clearCart();
      setNotes("");
      setIsCartOpen(false);
    } catch (e) {
      console.error("Error saving order:", e);
      toast.error(
        `Your payment went through, but we couldn't register the order automatically. Please WhatsApp us on +233 54 991 0292 with your payment reference: ${ref}`,
        { duration: 15000 }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const onClose = () => {
    setIsProcessing(false);
    toast.error("Payment dropped or cancelled.");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (closedReason) {
      toast.error(closedReason);
      return;
    }
    if (!PAYSTACK_PUBLIC_KEY) {
      toast.error("Online payment is not configured yet. Please WhatsApp us on +233 54 991 0292 to order.");
      return;
    }
    // Items from the static fallback menu (shown when the Firestore menu is
    // empty or unreachable) don't exist server-side, so /api/orders would
    // reject the order AFTER Paystack has taken the money. Block before paying.
    if (cartItems.some((i) => i.itemId.startsWith("static-"))) {
      toast.error(
        "Online ordering is temporarily unavailable. Please try again in a few minutes or WhatsApp us on +233 54 991 0292."
      );
      return;
    }
    if (!email.trim() || !phone.trim()) {
      toast.error("Contact details are required to process payments securely.");
      return;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) {
      toast.error("Please provide a delivery address or landmark.");
      return;
    }

    setIsProcessing(true);

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      const paystack = (window as unknown as {
        PaystackPop: { setup: (config: object) => { openIframe: () => void } };
      }).PaystackPop;
      const handler = paystack.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: grandTotal, // already in pesewas
        currency: "GHS",
        ref: "" + Math.floor(Math.random() * 1000000000 + 1),
        callback: function (response: Record<string, unknown>) {
          onSuccess(response);
        },
        onClose: function () {
          onClose();
        },
      });
      handler.openIframe();
    };
    script.onerror = () => {
      setIsProcessing(false);
      toast.error("Could not reach the payment provider. Check your connection and retry.");
    };
    document.body.appendChild(script);
  };

  return (
    <>
      <Receipt data={receiptData} onClose={() => setReceiptData(null)} />
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-background border-l-border flex flex-col p-0">
          <SheetHeader className="p-6 border-b border-border bg-muted/30">
            <SheetTitle className="flex items-center text-2xl font-bold text-foreground">
              <ShoppingBag className="mr-3 w-6 h-6 text-primary" />
              Your Order
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground opacity-70">
                <ShoppingBag className="w-16 h-16 mb-4" />
                <p className="text-xl font-medium">Your cart is empty.</p>
                <p className="text-sm mt-2">Add some delicious items from the menu!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.lineId} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground">{item.name}</h4>
                      {item.addons.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          + {item.addons.map((a) => a.name).join(", ")}
                        </p>
                      )}
                      <p className="text-primary font-bold mt-0.5">{formatPrice(item.unitPrice)}</p>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-border rounded-md bg-background">
                          <button
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                            className="p-1 hover:bg-muted text-foreground transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                            className="p-1 hover:bg-muted text-foreground transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.lineId)}
                          className="text-muted-foreground hover:text-destructive transition-colors ml-auto p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 border-t border-border bg-muted/10 space-y-4">
              {/* Pickup / Delivery selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType("pickup")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-colors",
                    orderType === "pickup"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <Store className="w-4 h-4" /> Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("delivery")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-colors",
                    orderType === "delivery"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <Bike className="w-4 h-4" /> Delivery (+{formatPrice(DELIVERY_FEE)})
                </button>
              </div>

              <div className="space-y-3 pb-4 border-b border-border/50">
                <div>
                  <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase">Email Receipt</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 shadow-none" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase">Mobile Money / Whatsapp No.</Label>
                  <Input id="phone" type="tel" placeholder="054 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 shadow-none" />
                </div>
                {orderType === "delivery" && (
                  <div>
                    <Label htmlFor="address" className="text-xs font-semibold text-muted-foreground uppercase">Delivery Address / Landmark</Label>
                    <Input id="address" placeholder="e.g. Fetteh Kakraba, near KAAF University gate" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="mt-1 shadow-none" />
                  </div>
                )}
                <div>
                  <Label htmlFor="notes" className="text-xs font-semibold text-muted-foreground uppercase">Order Notes (Optional)</Label>
                  <Textarea id="notes" placeholder="Extra spicy, no onions…" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 shadow-none resize-none" maxLength={300} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between font-medium text-muted-foreground mb-1">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex items-center justify-between font-medium text-muted-foreground mb-1">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between font-bold text-2xl text-foreground mb-4">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {closedReason && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{closedReason}</span>
                </div>
              )}

              <Button
                onClick={handleCheckout}
                disabled={isProcessing || !!closedReason}
                size="lg"
                className="w-full py-6 text-lg rounded-xl shadow-warm flex items-center justify-center"
              >
                {isProcessing ? "Processing..." : closedReason ? "Ordering Closed" : `Pay ${formatPrice(grandTotal)} Securely`}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                <span className="text-green-600">🔒</span> Secured by Paystack
              </p>
              {IS_TEST_MODE && import.meta.env.PROD && (
                <p className="text-center text-xs font-semibold text-amber-600">
                  ⚠ Test mode — payments are not real
                </p>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Cart;
