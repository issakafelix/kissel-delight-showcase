import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { db, Order, ORDER_FLOW, OrderStatus } from "@/lib/db";
import { formatPrice } from "@/lib/menu-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  ChefHat,
  ClipboardList,
  PackageCheck,
  Search,
  Store,
  XCircle,
} from "lucide-react";

const STATUS_STEPS: { status: OrderStatus; label: string; description: string; icon: typeof ClipboardList }[] = [
  { status: "Pending", label: "Order Received", description: "We've got your order and payment.", icon: ClipboardList },
  { status: "Preparing", label: "In the Kitchen", description: "Our chefs are preparing your meal.", icon: ChefHat },
  { status: "Ready", label: "Ready", description: "Your order is packed and ready.", icon: PackageCheck },
  { status: "Completed", label: "Completed", description: "Enjoy your meal! 🍽️", icon: CheckCircle2 },
];

const Track = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const trackingId = searchParams.get("id") ?? "";
  const [inputId, setInputId] = useState(trackingId);
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOrder(null);
    setNotFound(false);
    if (!trackingId) return;

    setLoading(true);
    const unsubscribe = db.subscribeOrder(
      trackingId,
      (liveOrder) => {
        setLoading(false);
        setOrder(liveOrder);
        setNotFound(liveOrder === null);
      },
      () => {
        setLoading(false);
        setNotFound(true);
      }
    );
    return unsubscribe;
  }, [trackingId]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const id = inputId.trim();
    if (id) setSearchParams({ id });
  };

  const currentStepIndex = order ? ORDER_FLOW.indexOf(order.status) : -1;
  const isCancelled = order?.status === "Cancelled";

  return (
    <div className="min-h-screen bg-muted/20 selection:bg-golden/30">
      <header className="bg-background border-b border-border py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Kissel Kitchen
          </Link>
          <h1 className="text-lg font-bold tracking-tight">Order Tracking</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Lookup form */}
        <Card className="border-golden/20 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Track your order</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter the Tracking ID from your receipt to follow your order live.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLookup} className="flex gap-2">
              <Input
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="e.g. aB3dE9xYz…"
                className="font-mono"
              />
              <Button type="submit" className="gap-2 shrink-0">
                <Search className="w-4 h-4" /> Track
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading && (
          <p className="text-center text-muted-foreground py-10">Looking up your order…</p>
        )}

        {notFound && !loading && (
          <Card className="border-destructive/30">
            <CardContent className="py-10 text-center space-y-2">
              <XCircle className="w-10 h-10 text-destructive mx-auto" />
              <p className="font-semibold text-lg">Order not found</p>
              <p className="text-sm text-muted-foreground">
                Double-check the Tracking ID on your receipt, or contact us at +233 54 991 0292.
              </p>
            </CardContent>
          </Card>
        )}

        {order && (
          <>
            {/* Status timeline */}
            <Card className={cn("shadow-md", isCancelled ? "border-destructive/40" : "border-primary/20")}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Order Status</CardTitle>
                  <Badge variant={isCancelled ? "destructive" : order.status === "Completed" ? "secondary" : "default"}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono">#{order.paystackRef} · {new Date(order.timestamp).toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" })}</p>
              </CardHeader>
              <CardContent className="pt-6">
                {isCancelled ? (
                  <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                    <XCircle className="w-8 h-8 text-destructive shrink-0" />
                    <div>
                      <p className="font-semibold">This order was cancelled.</p>
                      <p className="text-sm text-muted-foreground">If you were charged, please contact us for a refund: +233 54 991 0292.</p>
                    </div>
                  </div>
                ) : (
                  <ol className="relative space-y-8">
                    {STATUS_STEPS.map((step, i) => {
                      const reached = i <= currentStepIndex;
                      const isCurrent = i === currentStepIndex;
                      const Icon = step.icon;
                      return (
                        <li key={step.status} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors shrink-0",
                              reached
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-background border-border text-muted-foreground"
                            )}>
                              <Icon className="w-5 h-5" />
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={cn("w-0.5 flex-1 min-h-8 mt-1", i < currentStepIndex ? "bg-primary" : "bg-border")} />
                            )}
                          </div>
                          <div className={cn("pb-2", !reached && "opacity-50")}>
                            <p className={cn("font-bold", isCurrent && "text-primary")}>
                              {step.label}
                              {isCurrent && order.status !== "Completed" && (
                                <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </CardContent>
            </Card>

            {/* Order summary */}
            <Card className="border-golden/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    {order.orderType === "delivery" ? <Bike className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                    {order.orderType === "delivery" ? "Delivery" : "Pickup"}
                  </span>
                </div>
                {order.orderType === "delivery" && order.deliveryAddress && (
                  <p className="text-sm text-muted-foreground">Deliver to: {order.deliveryAddress}</p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>
                        <span className="font-bold">{item.quantity}x</span> {item.name}
                        {item.addons && item.addons.length > 0 && (
                          <span className="block text-xs text-muted-foreground">+ {item.addons.map((a) => a.name).join(", ")}</span>
                        )}
                      </span>
                      <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                {typeof order.deliveryFee === "number" && order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground border-t pt-3">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                )}
                <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
                  <span>Total Paid</span>
                  <span className="text-primary">{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Track;
