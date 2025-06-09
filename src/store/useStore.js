import { create } from 'zustand';

const useStore = create((set, get) => ({
  // User state
  user: null,
  isAuthenticated: false,
  
  // Cart state
  cart: [],
  cartTotal: 0,
  
  // UI state
  isLoading: false,
  
  // Actions
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false, cart: [] }),
  
  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find(item => 
      item.id === product.id && 
      item.size === product.size && 
      item.color === product.color
    );
    
    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.id === existingItem.id && 
          item.size === existingItem.size && 
          item.color === existingItem.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
    
    // Update total
    get().updateCartTotal();
  },
  
  removeFromCart: (productId, size, color) => {
    const { cart } = get();
    set({
      cart: cart.filter(item => 
        !(item.id === productId && item.size === size && item.color === color)
      )
    });
    get().updateCartTotal();
  },
  
  updateQuantity: (productId, size, color, quantity) => {
    const { cart } = get();
    if (quantity <= 0) {
      get().removeFromCart(productId, size, color);
      return;
    }
    
    set({
      cart: cart.map(item =>
        item.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    });
    get().updateCartTotal();
  },
  
  updateCartTotal: () => {
    const { cart } = get();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    set({ cartTotal: total });
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
}));

export default useStore;
