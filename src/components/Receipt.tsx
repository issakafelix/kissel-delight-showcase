import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, Printer, X, UtensilsCrossed, CalendarCheck, MapPin, MessageCircle, Bike, Store } from "lucide-react";
import { formatPrice } from "@/lib/menu-data";
import type { OrderType } from "@/lib/db";

const RESTAURANT_WHATSAPP = "233549910292";

export interface ReceiptItemAddon {
  name: string;
  price: number;
}

// ─── Order Receipt ────────────────────────────────────────────────────────────
export interface OrderReceiptData {
  type: "order";
  refNumber: string;
  trackingId?: string;
  customerEmail: string;
  customerPhone: string;
  items: { name: string; price: number; quantity: number; variantName?: string; addons?: ReceiptItemAddon[] }[];
  subtotal?: number;
  deliveryFee?: number;
  total: number;
  orderType?: OrderType;
  deliveryAddress?: string;
  notes?: string;
  timestamp: string;
}

// ─── Reservation Receipt ──────────────────────────────────────────────────────
export interface ReservationReceiptData {
  type: "reservation";
  refNumber: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  occasion?: string;
  specialRequests?: string;
  timestamp: string;
}

export type ReceiptData = OrderReceiptData | ReservationReceiptData;

interface ReceiptProps {
  data: ReceiptData | null;
  onClose: () => void;
}

const buildWhatsAppLink = (data: ReceiptData) => {
  let text: string;
  if (data.type === "order") {
    const lines = data.items.map((i) => `• ${i.quantity}x ${i.name} — ${formatPrice(i.price * i.quantity)}`);
    text = [
      `Hello Kissel Kitchen! 🍽️`,
      `I just placed an order (Ref: ${data.refNumber}).`,
      ...(data.trackingId ? [`Tracking ID: ${data.trackingId}`] : []),
      ``,
      ...lines,
      ``,
      `Total: ${formatPrice(data.total)}`,
      data.orderType === "delivery"
        ? `Type: Delivery — ${data.deliveryAddress || ""}`
        : `Type: Pickup`,
      `Phone: ${data.customerPhone}`,
    ].join("\n");
  } else {
    text = [
      `Hello Kissel Kitchen! 🍽️`,
      `I just reserved a table (Ref: ${data.refNumber}).`,
      `Name: ${data.name}`,
      `Date: ${data.date} at ${data.time}`,
      `Guests: ${data.guests}`,
    ].join("\n");
  }
  return `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(text)}`;
};

