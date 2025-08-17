import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // User state
        user: null,
        isAuthenticated: false,

        // Cart state
        cart: [],
        cartTotal: 0,

        // UI state
        isLoading: true, // Start with loading true to check auth on mount

        // Initialize cart from localStorage on mount
        initializeCart: () => {
          get().updateCartTotal();
        },

      // Actions
      login: (userData) =>
        set({ user: userData, isAuthenticated: true }, false, 'login'),
      logout: () => {
        localStorage.removeItem('token');
        set(
          { user: null, isAuthenticated: false, cart: [], cartTotal: 0 },
          false,
          'logout'
        );
      },

      addToCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find(
          (item) =>
            item.id === product.id &&
            (item.size || null) === (product.size || null) &&
            (item.color || null) === (product.color || null)
        );

        if (existingItem) {
          set(
            {
              cart: cart.map((item) =>
                item.id === existingItem.id &&
                (item.size || null) === (existingItem.size || null) &&
                (item.color || null) === (existingItem.color || null)
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            },
            false,
            'addToCart/increment'
          );
        } else {
          set(
            { cart: [...cart, { ...product, quantity: 1 }] },
            false,
            'addToCart/new'
          );
        }

        // Update total
        get().updateCartTotal();
      },

      removeFromCart: (productId, size, color) => {
        const { cart } = get();
        set(
          {
            cart: cart.filter(
              (item) =>
                !(
                  item.id === productId &&
                  (item.size || null) === (size || null) &&
                  (item.color || null) === (color || null)
                )
            ),
          },
          false,
          'removeFromCart'
        );
        get().updateCartTotal();
      },

      updateQuantity: (productId, size, color, quantity) => {
        const { cart } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId, size, color);
          return;
        }

        set(
          {
            cart: cart.map((item) =>
              item.id === productId &&
              (item.size || null) === (size || null) &&
              (item.color || null) === (color || null)
                ? { ...item, quantity }
                : item
            ),
          },
          false,
          'updateQuantity'
        );
        get().updateCartTotal();
      },

      updateCartTotal: () => {
        const { cart } = get();
        const total = cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        set({ cartTotal: total }, false, 'updateCartTotal');
      },

      setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),
    }),
    {
      name: 'ra-clothier-cart', // localStorage key
      partialize: (state) => ({ 
        cart: state.cart,
        cartTotal: state.cartTotal 
      }), // Only persist cart-related state
    }
  ),
  {
    name: 'ra-clothier-store', // Store name in DevTools
  }
));

export default useStore;
