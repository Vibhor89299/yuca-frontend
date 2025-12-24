import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, User, CartState, AuthState } from '../types';

interface Store extends CartState, AuthState {
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Auth actions
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Cart state
      items: [],
      total: 0,
      itemCount: 0,
      
      // Auth state
      user: null,
      isAuthenticated: false,
      loading: false,
      
      // Cart actions
      addToCart: (product: Product, quantity = 1) => {
        const { items } = get();
        // Always use a string id for cart items
        const productId = product.id || product._id || '';
        const existingItem = items.find(item => item.id === productId);

        if (existingItem) {
          set(state => ({
            items: state.items.map(item =>
              item.id === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          set(state => ({
            items: [...state.items, { id: productId, product, quantity }],
          }));
        }

        // Update totals
        const newItems = get().items;
        const newTotal = newItems.reduce((sum, item) => sum + (item.product.retailPrice * item.quantity), 0);
        const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

        set({ total: newTotal, itemCount: newItemCount });
      },
      
      removeFromCart: (productId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== productId),
        }));
        
        // Update totals
        const newItems = get().items;
        const newTotal = newItems.reduce((sum, item) => sum + (item.product.retailPrice * item.quantity), 0);
        const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        
        set({ total: newTotal, itemCount: newItemCount });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          ),
        }));
        
        // Update totals
        const newItems = get().items;
        const newTotal = newItems.reduce((sum, item) => sum + (item.product.retailPrice * item.quantity), 0);
        const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        
        set({ total: newTotal, itemCount: newItemCount });
      },
      
      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
      },
      
      // Auth actions
      login: (user: User) => {
        set({ user, isAuthenticated: true, loading: false });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, loading: false });
      },
      
      updateUser: (userData: Partial<User>) => {
        set(state => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'yuca-store',
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);