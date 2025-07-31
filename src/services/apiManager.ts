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

// Product API endpoints
export const productAPI = {
  // Get all products
  getProducts: async (params?: {
    category?: string;
    subcategory?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axiosInstance.get('/admin/products', { params });
    return response.data;
  },

  // Get single product
  getProduct: async (id: string) => {
    const response = await axiosInstance.get(`/admin/products/${id}`);
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
  // Create product
  createProduct: async (productData: FormData) => {
    const response = await axiosInstance.post('/admin/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update product
  updateProduct: async (id: string, productData: FormData) => {
    const response = await axiosInstance.put(`/admin/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string) => {
    const response = await axiosInstance.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Get all orders (admin)
  getAllOrders: async () => {
    const response = await axiosInstance.get('/admin/orders');
    return response.data;
  },
};
