export type ProductCategory =
  | 'Electronics'
  | 'Cameras'
  | 'Laptops'
  | 'Accessories'
  | 'Headphones'
  | 'Food'
  | 'Books'
  | 'Clothes/Shoes'
  | 'Beauty/Health'
  | 'Sports'
  | 'Outdoor'
  | 'Home';

export type ProductStatus = 'active' | 'inactive';

export interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  countInStock: number;
  category: ProductCategory;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  status: ProductStatus;
  averageRating: number;
  numReviews: number;
  sales: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  brand: string;
  sku: string;
  variants?: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  countInStock: number;
  category: ProductCategory;
  status: ProductStatus;
  image?: File;
}

export interface UpdateProductData extends CreateProductData {
  id: string;
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
  name: string;
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
  total: number;
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