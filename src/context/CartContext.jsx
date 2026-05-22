import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'pixelvault-cart';

const CartContext = createContext(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Load cart from localStorage with error handling
function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('[PixelVault Cart] Error reading cart from localStorage:', error);
  }
  return [];
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage());
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('[PixelVault Cart] Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Add a product to the cart (increments quantity if already present)
  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        toast.success(`Increased "${product.name}" quantity in cart`, {
          icon: '🛒',
          style: {
            background: '#1a1a2e',
            color: '#e0e0ff',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          },
        });
        return updated;
      }

      toast.success(`"${product.name}" added to cart`, {
        icon: '🛒',
        style: {
          background: '#1a1a2e',
          color: '#e0e0ff',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        },
      });
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  // Remove a product from the cart by its ID
  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === productId);
      const itemName = item ? item.name : 'Item';

      toast.success(`"${itemName}" removed from cart`, {
        icon: '🗑️',
        style: {
          background: '#1a1a2e',
          color: '#e0e0ff',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      });

      return prev.filter((i) => i.id !== productId);
    });
  }, []);

  // Update the quantity of a specific product in the cart
  const updateQuantity = useCallback((productId, qty) => {
    const quantity = Math.max(0, Math.floor(qty));

    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  // Clear all items from the cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.success('Cart cleared', {
      icon: '🧹',
      style: {
        background: '#1a1a2e',
        color: '#e0e0ff',
        border: '1px solid rgba(139, 92, 246, 0.3)',
      },
    });
  }, []);

  // Computed values
  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 0),
        0
      ),
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((count, item) => count + (item.quantity || 0), 0),
    [cartItems]
  );

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
