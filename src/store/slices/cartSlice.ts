import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/apiManager';

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

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart({ productId, quantity });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (productId: string, { rejectWithValue }) => {
    try {
      await cartAPI.removeFromCart(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
        state.total = action.payload.total || 0;
      })
      .addCase(fetchCart.rejected, (_state) => {
        // Handle error silently for now
      })
      // Add to cart
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const product = action.payload.product;
        if (product) {
          const existingItem = state.items.find(item => item.id === product.id);
          if (existingItem) {
            existingItem.quantity += product.quantity;
          } else {
            state.items.push({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: product.quantity,
              image: product.image,
              stock: 999 // Default stock value
            });
          }
          state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
          state.total = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
        }
      })
      .addCase(addToCartAsync.rejected, (_state) => {
        // Handle error silently for now
      })
      // Remove from cart
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
        state.total = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      })
      .addCase(removeFromCartAsync.rejected, (_state) => {
        // Handle error silently for now
      });
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
