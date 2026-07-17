import { useMemo } from "react";
import { format, startOfDay, subDays } from "date-fns";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Order } from "@/lib/db";
import { formatPrice } from "@/lib/menu-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { Banknote, ClipboardList, ShoppingBag, TrendingUp } from "lucide-react";

// Single-series chart colors, validated with the dataviz palette checker:
// light #c2590d on #ffffff, dark #e06a1f on #251d18 — both pass the lightness
// band, chroma floor, and >=3:1 surface contrast.
const CHART_COLORS = {
  light: { bar: "#c2590d", grid: "#eee9e4", axis: "#898781", tooltipBg: "#ffffff", tooltipInk: "#0b0b0b", border: "#e1e0d9" },
  dark: { bar: "#e06a1f", grid: "#3a322c", axis: "#a39a90", tooltipBg: "#251d18", tooltipInk: "#f5f0eb", border: "#3a322c" },
};

const useChartColors = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  return CHART_COLORS[isDark ? "dark" : "light"];
};

// Cancelled orders never count toward revenue or item stats.
const countableOrders = (orders: Order[]) => orders.filter((o) => o.status !== "Cancelled");

const KpiTile = ({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: typeof Banknote }) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <p className="text-3xl font-black text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </CardContent>
  </Card>
);

const AnalyticsTab = ({ orders }: { orders: Order[] }) => {
  const colors = useChartColors();

  const stats = useMemo(() => {
    const valid = countableOrders(orders);
    const todayStart = startOfDay(new Date());
    const todaysOrders = valid.filter((o) => new Date(o.timestamp) >= todayStart);

    const totalRevenue = valid.reduce((sum, o) => sum + (o.total || 0), 0);
    const todayRevenue = todaysOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pending = orders.filter((o) => o.status === "Pending" || o.status === "Preparing" || o.status === "Ready").length;
    const avgOrder = valid.length > 0 ? totalRevenue / valid.length : 0;

    // Revenue per day, last 7 days including today
    const revenueByDay = Array.from({ length: 7 }, (_, i) => {
      const day = startOfDay(subDays(new Date(), 6 - i));
      const next = startOfDay(subDays(new Date(), 5 - i));
      const revenue = valid
        .filter((o) => {
          const t = new Date(o.timestamp);
          return t >= day && (i === 6 ? true : t < next);
        })
        .reduce((sum, o) => sum + (o.total || 0), 0);
      return { day: format(day, "EEE d"), revenue: Math.round(revenue * 100) / 100 };
    });

    // Top-selling items by quantity
    const itemTotals = new Map<string, { name: string; quantity: number; revenue: number }>();
    valid.forEach((o) =>
      o.items?.forEach((item) => {
        const entry = itemTotals.get(item.name) ?? { name: item.name, quantity: 0, revenue: 0 };
        entry.quantity += item.quantity;
        entry.revenue += item.price * item.quantity;
        itemTotals.set(item.name, entry);
      })
    );
    const topItems = [...itemTotals.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    return { totalRevenue, todayRevenue, todaysCount: todaysOrders.length, pending, avgOrder, revenueByDay, topItems, totalCount: valid.length };
  }, [orders]);

  const tooltipStyle = {
    backgroundColor: colors.tooltipBg,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    color: colors.tooltipInk,
    fontSize: 13,
  };

  return (
    <div className="space-y-6">
      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile label="Today's Revenue" value={formatPrice(stats.todayRevenue)} sub={`${stats.todaysCount} order${stats.todaysCount === 1 ? "" : "s"} today`} icon={Banknote} />
        <KpiTile label="Active Orders" value={String(stats.pending)} sub="Pending · Preparing · Ready" icon={ClipboardList} />
        <KpiTile label="All-Time Revenue" value={formatPrice(stats.totalRevenue)} sub={`${stats.totalCount} paid orders`} icon={TrendingUp} />
        <KpiTile label="Avg Order Value" value={formatPrice(stats.avgOrder)} icon={ShoppingBag} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-day revenue */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue — Last 7 Days (₵)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.revenueByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="35%">
                <CartesianGrid vertical={false} stroke={colors.grid} strokeWidth={1} />
                <XAxis dataKey="day" tickLine={false} axisLine={{ stroke: colors.grid }} tick={{ fill: colors.axis, fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: colors.axis, fontSize: 12 }} width={52} tickFormatter={(v: number) => `₵${Math.round(v / 100)}`} />
                <Tooltip
                  cursor={{ fill: colors.grid, opacity: 0.4 }}
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [formatPrice(value), "Revenue"]}
                />
                <Bar dataKey="revenue" fill={colors.bar} radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top-selling items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top-Selling Items (portions)</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topItems.length === 0 ? (
              <p className="text-sm text-muted-foreground py-16 text-center">No item data yet — stats appear after the first order.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.topItems} layout="vertical" margin={{ top: 8, right: 40, left: 8, bottom: 0 }} barCategoryGap="30%">
                  <CartesianGrid horizontal={false} stroke={colors.grid} strokeWidth={1} />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: colors.axis, fontSize: 12 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={{ stroke: colors.grid }} tick={{ fill: colors.axis, fontSize: 12 }} width={130} />
                  <Tooltip
                    cursor={{ fill: colors.grid, opacity: 0.4 }}
                    contentStyle={tooltipStyle}
                    formatter={(value: number, _name, entry) => [
                      `${value} sold · ${formatPrice((entry?.payload as { revenue?: number })?.revenue ?? 0)}`,
                      "Portions",
                    ]}
                  />
                  <Bar dataKey="quantity" fill={colors.bar} radius={[0, 4, 4, 0]} maxBarSize={24}>
                    <LabelList dataKey="quantity" position="right" style={{ fill: colors.axis, fontSize: 12, fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;
