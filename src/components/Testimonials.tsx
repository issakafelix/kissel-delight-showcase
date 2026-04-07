import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Samuel Osei",
    role: "Food Critic",
    content: "The Jollof Rice here is an absolute masterclass. The perfect balance of spices, incredible aroma, and a premium atmosphere."
  },
  {
    name: "Ama Mensah",
    role: "Local Guide",
    content: "I've brought my family here several times. Every single time, the service has been immaculate and the pizza is arguably the best in town!"
  },
  {
    name: "David Tetteh",
    role: "Food Enthusiast",
    content: "A beautiful fusion of traditional Ghanaian tastes and international presentations. Kissel Food is my top recommendation to visitors."
  },
  {
    name: "Grace Addo",
    role: "Regular Customer",
    content: "From the moment you walk in to the final dessert bite, it's a 5-star experience. Their signature fried rice is simply spectacular."
  }
];

const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  useEffect(() => {
    if (!emblaApi) return;
    
    // Auto-play interval
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 -z-10" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-golden/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Reviews</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">What Our Guests Say</h2>
        </div>

        <div className="max-w-4xl mx-auto overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y pt-4 pb-12">
            {testimonials.map((t, index) => (
              <div 
                key={index} 
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_60%] pl-4 pr-4 transition-opacity group"
              >
                <Card className="h-full bg-card/80 backdrop-blur border-border/50 shadow-elegant group-hover:scale-105 transition-transform duration-500">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <Quote className="w-12 h-12 text-primary/40 mb-6" />
                    <p className="text-lg md:text-xl text-foreground font-medium italic mb-8 leading-relaxed">
                      "{t.content}"
                    </p>
                    <div className="mt-auto">
                      <h4 className="font-bold text-foreground">{t.name}</h4>
                      <p className="text-sm text-primary">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
