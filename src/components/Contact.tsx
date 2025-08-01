import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-earth-brown mb-4">Visit Us Today</h2>
          <p className="text-xl text-muted-foreground">
            We are ready to serve you the finest dining experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gradient-card shadow-elegant text-center">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                123 Flavor Street<br />
                Foodie District<br />
                Cuisine City, FC 12345
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-elegant text-center">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                <p className="mb-2"><strong>Monday - Thursday:</strong><br />11:00 AM - 10:00 PM</p>
                <p className="mb-2"><strong>Friday - Saturday:</strong><br />11:00 AM - 11:00 PM</p>
                <p><strong>Sunday:</strong><br />12:00 PM - 9:00 PM</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-elegant text-center">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground space-y-2">
                <p><strong>Phone:</strong><br />(555) 123-FOOD</p>
                <p><strong>Email:</strong><br />info@kisselfood.com</p>
                <Button variant="hero" className="mt-4">
                  Make Reservation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-earth-brown mb-4">Follow Us</h3>
          <p className="text-muted-foreground mb-6">Stay updated with our latest dishes and special offers</p>
          <div className="flex justify-center space-x-4">
            <Button variant="elegant">Facebook</Button>
            <Button variant="elegant">Instagram</Button>
            <Button variant="elegant">Twitter</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;