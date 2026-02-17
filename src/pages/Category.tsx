
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductsByCategory } from '@/services/actions';
import { formatIndianPrice } from '@/utils/currency';
import bg from '@/assets/bg-bg.jpg';

// Banner images (keep existing import or map dynamically)
// Banner images
import koshahDesktop from "@/assets/banner-koshah.png";
import candlesBanner from "@/assets/candles.png";
import bowlsBanner from "@/assets/bowls.png";

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (category) {
      dispatch(fetchProductsByCategory(category));
    }
  }, [dispatch, category]);



  // Dynamic Banner
  let bannerImage = koshahDesktop;
  if (category?.toLowerCase() === 'candles') {
    bannerImage = candlesBanner;
  } else if (category?.toLowerCase() === 'bowls') {
    bannerImage = bowlsBanner;
  }

  return (
    <div className="min-h-screen page-enter pt-[80px] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.5
        }}
      />
      <div className="relative z-10">

        {/* Hero / Banner Section */}
        <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
          {/* Dynamic Banner Image */}
          <div className="absolute inset-0 z-0">
            <img src={bannerImage} alt={`${category || 'Collection'} Banner`} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-16 lg:py-24">
          {loading ? (
            <div className="text-center py-20 text-kimber">Loading collection...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-kimber">No products found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((product) => {
                const isOutOfStock = product.countInStock === 0;
                return (
                  <Link to={`/product/${product._id || product.id}`} key={product._id || product.id} className="group block">
                    {/* Borderless Card */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-white/5 mb-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                      />
                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20">
                          <span className="text-white font-serif tracking-[0.2em] text-sm uppercase border border-white/80 px-4 py-2 backdrop-blur-sm">
                            Sold Out
                          </span>
                        </div>
                      )}
                      {/* Hover Overlay */}
                      {!isOutOfStock && (
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="text-xs uppercase tracking-[0.2em] text-kimber group-hover:text-kimber transition-colors">
                        {product.category || 'Collection'}
                      </h3>
                      <h2 className="font-serif text-xl text-kimber group-hover:text-autumnFern transition-colors">
                        {product.name}
                      </h2>
                      <p className="font-light text-kimber">
                        {formatIndianPrice(product.retailPrice)}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}