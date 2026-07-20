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
                Kissel Food is a Ghanaian kitchen based in Kasoa–Fetteh Kakraba, cooking the food we grew up on —
                smoky jollof, grilled and fried chicken, fresh fried rice — alongside pizza for when you want
                something different. We believe good food brings people together.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Everything is prepared fresh after you order, never sitting around waiting. We built this site so
                you can order online with Mobile Money or card, track your food from the kitchen to your door,
                and book a table when you'd rather eat in.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From our signature Jollof rice that captures the essence of Ghanaian cuisine to our stone-baked
                pizzas loaded with real toppings, every dish is made with care and honest ingredients.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-gradient-card shadow-elegant">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-muted-foreground">Cooked Fresh to Order</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-elegant">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">4</div>
                  <div className="text-muted-foreground">Menu Categories</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-elegant">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">MoMo</div>
                  <div className="text-muted-foreground">&amp; Card Payments</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-elegant">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Live</div>
                  <div className="text-muted-foreground">Order Tracking</div>
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