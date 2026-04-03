import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-earth-brown mb-4">Visit Us Today</h2>
          <p className="text-xl text-muted-foreground">
            We are ready to serve you the finest dining experience
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="bg-gradient-card shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="text-primary text-2xl">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={100}
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={255}
                />
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  maxLength={1000}
                  rows={5}
                />
                <Button variant="hero" className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gradient-card shadow-elegant text-center">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Kasoa-Fetteh Kakraba<br />
                Adjacent KAAF University<br />
                Kasoa, Central Region, Ghana
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
                <p><strong>Phone:</strong><br />+233 537 947 455</p>
                <p><strong>Email:</strong><br />info@kisselfood.com</p>
                <a href="https://wa.me/233537947455?text=Hi%2C%20I%27d%20like%20to%20make%20a%20reservation" target="_blank" rel="noopener noreferrer">
                  <Button variant="hero" className="mt-4">
                    Make Reservation
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Map Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-earth-brown mb-4">Find Us Here</h3>
            <p className="text-muted-foreground">Located at Kasoa-Fetteh Kakraba, adjacent KAAF University</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="map-container rounded-xl overflow-hidden shadow-elegant border border-golden/20">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=KAAF+University+College,Fetteh+Kakraba,Kasoa,Ghana&zoom=15"
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
                Easily accessible by trotro & taxi • Parking available • Adjacent KAAF University, Kasoa
              </p>
              <a href="https://www.google.com/maps/dir/?api=1&destination=KAAF+University+College,Fetteh+Kakraba,Kasoa,Ghana" target="_blank" rel="noopener noreferrer">
                <Button variant="hero" size="lg">
                  Get Directions
                </Button>
              </a>
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