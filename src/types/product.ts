export interface Product {
  _id: string;
  id: string; // For compatibility with UI components
  name: string;
  description: string;
  price: number;
  countInStock: number;
  category: ProductCategory;
  image: string;
  images: string[]; // Array of additional images
  inStock: boolean;
  featured: boolean;
  status: 'active' | 'inactive';
  averageRating: number;
  numReviews: number;
  sales: number;
  createdAt?: string;
  updatedAt?: string;
  // Additional UI-required fields
  tags: string[];
  rating: number;
  reviewCount: number;
  brand: string;
  sku: string;
}

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

export interface ProductFilters {
  category?: ProductCategory;
  subcategory?: string;
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  countInStock: number;
  category: ProductCategory;
  image?: File;
  images?: File[];
  status?: 'active' | 'inactive';
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}
