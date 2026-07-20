import { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { db, DEFAULT_STORE_SETTINGS, hourLabel, Order, Reservation, StoreSettings } from "@/lib/db";
import { formatPrice } from "@/lib/menu-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, LayoutDashboard, ShoppingBag, Calendar, LockKeyhole, BarChart3, UtensilsCrossed, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import OrdersTab from "@/components/admin/OrdersTab";
import ReservationsTab from "@/components/admin/ReservationsTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import MenuTab from "@/components/admin/MenuTab";

// Short two-tone chime via WebAudio — no asset file needed.
const playNewOrderChime = () => {
  try {
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    [880, 1174.66].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + i * 0.18 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.4);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    // audio blocked — the toast still notifies
  }
};

type TabKey = "orders" | "reservations" | "analytics" | "menu";

const TABS: { key: TabKey; label: string; icon: typeof ShoppingBag }[] = [
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "reservations", label: "Reservations", icon: Calendar },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "menu", label: "Menu", icon: UtensilsCrossed },
];

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const knownOrderIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  const isAuthenticated = user !== null;

  useEffect(() => {
    if (!isAuthenticated) return;

    // So the tab can alert even when it's in the background.
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const unsubOrders = db.subscribeOrders((liveOrders) => {
      // Alert on genuinely new orders (skip the initial snapshot)
      if (knownOrderIds.current !== null) {
        const fresh = liveOrders.filter((o) => !knownOrderIds.current!.has(o.id));
        if (fresh.length > 0) {
          playNewOrderChime();
          fresh.forEach((o) => {
            const summary = `New order from ${o.customerPhone || o.customerEmail} — ${formatPrice(o.total || 0)}`;
            toast.success(`🛎️ ${summary}`);
            if (document.hidden && "Notification" in window && Notification.permission === "granted") {
              try {
                new Notification("Kissel Kitchen", { body: summary });
              } catch {
                // some browsers restrict page-scope notifications — toast + chime still fired
              }
            }
          });
        }
      }
      knownOrderIds.current = new Set(liveOrders.map((o) => o.id));
      setOrders(liveOrders);
    });

    const unsubRes = db.subscribeReservations(setReservations);
    const unsubSettings = db.subscribeStoreSettings(setSettings);

    return () => {
      unsubOrders();
      unsubRes();
      unsubSettings();
      knownOrderIds.current = null;
    };
  }, [isAuthenticated]);

  const saveSettings = async (changes: Partial<StoreSettings>) => {
    try {
      await db.updateStoreSettings(changes);
      if (changes.ordersPaused !== undefined) {
        toast.success(changes.ordersPaused ? "Ordering paused — customers can't check out." : "Ordering resumed.");
      } else {
        toast.success("Opening hours updated.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to save settings.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Enter your admin email and password.");
      return;
    }
    setIsSigningIn(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      toast.success("Welcome back!");
      setPassword("");
    } catch {
      toast.error("Invalid email or password.");
      setPassword("");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = () => {
    signOut(firebaseAuth);
  };

  const activeOrderCount = orders.filter((o) => o.status === "Pending" || o.status === "Preparing" || o.status === "Ready").length;
  const confirmedResCount = reservations.filter((r) => r.status === "Confirmed").length;

  if (!authReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Checking session…
      </div>
    );
  }

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
            <p className="text-sm text-muted-foreground">Sign in with your staff account.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="admin@kisselfood.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-background/50"
                autoComplete="username"
                autoFocus
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-background/50"
                autoComplete="current-password"
              />
              <Button type="submit" variant="hero" className="w-full h-14 text-lg" disabled={isSigningIn}>
                {isSigningIn ? "Signing in…" : "Unlock Dashboard"}
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
        <div className="flex flex-wrap gap-3 mb-8">
          {TABS.map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              variant={activeTab === tab.key ? "default" : "outline"}
              className="gap-2 h-12 px-5"
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
              {tab.key === "orders" && activeOrderCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-black/10 text-current">{activeOrderCount}</Badge>
              )}
              {tab.key === "reservations" && confirmedResCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-black/10 text-current">{confirmedResCount}</Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Store status: pause ordering + opening hours (Ghana time) */}
        <Card className={`mb-8 ${settings.ordersPaused ? "border-destructive/50 bg-destructive/5" : "border-golden/20"}`}>
          <CardContent className="py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <Store className={`w-5 h-5 ${settings.ordersPaused ? "text-destructive" : "text-primary"}`} />
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <Switch
                  checked={!settings.ordersPaused}
                  onCheckedChange={(open) => saveSettings({ ordersPaused: !open })}
                />
                {settings.ordersPaused ? "Ordering PAUSED" : "Accepting orders"}
              </label>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-medium">Hours (Ghana time):</span>
              <Select value={String(settings.openHour)} onValueChange={(v) => saveSettings({ openHour: parseInt(v, 10) })}>
                <SelectTrigger className="h-8 w-[110px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, h) => (
                    <SelectItem key={h} value={String(h)}>{hourLabel(h)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">to</span>
              <Select value={String(settings.closeHour)} onValueChange={(v) => saveSettings({ closeHour: parseInt(v, 10) })}>
                <SelectTrigger className="h-8 w-[110px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
                    <SelectItem key={h} value={String(h)}>{hourLabel(h)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground basis-full sm:basis-auto sm:ml-auto">
              Customers can't check out while paused or outside these hours.
            </p>
          </CardContent>
        </Card>

        {activeTab === "orders" && <OrdersTab orders={orders} />}
        {activeTab === "reservations" && <ReservationsTab reservations={reservations} />}
        {activeTab === "analytics" && <AnalyticsTab orders={orders} />}
        {activeTab === "menu" && <MenuTab />}
      </main>
    </div>
  );
};

export default Admin;
