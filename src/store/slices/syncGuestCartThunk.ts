// src/store/slices/cartSlice.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem } from '@/types';
import axiosinstance from '@/axiosinstance/axiosinstance';

// Thunk to sync guest cart to backend after login
export const syncGuestCart = createAsyncThunk(
  'cart/syncGuestCart',
  async (guestItems: CartItem[], { rejectWithValue }) => {
    try {
            // Format guest items for the backend
      const formattedItems = guestItems.map(item => ({
        id: item.product._id || item.product.id,
        quantity: item.quantity
      }));
      
      // Send formatted items to backend to merge with user cart
      const response = await axiosinstance.post('/api/cart/sync', { items: formattedItems });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync guest cart');
    }
  }
);
