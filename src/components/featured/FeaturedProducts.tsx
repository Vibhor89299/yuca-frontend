import { Link } from 'react-router-dom';
import { ArrowRight, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/services/actions';

export function FeaturedProducts() {

  const dispatch = useAppDispatch();
  const { products, loading, error, page, totalPages } = useAppSelector((state) => state.products);
  useEffect(() => {
    dispatch(fetchProducts(page));
  }, [dispatch, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchProducts(newPage));
    }
  };

  return (
    <section className="luxury-section luxury-gradient-section">
      <div className="container mx-auto px-4">
        {/* Kosha Collection Header with Image */}
        <div className="relative flex flex-col items-center justify-center mb-16">
          <img
            src="https://i.pinimg.com/736x/1e/75/55/1e7555a65f6e0b34358ad110ae31f562.jpg"
            alt="Kosha Collection"
            className="w-full max-h-64 object-cover rounded-xl shadow-lg mb-6"
            style={{ objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white drop-shadow-lg mb-2">
              Kosha Collection
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow">
              Discover thoughtfully curated Kosha products that bring luxury and sustainability together
            </p>
          </div>
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <ProductGrid products={products} loading={loading} />
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button size="sm" variant="outline" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              size="sm"
              variant={page === i + 1 ? 'default' : 'outline'}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}