const Receipt = ({ data, onClose }: ReceiptProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank", "width=600,height=800");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Kissel Kitchen Receipt</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 32px; color: #1a1a1a; background: #fff; }
            .header { text-align: center; margin-bottom: 28px; border-bottom: 2px solid #c9a84c; padding-bottom: 20px; }
            .logo { font-size: 28px; font-weight: 900; color: #c9a84c; letter-spacing: -0.5px; }
            .sub { font-size: 13px; color: #666; margin-top: 4px; }
            .badge { display: inline-block; background: #dcfce7; color: #16a34a; border: 1px solid #86efac; border-radius: 20px; padding: 4px 14px; font-size: 13px; font-weight: 600; margin-top: 10px; }
            .section { margin: 20px 0; }
            .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; font-weight: 600; }
            .value { font-size: 15px; font-weight: 600; color: #1a1a1a; margin-top: 2px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            .items-table th { text-align: left; font-size: 11px; text-transform: uppercase; color: #999; border-bottom: 1px solid #eee; padding: 8px 0; }
            .items-table td { padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-size: 14px; }
            .items-table td:last-child { text-align: right; font-weight: 600; }
            .total-row { font-size: 18px; font-weight: 800; color: #c9a84c; }
            .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px dashed #ddd; font-size: 13px; color: #888; }
            .ref { font-family: monospace; background: #f5f5f5; padding: 4px 10px; border-radius: 6px; font-size: 13px; }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  if (!data) return null;

  const isOrder = data.type === "order";
  const formattedTime = new Date(data.timestamp).toLocaleString("en-GH", {
    dateStyle: "medium", timeStyle: "short"
  });

  return (
    <Dialog open={!!data} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-golden/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Actions bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handlePrint} className="gap-2 text-xs h-8">
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </Button>
            <a href={buildWhatsAppLink(data)} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="gap-2 text-xs h-8 text-green-600 border-green-600/40 hover:bg-green-600/10 hover:text-green-700">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </Button>
            </a>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable receipt body */}
        <div ref={printRef} className="p-6 space-y-5">
          {/* Header */}
          <div className="header text-center border-b border-golden/30 pb-5">
            <div className="logo text-3xl font-black text-primary tracking-tight flex items-center justify-center gap-2">
              <UtensilsCrossed className="w-7 h-7" />
              Kissel Kitchen
            </div>
            <p className="sub text-muted-foreground text-sm mt-1">
              Kasoa-Fetteh Kakraba, Adjacent KAAF University, Kasoa
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-green-600 font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              {isOrder ? "Order Confirmed 🎉" : "Table Reserved ✅"}
            </div>
          </div>

          {/* Ref + time */}
          <div className="flex items-center justify-between text-xs">
            <span className="ref font-mono bg-muted px-3 py-1 rounded-lg text-muted-foreground">
              #{data.refNumber}
            </span>
            <span className="text-muted-foreground">{formattedTime}</span>
          </div>

          {/* Content */}
          {isOrder ? (
            <OrderBody data={data as OrderReceiptData} />
          ) : (
            <ReservationBody data={data as ReservationReceiptData} />
          )}

          {/* Footer */}
          <div className="footer text-center border-t border-border pt-4 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Thank you for choosing Kissel Kitchen! 🍽️</p>
            <p>+233 54 991 0292 • Kasoa, Central Region, Ghana</p>
            <p className="italic">Please keep this receipt for your records.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Order Body ────────────────────────────────────────────────────────────────
const OrderBody = ({ data }: { data: OrderReceiptData }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <div>
        <p className="label text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</p>
        <p className="value text-sm font-medium break-all">{data.customerEmail}</p>
      </div>
      <div>
        <p className="label text-xs uppercase tracking-wider text-muted-foreground font-semibold">Phone</p>
        <p className="value text-sm font-medium">{data.customerPhone}</p>
      </div>
      {data.orderType && (
        <div>
          <p className="label text-xs uppercase tracking-wider text-muted-foreground font-semibold">Order Type</p>
          <p className="value text-sm font-medium flex items-center gap-1.5">
            {data.orderType === "delivery" ? <Bike className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
            {data.orderType === "delivery" ? "Delivery" : "Pickup"}
          </p>
        </div>
      )}
      {data.orderType === "delivery" && data.deliveryAddress && (
        <div>
          <p className="label text-xs uppercase tracking-wider text-muted-foreground font-semibold">Deliver To</p>
          <p className="value text-sm font-medium flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {data.deliveryAddress}
          </p>
        </div>
      )}
    </div>

    {data.notes && (
      <div className="bg-muted/40 rounded-xl p-3 border border-border">
        <p className="label text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Order Notes</p>
        <p className="text-sm italic text-muted-foreground">"{data.notes}"</p>
      </div>
    )}

    <div className="border border-border rounded-xl overflow-hidden">
      <table className="items-table w-full text-sm">
        <thead>
          <tr className="bg-muted/40">
            <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Item</th>
            <th className="text-center p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Qty</th>
            <th className="text-right p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i} className="border-t border-border/50">
              <td className="p-3 font-medium">
                {item.name}
                {item.addons && item.addons.length > 0 && (
                  <span className="block text-xs font-normal text-muted-foreground">
                    + {item.addons.map((a) => a.name).join(", ")}
                  </span>
                )}
              </td>
              <td className="p-3 text-center text-muted-foreground">×{item.quantity}</td>
              <td className="p-3 text-right font-semibold">{formatPrice(item.price * item.quantity)}</td>
            </tr>
          ))}
          {typeof data.deliveryFee === "number" && data.deliveryFee > 0 && (
            <tr className="border-t border-border/50">
              <td colSpan={2} className="p-3 text-muted-foreground">Delivery Fee</td>
              <td className="p-3 text-right font-semibold">{formatPrice(data.deliveryFee)}</td>
            </tr>
          )}
          <tr className="border-t-2 border-golden/40 bg-primary/5">
            <td colSpan={2} className="p-3 font-bold text-base total-row text-primary">Total Paid</td>
            <td className="p-3 text-right font-black text-lg text-primary">{formatPrice(data.total)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p className="text-xs text-center text-muted-foreground bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-2">
      ✅ Payment verified via Paystack
    </p>

    {data.trackingId && (
      <Link
        to={`/track?id=${data.trackingId}`}
        className="block text-center text-sm font-semibold text-primary bg-primary/5 border border-primary/20 rounded-lg p-3 hover:bg-primary/10 transition-colors"
      >
        📍 Track your order live → Tracking ID: <span className="font-mono">{data.trackingId.slice(0, 8)}</span>
      </Link>
    )}
  </div>
);

// ─── Reservation Body ──────────────────────────────────────────────────────────
const ReservationBody = ({ data }: { data: ReservationReceiptData }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <InfoCell label="Guest Name" value={data.name} />
      <InfoCell label="Phone" value={data.phone} />
      <InfoCell label="Date" value={data.date} />
      <InfoCell label="Time" value={data.time} />
      <InfoCell label="Party Size" value={`${data.guests} Guest${data.guests === "1" ? "" : "s"}`} />
      {data.occasion && <InfoCell label="Occasion" value={data.occasion} />}
    </div>

    {data.specialRequests && (
      <div className="bg-muted/40 rounded-xl p-3 border border-border">
        <p className="label text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Special Requests</p>
        <p className="text-sm italic text-muted-foreground">"{data.specialRequests}"</p>
      </div>
    )}

    <div className="flex items-center gap-2 text-sm bg-golden/10 border border-golden/30 text-amber-700 dark:text-amber-400 rounded-lg p-3">
      <CalendarCheck className="w-4 h-4 shrink-0" />
      <span>Please arrive 5–10 minutes before your reserved time.</span>
    </div>
  </div>
);

const InfoCell = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
    <p className="text-sm font-semibold mt-0.5">{value}</p>
  </div>
);

export default Receipt;
