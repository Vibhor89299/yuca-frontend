import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { Product } from '@/types';
import { Search, Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Search className="w-12 h-12 text-amber-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-300 rounded-full flex items-center justify-center">
            <Package className="w-4 h-4 text-amber-700" />
          </div>
        </div>

        <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-3">
          No Products Found
        </h3>

        <p className="text-gray-600 max-w-md leading-relaxed mb-6">
          We couldn't find any products matching your search. Try adjusting your filters or browse our complete collection.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Refresh Page
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 border border-amber-600 text-amber-600 hover:bg-amber-50 font-medium rounded-lg transition-colors duration-200"
          >
            Browse All Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
}
