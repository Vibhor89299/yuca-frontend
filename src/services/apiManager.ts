import axiosInstance from './axiosInstance';

// Auth API endpoints
export const authAPI = {
  // Register new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<{
    name: string;
    email: string;
  }>) => {
    const response = await axiosInstance.put('/auth/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await axiosInstance.put('/auth/change-password', passwordData);
    return response.data;
  },
};

import { Product, ProductFilters, CreateProductData, UpdateProductData } from '../types/product';

// Product API endpoints
export const productAPI = {
  // Get all products with enhanced filtering
  getProducts: async (filters?: ProductFilters): Promise<{ 
    products: Product[];
    page: number;
    totalPages: number;
    totalProducts: number;
  }> => {
    const response = await axiosInstance.get('/products', { params: filters });
    return response.data;
  },

  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/category/${category}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await axiosInstance.get('/products/featured');
    return response.data;
  },

  // Get new arrivals
  getNewArrivals: async (limit: number = 8): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/new-arrivals?limit=${limit}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/search?q=${query}`);
    return response.data;
  },
};

// Order API endpoints
export const orderAPI = {
  // Create new order
  createOrder: async (orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
  }) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  },

  // Get user orders
  getOrders: async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
  },

  // Get single order
  getOrder: async (id: string) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },
};

// Cart API endpoints
export const cartAPI = {
  // Add item to cart
  addToCart: async (cartData: {
    productId: string;
    quantity: number;
  }) => {
    const response = await axiosInstance.post('/cart', cartData);
    return response.data;
  },

  // Get user's cart
  getCart: async () => {
    const response = await axiosInstance.get('/cart');
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (productId: string, quantity: number) => {
    const response = await axiosInstance.put(`/cart/${productId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (productId: string) => {
    const response = await axiosInstance.delete(`/cart/${productId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await axiosInstance.delete('/cart');
    return response.data;
  },
};

// Admin API endpoints (for admin users)
export const adminAPI = {
  // Product Management
  products: {
    getAll: async (params?: { 
      page?: number; 
      search?: string; 
      category?: string;
      limit?: number;
      sortBy?: string;
    }): Promise<{
      products: Product[];
      page: number;
      totalPages: number;
      totalProducts: number;
    }> => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.search) queryParams.set('search', params.search);
      if (params?.category) queryParams.set('category', params.category);
      
      const response = await axiosInstance.get(`/admin/products?${queryParams}`);
      return response.data;
    },

    create: async (productData: CreateProductData): Promise<Product> => {
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'image' && value instanceof File) {
            formData.append('image', value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await axiosInstance.post('/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    update: async (productData: UpdateProductData): Promise<Product> => {
      const { id, ...data } = productData;
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'image' && value instanceof File) {
            formData.append('image', value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await axiosInstance.put(`/admin/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
      const response = await axiosInstance.delete(`/admin/products/${id}`);
      return response.data;
    },

    updateInventory: async (id: string, countInStock: number): Promise<Product> => {
      const response = await axiosInstance.put(`/admin/products/${id}/inventory`, { countInStock });
      return response.data;
    },

    bulkDelete: async (ids: string[]): Promise<{ success: boolean; message: string }> => {
      const response = await axiosInstance.post('/admin/products/bulk-delete', { ids });
      return response.data;
    },

    bulkUpdateStatus: async (ids: string[], status: 'active' | 'inactive'): Promise<{ success: boolean; message: string }> => {
      const response = await axiosInstance.post('/admin/products/bulk-status', { ids, status });
      return response.data;
    }
  },

  // Order Management (Admin)
  orders: {
    getAll: async () => {
      const response = await axiosInstance.get('/admin/orders');
      return response.data;
    },

    getById: async (id: string) => {
      const response = await axiosInstance.get(`/admin/orders/${id}`);
      return response.data;
    },

    updateStatus: async (id: string, status: string) => {
      const response = await axiosInstance.put(`/admin/orders/${id}`, { status });
      return response.data;
    },

    getStats: async () => {
      const response = await axiosInstance.get('/admin/orders/stats');
      return response.data;
    }
  }
};
