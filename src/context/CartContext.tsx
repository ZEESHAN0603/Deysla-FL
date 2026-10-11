import React, { createContext, useContext, useState, useEffect } from "react";

export interface EnquiryItem {
  id: string; // product id or category id
  name: string;
  categoryName: string;
  image?: string;
  brandPreference?: string;
  quantity: number;
  notes?: string;
}

export interface QuoteRequestForm {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  city: string;
  projectTimeline: string;
  message: string;
}

interface CartContextType {
  items: EnquiryItem[];
  addItem: (item: Omit<EnquiryItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  updateBrandPreference: (id: string, brand: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  isEnquiryModalOpen: boolean;
  setIsEnquiryModalOpen: (open: boolean) => void;
  lastAddedItem: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<EnquiryItem[]>(() => {
    try {
      const saved = localStorage.getItem("deysla_enquiry_items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("deysla_enquiry_items", JSON.stringify(items));
    } catch (e) {
      console.error("Could not persist enquiry items:", e);
    }
  }, [items]);

  const addItem = (item: Omit<EnquiryItem, "quantity"> & { quantity?: number }) => {
    const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setLastAddedItem(item.name);
    setTimeout(() => setLastAddedItem(null), 3000);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const updateNotes = (id: string, notes: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, notes } : i))
    );
  };

  const updateBrandPreference = (id: string, brandPreference: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, brandPreference } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        updateBrandPreference,
        clearCart,
        totalItemsCount,
        isEnquiryModalOpen,
        setIsEnquiryModalOpen,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
