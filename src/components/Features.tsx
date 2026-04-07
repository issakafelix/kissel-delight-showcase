import { ChefHat, Leaf, Clock, UtensilsCrossed } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <ChefHat className="w-10 h-10 text-golden mb-4" />,
    title: "Master Chefs",
    description: "Our dishes are crafted by experienced chefs passionate about authentic and modern gastronomy."
  },
  {
    icon: <Leaf className="w-10 h-10 text-golden mb-4" />,
    title: "Fresh Ingredients",
    description: "We source our ingredients locally to ensure every meal is fresh, vibrant, and incredibly tasty."
  },
  {
    icon: <Clock className="w-10 h-10 text-golden mb-4" />,
    title: "Fast Service",
    description: "Enjoy your meals without the long wait, perfectly timed so you can savor every moment."
  },
  {
    icon: <UtensilsCrossed className="w-10 h-10 text-golden mb-4" />,
    title: "Elegant Ambiance",
    description: "A meticulously designed dining environment to give you a premium eating experience."
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
            Experience culinary excellence where tradition meets modern innovation.
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
