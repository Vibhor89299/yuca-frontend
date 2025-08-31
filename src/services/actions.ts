import axiosinstance from "@/axiosinstance/axiosinstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get(`/api/products?page=${page}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get('/api/products/featured');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get(`/api/products/category/${category}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products by category');
    }
  }
);

// Async thunk for searching products
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get(`/api/products/search?q=${searchTerm}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);