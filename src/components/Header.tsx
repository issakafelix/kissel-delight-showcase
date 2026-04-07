import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = ["Home", "Menu", "Gallery", "About", "Contact"];

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled || isMobileMenuOpen
        ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-3" 
        : "bg-transparent py-5"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 relative z-50">
            <a href="#home" className="flex items-center space-x-2 group" onClick={() => setIsMobileMenuOpen(false)}>
              <h1 className={cn(
                "text-2xl font-black tracking-tight transition-colors",
                scrolled || isMobileMenuOpen ? "text-primary" : "text-white"
              )}>KISSEL</h1>
              <span className={cn(
                "text-sm tracking-widest uppercase font-medium",
                scrolled || isMobileMenuOpen ? "text-muted-foreground" : "text-white/80"
              )}>Food</span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
               <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className={cn(
                  "text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors relative group",
                  scrolled ? "text-foreground" : "text-white/90"
                )}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white hover:text-primary transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag className={cn("w-6 h-6", scrolled ? "text-foreground" : "text-white")} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full translate-x-1/4 -translate-y-1/4">
                  {cartCount}
                </span>
              )}
            </button>
            <a href="#reservation">
              <Button 
                variant={scrolled ? "default" : "outline"} 
                className={cn(
                  "rounded-full px-6",
                  !scrolled && "bg-white/10 text-white border-white/20 hover:bg-white hover:text-black"
                )}
              >
                Book Table
              </Button>
            </a>
          </div>

          <button 
            className="md:hidden relative z-50 p-2 mr-2"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className={cn("w-6 h-6", scrolled || isMobileMenuOpen ? "text-foreground" : "text-white")} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full translate-x-1/4 -translate-y-1/4">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            className="md:hidden relative z-50 p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className={cn("w-6 h-6", (scrolled || isMobileMenuOpen) ? "text-foreground" : "text-white")} />
            ) : (
              <Menu className={cn("w-6 h-6", scrolled ? "text-foreground" : "text-white")} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={cn(
        "md:hidden fixed inset-0 top-[60px] bg-background/95 backdrop-blur-xl transition-all duration-300 ease-in-out flex flex-col items-center justify-center space-y-8 h-[calc(100vh-60px)]",
        isMobileMenuOpen ? "opacity-100 translate-x-0 visible" : "opacity-0 translate-x-full invisible"
      )}>
        <nav className="flex flex-col items-center space-y-6 w-full px-6">
          {navLinks.map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="text-2xl font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors w-full text-center py-2 border-b border-border/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="w-full pt-6">
            <a href="#reservation" onClick={() => setIsMobileMenuOpen(false)}>
              <Button size="lg" className="w-full text-lg rounded-full h-14">
                Book Table
              </Button>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;