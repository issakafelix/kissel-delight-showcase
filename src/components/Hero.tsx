import { Button } from "@/components/ui/button";
import { ChevronRight, Star } from "lucide-react";
import heroImage from "@/assets/hero-restaurant.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-105"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 mt-20">
        <div className="max-w-3xl animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8 animate-slide-up">
            <Star className="text-golden w-4 h-4 fill-current" />
            <span className="text-white text-sm font-medium tracking-wide border-l border-white/20 pl-2 ml-2">
              Award Winning Dining Experience
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Taste The <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-golden to-warm-orange">
              Extraordinary
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
            Where every dish is a masterpiece. Embark on a culinary journey exploring the depths of flavor and tradition with a modern twist.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-scale-in" style={{ animationDelay: '300ms' }}>
            <a href="#reservation" className="w-full sm:w-auto">
              <Button size="lg" className="text-lg px-8 py-6 bg-golden hover:bg-golden/90 text-earth-brown font-bold w-full sm:w-auto shadow-glow">
                Book a Table
              </Button>
            </a>
            <a href="#menu" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 text-white border-white/30 hover:bg-white/10 w-full sm:w-auto group">
                Explore Menu
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float flex flex-col items-center">
        <span className="text-white/70 text-xs uppercase tracking-widest mb-2 font-medium">Scroll Down</span>
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-golden rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;