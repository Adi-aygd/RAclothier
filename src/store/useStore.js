import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,

      // Cart state
      cart: [],
      cartTotal: 0,

      // UI state
      isLoading: false,

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
            item.size === product.size &&
            item.color === product.color
        );

        if (existingItem) {
          set(
            {
              cart: cart.map((item) =>
                item.id === existingItem.id &&
                item.size === existingItem.size &&
                item.color === existingItem.color
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
                  item.size === size &&
                  item.color === color
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
              item.size === size &&
              item.color === color
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
      name: 'ra-clothier-store', // Store name in DevTools
    }
  )
);

export default useStore;
