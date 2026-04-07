import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    let orderText = `*New Order from Kissel Food:*\n\n`;
    cartItems.forEach((item) => {
      orderText += `▪️ ${item.quantity}x ${item.name} - GH₵${(item.price * item.quantity).toFixed(2)}\n`;
    });
    orderText += `\n*Total Due: GH₵${cartTotal.toFixed(2)}*`;
    orderText += `\n\nPlease let me know the payment and delivery/pickup instructions.`;

    const waLink = `https://wa.me/233537947455?text=${encodeURIComponent(orderText)}`;
    
    // Open WhatsApp
    window.open(waLink, "_blank");
    
    // Clear cart after sequence
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background border-l-border flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border bg-muted/30">
          <SheetTitle className="flex items-center text-2xl font-bold text-foreground">
            <ShoppingBag className="mr-3 w-6 h-6 text-primary" />
            Your Order
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground opacity-70">
              <ShoppingBag className="w-16 h-16 mb-4" />
              <p className="text-xl font-medium">Your cart is empty.</p>
              <p className="text-sm mt-2">Add some delicious items from the menu!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate">{item.name}</h4>
                    <p className="text-primary font-bold">GH₵{item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-border rounded-md bg-background">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-muted text-foreground transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-muted text-foreground transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-auto p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-border bg-muted/10">
            <div className="flex items-center justify-between font-medium text-muted-foreground mb-2">
              <span>Subtotal</span>
              <span>GH₵{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between font-bold text-2xl text-foreground mb-6">
              <span>Total</span>
              <span className="text-primary">GH₵{cartTotal.toFixed(2)}</span>
            </div>
            
            <Button onClick={handleCheckout} size="lg" className="w-full py-6 text-lg rounded-xl shadow-warm">
              Checkout via WhatsApp
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
