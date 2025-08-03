import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { productAPI } from '@/services/apiManager';
import { Product, ProductFilters, ProductCategory } from '@/types/product';
import { transformProductsData } from '@/utils/productTransforms';
import { useToast } from '@/hooks/useToast';
import { categories } from '@/data/categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortValue, setSortValue] = useState('newest');
  const [filters, setFilters] = useState<ProductFilters>({
    category: category as ProductCategory,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });
  const { toast } = useToast();

  const categoryData = categories.find(cat => cat.slug === category);

  useEffect(() => {
    const loadProducts = async () => {
      if (!categoryData) return;
      
      try {
        setLoading(true);
        const response = await productAPI.getProducts(filters);
        setProducts(transformProductsData(response.products));
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load products',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters, toast, categoryData]);

  const handleSortChange = (value: string) => {
    setSortValue(value);
    let sortBy: ProductFilters['sortBy'] = 'createdAt';
    let sortOrder: ProductFilters['sortOrder'] = 'desc';

    switch (value) {
      case 'price-low':
        sortBy = 'price';
        sortOrder = 'asc';
        break;
      case 'price-high':
        sortBy = 'price';
        sortOrder = 'desc';
        break;
      case 'name':
        sortBy = 'name';
        sortOrder = 'asc';
        break;
      case 'newest':
        sortBy = 'createdAt';
        sortOrder = 'desc';
        break;
    }

    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder,
      page: 1 // Reset to first page when sorting changes
    }));
  };

  if (!categoryData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-center text-gray-500">Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-sage-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold luxury-text mb-4">
            {categoryData.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            {categoryData.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span className="text-sm text-muted-foreground">
              {products.length} products
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Select value={sortValue} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );

  if (!categoryData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
      </div>
    );
  }

  const pageTitle = subcategory 
    ? `${subcategory.replace('-', ' ')} - ${categoryData.name}`
    : categoryData.name;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-serif font-bold luxury-text mb-4">
          {pageTitle.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {categoryData.description}
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="border-sage-200">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} products
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Customer Rating</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid products={filteredProducts} loading={loading} />
    </div>
  );
}