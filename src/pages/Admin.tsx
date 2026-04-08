import { useState, useEffect } from "react";
import { db, firestoreDb, Order, Reservation } from "@/lib/db";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, ShoppingBag, Calendar, CheckCircle, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "reservations">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    // Live WebSocket connection to Firebase Firestore Collections
    const ordersQuery = query(collection(firestoreDb, "orders"), orderBy("timestamp", "desc"));
    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const liveOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(liveOrders);
    });

    const reservationsQuery = query(collection(firestoreDb, "reservations"), orderBy("timestamp", "desc"));
    const unsubRes = onSnapshot(reservationsQuery, (snapshot) => {
      const liveReservations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      setReservations(liveReservations);
    });

    return () => {
      unsubOrders();
      unsubRes();
    };
  }, []);

  const completeOrder = async (id: string) => {
    await db.updateOrderStatus(id, "Completed");
    toast.success("Order marked as completed!");
  };

  const seatReservation = async (id: string) => {
    await db.updateReservationStatus(id, "Seated");
    toast.success("Guests have been seated!");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "kisseladmin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      toast.success("Authentication successful!");
    } else {
      toast.error("Incorrect master passcode!");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-golden/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        
        <Card className="w-full max-w-md relative z-10 border-golden/20 shadow-2xl backdrop-blur-sm bg-card/90">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-2">
              <LockKeyhole className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight text-foreground">Admin Portal</CardTitle>
            <p className="text-sm text-muted-foreground">Authorized personnel only.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Enter Master Passcode" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 text-center text-lg tracking-widest bg-background/50"
                  autoFocus
                />
              </div>
              <Button type="submit" variant="hero" className="w-full h-14 text-lg">
                Unlock Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-background border-b border-border py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
             <LayoutDashboard className="w-6 h-6 text-primary" />
             <h1 className="text-xl font-bold tracking-tight">Kissel Kitchen Admin</h1>
          </div>
          <Link to="/" onClick={handleLogout}>
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" /> Secure Exit
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <Button 
            onClick={() => setActiveTab("orders")} 
            variant={activeTab === "orders" ? "default" : "outline"}
            className="gap-2 h-12 px-6"
          >
            <ShoppingBag className="w-4 h-4" /> Cloud Orders
            <Badge variant="secondary" className="ml-2 bg-black/10 text-current">{orders.filter(o => o.status === "Pending").length}</Badge>
          </Button>
          <Button 
            onClick={() => setActiveTab("reservations")} 
            variant={activeTab === "reservations" ? "default" : "outline"}
            className="gap-2 h-12 px-6"
          >
            <Calendar className="w-4 h-4" /> Cloud Reservations
            <Badge variant="secondary" className="ml-2 bg-black/10 text-current">{reservations.filter(r => r.status === "Confirmed").length}</Badge>
          </Button>
        </div>

        {/* Orders View */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.length === 0 ? (
               <p className="text-muted-foreground col-span-full py-20 text-center">No orders have been placed on the Cloud yet.</p>
            ) : (
               orders.map(order => (
                 <Card key={order.id} className={`overflow-hidden transition-all ${order.status === 'Completed' ? 'opacity-60 grayscale' : 'border-primary/20 shadow-md'}`}>
                   <CardHeader className="bg-muted/30 pb-4 border-b">
                     <div className="flex justify-between items-start">
                        <div>
                         <CardTitle className="text-sm font-mono text-muted-foreground">ID: {order.id.slice(0,6)}</CardTitle>
                         <p className="text-xs text-muted-foreground mt-1">{format(new Date(order.timestamp), "PPp")}</p>
                        </div>
                        <Badge variant={order.status === "Pending" ? "destructive" : "secondary"}>
                          {order.status}
                        </Badge>
                     </div>
                   </CardHeader>
                   <CardContent className="pt-6">
                     <div className="space-y-4">
                       <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                          <p className="text-sm font-medium">Customer Details:</p>
                          <p className="text-xs text-muted-foreground">{order.customerEmail} • {order.customerPhone}</p>
                          <p className="text-xs font-semibold text-green-600 flex items-center gap-1 mt-2">
                            <CheckCircle className="w-3 h-3" /> Paystack Paid (Ref: {order.paystackRef})
                          </p>
                       </div>
                       <div>
                         <ul className="space-y-2">
                           {order.items.map((item, idx) => (
                             <li key={idx} className="flex justify-between text-sm">
                               <span><span className="font-bold text-foreground">{item.quantity}x</span> {item.name}</span>
                               <span className="text-muted-foreground">GH₵{(item.price * item.quantity).toFixed(2)}</span>
                             </li>
                           ))}
                         </ul>
                         <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">GH₵{order.total.toFixed(2)}</span>
                         </div>
                       </div>
                       
                       {order.status === "Pending" && (
                         <Button onClick={() => completeOrder(order.id)} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                           Mark as Completed
                         </Button>
                       )}
                     </div>
                   </CardContent>
                 </Card>
               ))
            )}
          </div>
        )}

        {/* Reservations View */}
        {activeTab === "reservations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.length === 0 ? (
               <p className="text-muted-foreground col-span-full py-20 text-center">No tables booked on the Cloud yet.</p>
            ) : (
               reservations.map(res => (
                 <Card key={res.id} className={`overflow-hidden transition-all ${res.status === 'Seated' ? 'opacity-60 grayscale' : 'border-golden/30 shadow-md'}`}>
                   <CardHeader className="bg-golden/5 pb-4 border-b border-golden/10">
                     <div className="flex justify-between items-start">
                        <div>
                         <CardTitle className="text-lg">{res.name}</CardTitle>
                         <p className="text-xs text-muted-foreground mt-1">Booked: {format(new Date(res.timestamp), "PPp")}</p>
                        </div>
                        <Badge variant={res.status === "Confirmed" ? "default" : "secondary"}>
                          {res.status}
                        </Badge>
                     </div>
                   </CardHeader>
                   <CardContent className="pt-6">
                     <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                         <div className="bg-muted/30 p-3 rounded-lg text-center">
                           <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Date</p>
                           <p className="font-medium">{res.date}</p>
                         </div>
                         <div className="bg-muted/30 p-3 rounded-lg text-center">
                           <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Time</p>
                           <p className="font-medium text-primary">{res.time}</p>
                         </div>
                       </div>
                       
                       <div className="flex items-center justify-between border-b pb-4">
                          <span className="text-sm font-medium">Party Size:</span>
                          <span className="font-bold">{res.guests} Guests</span>
                       </div>

                                               <div className="flex items-center justify-between border-b pb-4">
                           <span className="text-sm font-medium">Phone:</span>
                           <a href={`tel:${(res as any).phone}`} className="font-bold text-primary hover:underline">{(res as any).phone || "N/A"}</a>
                        </div>
{(res.occasion || res.specialRequests) && (
                         <div className="bg-accent/5 p-4 rounded-xl border border-accent/20">
                            {res.occasion && (
                              <p className="text-sm mb-2"><span className="font-bold text-accent">Occasion:</span> {res.occasion}</p>
                            )}
                            {res.specialRequests && (
                              <p className="text-sm italic text-muted-foreground">"{res.specialRequests}"</p>
                            )}
                         </div>
                       )}
                       
                       {res.status === "Confirmed" && (
                         <Button onClick={() => seatReservation(res.id)} className="w-full mt-4" variant="outline">
                           Mark as Seated
                         </Button>
                       )}
                     </div>
                   </CardContent>
                 </Card>
               ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
