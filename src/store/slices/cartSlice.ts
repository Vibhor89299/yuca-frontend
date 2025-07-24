import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  guestItems: CartItem[];
  total: number;
  itemCount: number;
}

const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('guestCart');
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

const initialState: CartState = {
  items: [],
  guestItems: loadCartFromLocalStorage(),
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const { id } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    
    addToGuestCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const { id } = action.payload;
      const existingItem = state.guestItems.find((item) => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.guestItems.push({ ...action.payload, quantity: 1 });
      }
      
      state.itemCount = state.guestItems.reduce((total, item) => total + item.quantity, 0);
      state.total = state.guestItems.reduce((total, item) => total + item.price * item.quantity, 0);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('guestCart', JSON.stringify(state.guestItems));
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    
    removeFromGuestCart: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.guestItems = state.guestItems.filter((item) => item.id !== id);
      state.itemCount = state.guestItems.reduce((total, item) => total + item.quantity, 0);
      state.total = state.guestItems.reduce((total, item) => total + item.price * item.quantity, 0);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('guestCart', JSON.stringify(state.guestItems));
      }
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock));
        state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
        state.total = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      }
    },
    
    updateGuestQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.guestItems.find((item) => item.id === id);
      
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock));
        state.itemCount = state.guestItems.reduce((total, item) => total + item.quantity, 0);
        state.total = state.guestItems.reduce((total, item) => total + item.price * item.quantity, 0);
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('guestCart', JSON.stringify(state.guestItems));
        }
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
    },
    
    clearGuestCart: (state) => {
      state.guestItems = [];
      state.itemCount = 0;
      state.total = 0;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('guestCart');
      }
    },
    
    migrateGuestCart: (state) => {
      // When a guest logs in, migrate their cart items
      state.items = [...state.items, ...state.guestItems];
      state.guestItems = [];
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      
      // Clear guest cart from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('guestCart');
      }
    },
  },
});

export const {
  addToCart,
  addToGuestCart,
  removeFromCart,
  removeFromGuestCart,
  updateQuantity,
  updateGuestQuantity,
  clearCart,
  clearGuestCart,
  migrateGuestCart,
} = cartSlice.actions;

export default cartSlice.reducer;
