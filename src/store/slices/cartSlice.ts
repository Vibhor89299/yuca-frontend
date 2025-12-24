import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosinstance from '@/axiosinstance/axiosinstance';
import { CartItem } from '@/types';
// import { RootState } from '../store';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get('/api/cart');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.post('/api/cart', { productId, quantity });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.put(`/api/cart/${productId}`, { quantity });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.delete(`/api/cart/${productId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.delete('/api/cart');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

function saveCartToLocalStorage(cart: CartState) {
  localStorage.setItem('yuca_guest_cart', JSON.stringify(cart));
}

// function loadCartFromLocalStorage(): CartState | null {
//   const data = localStorage.getItem('yuca_guest_cart');
//   if (!data) return null;
//   try {
//     return JSON.parse(data);
//   } catch {
//     return null;
//   }
// }

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setGuestCart(state, action) {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.itemCount = action.payload.itemCount;
    },
    addGuestCartItem(state, action) {
      const { product, quantity } = action.payload;
      const existing = state.items.find(i => i.id === product.id || i.id === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ id: product.id || product._id, product, quantity });
      }
      state.total = state.items.reduce((sum, i) => sum + i.product.retailPrice * i.quantity, 0);
      state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
      saveCartToLocalStorage(state);
    },
    updateGuestCartItem(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) item.quantity = quantity;
      state.total = state.items.reduce((sum, i) => sum + i.product.retailPrice * i.quantity, 0);
      state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
      saveCartToLocalStorage(state);
    },
    removeGuestCartItem(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.total = state.items.reduce((sum, i) => sum + i.product.retailPrice * i.quantity, 0);
      state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
      saveCartToLocalStorage(state);
    },
    clearGuestCart(state) {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      saveCartToLocalStorage(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.itemCount = action.payload.itemCount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.itemCount = action.payload.itemCount;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.itemCount = action.payload.itemCount;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.itemCount = action.payload.itemCount;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
      });
  },
});

export const { setGuestCart, addGuestCartItem, updateGuestCartItem, removeGuestCartItem, clearGuestCart } = cartSlice.actions;
export default cartSlice.reducer;
