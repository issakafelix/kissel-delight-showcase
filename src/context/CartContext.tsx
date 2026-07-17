import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface CartAddon {
  id: string;
  name: string;
  price: number; // pesewas
}

export interface CartItem {
  lineId: string; // itemId + variant + add-ons — distinguishes customised lines
  itemId: string;
  name: string; // includes variant, e.g. "Grilled Chicken (Full)"
  image: string;
  variantId?: string;
  variantName?: string;
  addons: CartAddon[];
  unitPrice: number; // pesewas — variant/base price + add-ons
  quantity: number;
}

// What the menu sends when adding to cart (before we assign a lineId).
export type AddToCartPayload = Omit<CartItem, "lineId" | "quantity">;

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: AddToCartPayload, quantity?: number) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "kissel-cart-v2";

export const makeLineId = (item: Pick<CartItem, "itemId" | "variantId" | "addons">) =>
  [item.itemId, item.variantId ?? "", item.addons.map((a) => a.id).sort().join(",")].join("|");

const loadStoredCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem =>
        i &&
        typeof i.lineId === "string" &&
        typeof i.itemId === "string" &&
        typeof i.name === "string" &&
        typeof i.unitPrice === "number" &&
        typeof i.quantity === "number" &&
        Array.isArray(i.addons)
    );
  } catch {
    return [];
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // storage full or unavailable — cart still works in memory
    }
  }, [cartItems]);

  const addToCart = (item: AddToCartPayload, quantity = 1) => {
    const lineId = makeLineId(item);
    setCartItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        toast.success(`Added ${quantity} more ${item.name} to cart.`);
        return prev.map((i) =>
          i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      toast.success(`${item.name} added to cart.`);
      return [...prev, { ...item, lineId, quantity }];
    });
  };

  const removeFromCart = (lineId: string) => {
    setCartItems((prev) => prev.filter((i) => i.lineId !== lineId));
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(lineId);
      return;
    }
    setCartItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
