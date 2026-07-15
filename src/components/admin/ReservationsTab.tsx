import { format } from "date-fns";
import { toast } from "sonner";
import { db, Reservation } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ReservationsTab = ({ reservations }: { reservations: Reservation[] }) => {
  const seatReservation = async (id: string) => {
    try {
      await db.updateReservationStatus(id, "Seated");
      toast.success("Guests have been seated!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update reservation. Retry.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reservations.length === 0 ? (
        <p className="text-muted-foreground col-span-full py-20 text-center">No tables booked on the Cloud yet.</p>
      ) : (
        reservations.map((res) => (
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
                  <a href={`tel:${res.phone}`} className="font-bold text-primary hover:underline">{res.phone || "N/A"}</a>
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
  );
};

export default ReservationsTab;
