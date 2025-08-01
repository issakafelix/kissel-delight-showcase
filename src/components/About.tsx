import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-earth-brown mb-4">About Kissel Food</h2>
            <p className="text-xl text-muted-foreground">
              Where tradition meets innovation in every dish we serve
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-6">Our Story</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Kissel Food was born from a passion for bringing authentic flavors and exceptional dining experiences to our community. We believe that great food brings people together, creating memorable moments that last a lifetime.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our kitchen combines traditional cooking methods with modern techniques to create dishes that honor their origins while satisfying contemporary tastes. Every meal is prepared with love, care, and the finest ingredients.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From our signature Jollof rice that captures the essence of Nigerian cuisine to our artisan pizzas that celebrate international flavors, we are committed to delivering excellence in every bite.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-gradient-card shadow-elegant">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">5+</div>
                  <div className="text-muted-foreground">Years of Excellence</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-elegant">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                  <div className="text-muted-foreground">Happy Customers</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-elegant">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15+</div>
                  <div className="text-muted-foreground">Signature Dishes</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-elegant">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-muted-foreground">Fresh Ingredients</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;