import { useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { db, Order, OrderStatus } from "@/lib/db";
import { formatPrice } from "@/lib/menu-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bike, CheckCircle, ChefHat, PackageCheck, Search, Store, XCircle } from "lucide-react";

const STATUS_FILTERS: (OrderStatus | "All")[] = ["All", "Pending", "Preparing", "Ready", "Completed", "Cancelled"];

const NEXT_ACTION: Partial<Record<OrderStatus, { next: OrderStatus; label: string; icon: typeof ChefHat; className: string }>> = {
  Pending: { next: "Preparing", label: "Start Preparing", icon: ChefHat, className: "bg-amber-600 hover:bg-amber-700 text-white" },
  Preparing: { next: "Ready", label: "Mark as Ready", icon: PackageCheck, className: "bg-blue-600 hover:bg-blue-700 text-white" },
  Ready: { next: "Completed", label: "Complete Order", icon: CheckCircle, className: "bg-green-600 hover:bg-green-700 text-white" },
};

const statusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case "Pending": return "destructive" as const;
    case "Completed": return "secondary" as const;
    case "Cancelled": return "outline" as const;
    default: return "default" as const;
  }
};

const OrdersTab = ({ orders }: { orders: Order[] }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== "All" && order.status !== statusFilter) return false;
      if (!term) return true;
      return (
        order.customerEmail?.toLowerCase().includes(term) ||
        order.customerPhone?.toLowerCase().includes(term) ||
        order.paystackRef?.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term) ||
        order.items?.some((i) => i.name.toLowerCase().includes(term))
      );
    });
  }, [orders, search, statusFilter]);

  const setStatus = async (id: string, status: OrderStatus, message: string) => {
    try {
      await db.updateOrderStatus(id, status);
      toast.success(message);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update order status. Retry.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search phone, email, ref, item…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                statusFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              {s}
              {s !== "All" && (
                <span className="ml-1 opacity-70">({orders.filter((o) => o.status === s).length})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground col-span-full py-20 text-center">
            {orders.length === 0 ? "No orders have been placed on the Cloud yet." : "No orders match your filters."}
          </p>
        ) : (
          filtered.map((order) => {
            const action = NEXT_ACTION[order.status];
            const done = order.status === "Completed" || order.status === "Cancelled";
            return (
              <Card key={order.id} className={cn("overflow-hidden transition-all", done ? "opacity-60 grayscale" : "border-primary/20 shadow-md")}>
                <CardHeader className="bg-muted/30 pb-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm font-mono text-muted-foreground">ID: {order.id.slice(0, 6)}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{format(new Date(order.timestamp), "PPp")}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant={statusBadgeVariant(order.status)}>{order.status}</Badge>
                      <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        {order.orderType === "delivery" ? <Bike className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                        {order.orderType === "delivery" ? "Delivery" : "Pickup"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                      <p className="text-sm font-medium">Customer Details:</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail} • {order.customerPhone}</p>
                      {order.orderType === "delivery" && order.deliveryAddress && (
                        <p className="text-xs text-muted-foreground mt-1">📍 {order.deliveryAddress}</p>
                      )}
                      <p className="text-xs font-semibold text-green-600 flex items-center gap-1 mt-2">
                        <CheckCircle className="w-3 h-3" /> Paystack Paid (Ref: {order.paystackRef})
                      </p>
                    </div>

                    {order.notes && (
                      <p className="text-xs italic text-muted-foreground bg-muted/40 rounded-lg p-2 border border-border">
                        "{order.notes}"
                      </p>
                    )}

                    <div>
                      <ul className="space-y-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <span>
                              <span className="font-bold text-foreground">{item.quantity}x</span> {item.name}
                              {item.addons && item.addons.length > 0 && (
                                <span className="block text-xs text-muted-foreground">+ {item.addons.map((a) => a.name).join(", ")}</span>
                              )}
                            </span>
                            <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                      {typeof order.deliveryFee === "number" && order.deliveryFee > 0 && (
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                          <span>Delivery Fee</span>
                          <span>{formatPrice(order.deliveryFee)}</span>
                        </div>
                      )}
                      <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {action && (
                      <div className="space-y-2 pt-1">
                        <Button
                          onClick={() => setStatus(order.id, action.next, `Order moved to ${action.next}.`)}
                          className={cn("w-full", action.className)}
                        >
                          <action.icon className="w-4 h-4 mr-2" /> {action.label}
                        </Button>
                        {(order.status === "Pending" || order.status === "Preparing") && (
                          <Button
                            variant="outline"
                            onClick={() => setStatus(order.id, "Cancelled", "Order cancelled.")}
                            className="w-full text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <XCircle className="w-4 h-4 mr-2" /> Cancel Order
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
