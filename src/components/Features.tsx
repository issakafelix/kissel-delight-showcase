import { CookingPot, Leaf, Bike, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <CookingPot className="w-10 h-10 text-golden mb-4" />,
    title: "Cooked Fresh to Order",
    description: "Nothing sits under a heat lamp — every plate is cooked after you order it, the way home food should be."
  },
  {
    icon: <Leaf className="w-10 h-10 text-golden mb-4" />,
    title: "Fresh Ingredients",
    description: "We source our ingredients locally to ensure every meal is fresh, vibrant, and incredibly tasty."
  },
  {
    icon: <Bike className="w-10 h-10 text-golden mb-4" />,
    title: "Pickup or Delivery",
    description: "Grab it yourself or have it delivered around Fetteh Kakraba and nearby Kasoa — your choice at checkout."
  },
  {
    icon: <Smartphone className="w-10 h-10 text-golden mb-4" />,
    title: "Pay with MoMo or Card",
    description: "Secure checkout with Mobile Money or bank card — no cash needed, and you can track your order live."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center mb-16 animate-slide-up">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">The Kissel Standard</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Authentic Ghanaian cooking, made simple to order online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-card/50 backdrop-blur-md border-border/50 hover:shadow-glow hover:-translate-y-2 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-8 text-center flex flex-col items-center">
                {feature.icon}
                <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
