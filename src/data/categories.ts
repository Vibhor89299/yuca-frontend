import { ProductCategory } from '@/types/product';

export interface CategoryData {
  id: ProductCategory;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export const categories: CategoryData[] = [
  {
    id: 'Electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Explore our collection of cutting-edge electronics',
    image: '/images/categories/electronics.jpg'
  },
  {
    id: 'Laptops',
    name: 'Laptops',
    slug: 'laptops',
    description: 'Powerful laptops for work and play',
    image: '/images/categories/laptops.jpg'
  },
  {
    id: 'Accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Essential accessories for your devices',
    image: '/images/categories/accessories.jpg'
  },
  {
    id: 'Headphones',
    name: 'Headphones',
    slug: 'headphones',
    description: 'Premium audio experiences',
    image: '/images/categories/headphones.jpg'
  },
  {
    id: 'Beauty/Health',
    name: 'Beauty & Health',
    slug: 'beauty-health',
    description: 'Products for your wellbeing',
    image: '/images/categories/beauty-health.jpg'
  },
  {
    id: 'Sports',
    name: 'Sports',
    slug: 'sports',
    description: 'Equipment for active lifestyles',
    image: '/images/categories/sports.jpg'
  }
];
