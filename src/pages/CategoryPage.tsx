import  { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { products, categories } from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CategoryPage() {
  const { category, subcategory } = useParams();
  const [sortBy, setSortBy] = useState('featured');
  const [loading] = useState(false);

  const categoryData = categories.find(cat => cat.slug === category);
  
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      if (subcategory) {
        return product.category.toLowerCase() === categoryData?.name.toLowerCase() &&
               product.subcategory?.toLowerCase() === subcategory.replace('-', ' ');
      }
      return product.category.toLowerCase() === categoryData?.name.toLowerCase();
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // In a real app, this would sort by creation date
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured first
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [category, subcategory, sortBy, categoryData]);

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