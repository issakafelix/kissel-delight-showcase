import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const Reservation = () => {
  const [date, setDate] = useState<Date>();
  const [guests, setGuests] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !guests || !time || !name) {
      toast.error("Please explicitly fill in all reservation details.");
      return;
    }

    const formattedDate = format(date, "PPP");
    const msg = `Hi, I'd like to reserve a table for ${guests} guests on ${formattedDate} at ${time}. Name: ${name}.`;
    const waLink = `https://wa.me/233537947455?text=${encodeURIComponent(msg)}`;
    
    toast.success("Redirecting to WhatsApp to confirm your reservation...");
    
    setTimeout(() => {
      window.open(waLink, "_blank");
    }, 1500);
  };

  return (
    <section id="reservation" className="py-24 bg-cream dark:bg-background/95 relative">
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-card/90 backdrop-blur-md shadow-2xl border-golden/20 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div 
                className="hidden md:block bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1000')" }}
              >
                <div className="w-full h-full bg-black/40 p-12 flex flex-col justify-end text-white">
                  <h3 className="text-3xl font-bold mb-4">Book a Table</h3>
                  <p className="text-white/90 leading-relaxed">
                    Reserve your spot and ensure a memorable dining experience. We look forward to serving you.
                  </p>
                </div>
              </div>
              
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleReservation} className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-earth-brown dark:text-foreground mb-6">Reservation Details</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Your Name</label>
                      <Input 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="bg-background/50"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background/50",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Time</label>
                        <Select onValueChange={setTime}>
                          <SelectTrigger className="bg-background/50">
                            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                            <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                            <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                            <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                            <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                            <SelectItem value="7:00 PM">7:00 PM</SelectItem>
                            <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                            <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Guests</label>
                        <Select onValueChange={setGuests}>
                          <SelectTrigger className="bg-background/50">
                            <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="No. of Guests" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Person</SelectItem>
                            <SelectItem value="2">2 People</SelectItem>
                            <SelectItem value="3">3 People</SelectItem>
                            <SelectItem value="4">4 People</SelectItem>
                            <SelectItem value="5">5 People</SelectItem>
                            <SelectItem value="6+">6+ People</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" variant="hero" className="w-full mt-8 py-6 text-lg">
                    Confirm Reservation
                  </Button>
                </form>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
