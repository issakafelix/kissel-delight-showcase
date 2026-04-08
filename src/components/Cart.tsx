import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { db } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const onSuccess = async (reference: Record<string, unknown>) => {
    setIsProcessing(false);

    try {
      await db.saveOrder({
        customerEmail: email,
        customerPhone: phone,
        items: cartItems.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        total: cartTotal,
        paystackRef: String(reference.reference || 'internal-test')
      });

      toast.success("Payment Received! Your order has been dispatched to the kitchen.", {
        description: "We are preparing your meal now!"
      });

      clearCart();
      setIsCartOpen(false);
    } catch (e) {
      toast.error("Payment succeeded, but failed to save order to our systems.");
    }
  };

  const onClose = () => {
    setIsProcessing(false);
    toast.error("Payment dropped or cancelled.");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!email.trim() || !phone.trim()) {
      toast.error("Contact details are required to process payments securely.");
      return;
    }

    setIsProcessing(true);

    // Create direct connection to Paystack without node modules
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      const handler = (window as any).PaystackPop.setup({
        key: 'pk_test_7912835ae75c1fccc7a9f6ccb7df343ead3daad7', // Live Test Key
        email: email,
        amount: cartTotal * 100, // Pesewas
        currency: 'GHS',
        ref: '' + Math.floor((Math.random() * 1000000000) + 1),
        callback: function (response: any) {
          onSuccess(response);
        },
        onClose: function () {
          onClose();
        }
      });
      handler.openIframe();
    };
    document.body.appendChild(script);
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
          <div className="p-6 border-t border-border bg-muted/10 space-y-4">
            <div className="space-y-3 pb-4 border-b border-border/50">
              <div>
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase">Email Receipt</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 shadow-none" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase">Mobile Money / Whatsapp No.</Label>
                <Input id="phone" type="tel" placeholder="054 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 shadow-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-medium text-muted-foreground mb-2">
                <span>Subtotal</span>
                <span>GH₵{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-2xl text-foreground mb-4">
                <span>Total</span>
                <span className="text-primary">GH₵{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={handleCheckout} disabled={isProcessing} size="lg" className="w-full py-6 text-lg rounded-xl shadow-warm flex items-center justify-center">
              {isProcessing ? "Processing..." : `Pay GH₵${cartTotal.toFixed(2)} Securely`}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <span className="text-green-600">🔒</span> Secured by Paystack
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
