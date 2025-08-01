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
        
        {/* Map Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-earth-brown mb-4">Find Us Here</h3>
            <p className="text-muted-foreground">Located in the heart of the city's culinary district</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="map-container rounded-xl overflow-hidden shadow-elegant border border-golden/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.681138573899!2d-73.98731492404064!3d40.74844097138593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1709123456789!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kissel Food Restaurant Location"
              />
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Easily accessible by public transport • Free parking available • Wheelchair accessible
              </p>
              <Button variant="hero" size="lg">
                Get Directions
              </Button>
            </div>
          </div>
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