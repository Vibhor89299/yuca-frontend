// import { Link } from 'react-router-dom';
// import { ArrowRight, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/services/actions';
import koshahDesktop from "../../assets/banner-koshah.png"
import koshahTablet from "../../assets/banner-tb.png"
import koshahMobile from "../../assets/banner-mb.png"


export function KoshaCollection() {

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
          {/* Overlay container */}
          <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
            {/* Dark gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
            
            <picture>
    {/* Mobile (default) */}
    <source 
      media="(max-width: 639px)" 
      srcSet={koshahMobile}
    />
    {/* Tablet */}
    <source 
      media="(min-width: 640px) and (max-width: 1023px)" 
      srcSet={koshahTablet}
    />
    {/* Desktop */}
    <source 
      media="(min-width: 1024px)" 
      srcSet={koshahDesktop}
    />
    {/* Fallback image */}
    <img
      src={koshahDesktop}
      alt="Kosha Collection"
      className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] object-cover"
      style={{ objectPosition: 'center' }}
    />
  </picture>
            
            {/* Text content with improved responsiveness */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="w-full max-w-4xl mx-auto lg:mx-0 lg:ml-8 xl:ml-16 text-center lg:text-left p-4 sm:p-6 md:p-8 lg:p-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-2 sm:mb-3 md:mb-4
                             tracking-wide drop-shadow-2xl">
                  Koshah Collection
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 max-w-2xl mx-auto lg:mx-0
                             drop-shadow-2xl font-medium leading-relaxed
                             hidden sm:block">
                  Discover thoughtfully curated Kosha products that <br /> bring luxury and sustainability together
                </p>
              </div>
            </div>
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