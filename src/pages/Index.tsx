import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import MenuSection from "@/components/MenuSection";
import Gallery from "@/components/Gallery";
import Reservation from "@/components/Reservation";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import { CartProvider } from "@/context/CartContext";

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background font-sans selection:bg-golden/30">
        <Header />
        <Hero />
        <Features />
        <MenuSection />
        <Gallery />
        <Reservation />
        <About />
        <Contact />
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
};

export default Index;
