import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosinstance from '@/axiosinstance/axiosinstance';
import { Reviews } from '@/types';

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get(`/api/products/${productId}/reviews`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

interface ReviewsState {
  reviews: Reviews[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  loading: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reviewsSlice.reducer;
