import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-earth-brown text-white/90 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-black text-golden tracking-tight mb-2">KISSEL <span className="text-white text-xl font-medium tracking-widest uppercase block">Food</span></h3>
            </div>
            <p className="text-white/70 leading-relaxed">
              Elevating the culinary landscape with authentic flavors, premium ingredients, and an unforgettable dining atmosphere.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-golden hover:text-earth-brown transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-golden hover:text-earth-brown transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-golden hover:text-earth-brown transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-white/70 hover:text-golden transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-golden rounded-full mr-2"></span>Home</a></li>
              <li><a href="#menu" className="text-white/70 hover:text-golden transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-golden rounded-full mr-2"></span>Our Menu</a></li>
              <li><a href="#gallery" className="text-white/70 hover:text-golden transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-golden rounded-full mr-2"></span>Gallery</a></li>
              <li><a href="#reservation" className="text-white/70 hover:text-golden transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-golden rounded-full mr-2"></span>Reservations</a></li>
              <li><a href="#about" className="text-white/70 hover:text-golden transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-golden rounded-full mr-2"></span>About Us</a></li>
            </ul>
          </div>
          
          {/* Contact Details */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-golden mr-3 mt-1 flex-shrink-0" />
                <span className="text-white/70">Kasoa-Fetteh Kakraba<br/>Adjacent KAAF University<br/>Central Region, Ghana</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-golden mr-3 flex-shrink-0" />
                <a href="tel:+233537947455" className="text-white/70 hover:text-golden transition-colors">+233 537 947 455</a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-golden mr-3 flex-shrink-0" />
                <a href="mailto:info@kisselfood.com" className="text-white/70 hover:text-golden transition-colors">info@kisselfood.com</a>
              </li>
            </ul>
          </div>
          
          {/* Operating Hours */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Hours</h4>
            <ul className="space-y-4">
              <li className="flex items-start justify-between border-b border-white/10 pb-2">
                <span className="flex items-center"><Clock className="w-4 h-4 text-golden mr-2"/>Mon - Thu</span>
                <span className="text-white/70">11:00 AM - 10:00 PM</span>
              </li>
              <li className="flex items-start justify-between border-b border-white/10 pb-2">
                <span className="flex items-center"><Clock className="w-4 h-4 text-golden mr-2"/>Fri - Sat</span>
                <span className="text-white/70">11:00 AM - 11:00 PM</span>
              </li>
              <li className="flex items-start justify-between border-b border-white/10 pb-2">
                <span className="flex items-center"><Clock className="w-4 h-4 text-golden mr-2"/>Sunday</span>
                <span className="text-white/70">12:00 PM - 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Kissel Food Restaurant. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-white/50 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;