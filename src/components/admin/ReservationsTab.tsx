import { useMemo } from "react";
import { format, isSameDay, isValid, parse, startOfDay } from "date-fns";
import { toast } from "sonner";
import { db, Reservation, ReservationStatus } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// When the guests are actually coming. Newer bookings carry a sortable
// dateISO; older ones only have the display string ("July 17th, 2026").
const diningTime = (res: Reservation): Date | null => {
  let day: Date | null = null;
  if (res.dateISO) {
    const p = parse(res.dateISO, "yyyy-MM-dd", new Date());
    if (isValid(p)) day = p;
  }
  if (!day) {
    const p = parse(res.date, "PPP", new Date());
    if (isValid(p)) day = p;
  }
  if (!day) return null;
  const t = parse(res.time, "h:mm a", new Date());
  if (isValid(t)) day.setHours(t.getHours(), t.getMinutes(), 0, 0);
  return day;
};

const displayRef = (res: Reservation) =>
  res.refNumber ?? `RES-${res.id.slice(0, 6).toUpperCase()}`;

const STATUS_BADGE: Record<ReservationStatus, "default" | "secondary" | "destructive"> = {
  Confirmed: "default",
  Seated: "secondary",
  Cancelled: "destructive",
};

const ReservationCard = ({
  res,
  onStatus,
}: {
  res: Reservation;
  onStatus: (id: string, status: ReservationStatus) => void;
}) => (
  <Card
    className={`overflow-hidden transition-all ${
      res.status !== "Confirmed" ? "opacity-60 grayscale" : "border-golden/30 shadow-md"
    }`}
  >
    <CardHeader className="bg-golden/5 pb-4 border-b border-golden/10">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg">{res.name}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {displayRef(res)} · Booked {format(new Date(res.timestamp), "PPp")}
          </p>
        </div>
        <Badge variant={STATUS_BADGE[res.status] ?? "default"}>{res.status}</Badge>
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
          <a href={`tel:${res.phone}`} className="font-bold text-primary hover:underline">
            {res.phone || "N/A"}
          </a>
        </div>

        {(res.occasion || res.specialRequests) && (
          <div className="bg-accent/5 p-4 rounded-xl border border-accent/20">
            {res.occasion && (
              <p className="text-sm mb-2">
                <span className="font-bold text-accent">Occasion:</span> {res.occasion}
              </p>
            )}
            {res.specialRequests && (
              <p className="text-sm italic text-muted-foreground">"{res.specialRequests}"</p>
            )}
          </div>
        )}

        {res.status === "Confirmed" && (
          <div className="flex gap-2 mt-4">
            <Button onClick={() => onStatus(res.id, "Seated")} className="flex-1" variant="outline">
              Mark as Seated
            </Button>
            <Button
              onClick={() => {
                if (window.confirm(`Cancel ${res.name}'s booking for ${res.date} at ${res.time}?`))
                  onStatus(res.id, "Cancelled");
              }}
              variant="ghost"
              className="text-destructive hover:text-destructive"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const Section = ({
  title,
  items,
  onStatus,
}: {
  title: string;
  items: Reservation[];
  onStatus: (id: string, status: ReservationStatus) => void;
}) => {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <Badge variant="secondary">{items.length}</Badge>
        <div className="h-px bg-border flex-1" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((res) => (
          <ReservationCard key={res.id} res={res} onStatus={onStatus} />
        ))}
      </div>
    </div>
  );
};

const ReservationsTab = ({ reservations }: { reservations: Reservation[] }) => {
  const handleStatus = async (id: string, status: ReservationStatus) => {
    try {
      await db.updateReservationStatus(id, status);
      toast.success(status === "Seated" ? "Guests have been seated!" : "Reservation cancelled.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update reservation. Retry.");
    }
  };

  const groups = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const today: Reservation[] = [];
    const upcoming: Reservation[] = [];
    const past: Reservation[] = [];
    const at = new Map<string, number>();

    for (const res of reservations) {
      const d = diningTime(res);
      at.set(res.id, d ? d.getTime() : 0);
      if (!d) {
        upcoming.push(res); // undated legacy records stay visible
      } else if (isSameDay(d, now)) {
        today.push(res);
      } else if (d > todayStart) {
        upcoming.push(res);
      } else {
        past.push(res);
      }
    }

    const byTime = (a: Reservation, b: Reservation) => at.get(a.id)! - at.get(b.id)!;
    today.sort(byTime);
    upcoming.sort(byTime);
    past.sort((a, b) => byTime(b, a));
    return { today, upcoming, past };
  }, [reservations]);

  if (reservations.length === 0) {
    return <p className="text-muted-foreground py-20 text-center">No tables booked on the Cloud yet.</p>;
  }

  return (
    <div className="space-y-10">
      <Section title="Today" items={groups.today} onStatus={handleStatus} />
      <Section title="Upcoming" items={groups.upcoming} onStatus={handleStatus} />
      <Section title="Past" items={groups.past} onStatus={handleStatus} />
    </div>
  );
};

export default ReservationsTab;
