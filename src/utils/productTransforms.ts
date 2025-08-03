import { Product } from '@/types/product';

export const transformProductData = (product: Partial<Product>): Product => {
  return {
    ...product,
    id: product._id || '', // Ensure UI compatibility
    images: product.images || [product.image || ''],
    inStock: (product.countInStock || 0) > 0,
    featured: product.featured || false,
    status: product.status || 'active',
    averageRating: product.averageRating || 0,
    numReviews: product.numReviews || 0,
    sales: product.sales || 0,
    // Additional UI-required fields with defaults
    tags: ['new'], // Default tag
    rating: product.averageRating || 0,
    reviewCount: product.numReviews || 0,
    brand: 'Yuca', // Default brand
    sku: product._id || '', // Use _id as SKU if not provided
  } as Product;
};

export const transformProductsData = (products: Partial<Product>[]): Product[] => {
  return products.map(transformProductData);
};
