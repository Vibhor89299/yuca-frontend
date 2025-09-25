export interface Product {
  _id?: string;
  id?: string; // For backwards compatibility
  name: string;
  description: string;
  price: number;
  countInStock: number;
  category: string;
  image: string;
  rating: number;
  numReviews: number;
  user?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for compatibility
  images?: string[];
  subcategory?: string;
  inStock?: boolean;
  tags?: string[];
  reviewCount?: number;
  brand?: string;
  sku?: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariants?: { [key: string]: string };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  addresses?: Address[];
  orders?: Order[];
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  totalPrice: number;
  shippingAddress: Address;
  billingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: Category[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Reviews {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}