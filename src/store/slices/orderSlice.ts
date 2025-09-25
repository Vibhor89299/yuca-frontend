import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosinstance from '@/axiosinstance/axiosinstance';
import { Order } from '@/types';

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.post('/api/orders', orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to place order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get('/api/orders/my');
      const data = response.data;
      // Normalize to always return an array of orders
      if (Array.isArray(data)) {
        return data as Order[];
      }
      if (data && Array.isArray(data.orders)) {
        return data.orders as Order[];
      }
      return [] as Order[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get(`/api/orders/${orderId}`);
      console.log('order',response)
      return response.data;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload as Order[];
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        // Some APIs return { success, order }, others return the order directly
        const payload = action.payload as any;
        state.currentOrder = (payload && payload.order) ? payload.order as Order : (payload as Order);
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
