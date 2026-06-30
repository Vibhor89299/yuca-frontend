import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { searchProducts } from '@/services/actions';
import { formatIndianPrice } from '@/utils/currency';
import bg from '@/assets/bg-bg.jpg';
import { posthog } from '@/lib/posthog';

/**
 * Search results page (YL-001). Wired to the existing GET /api/products/search?q=
 * endpoint via the searchProducts thunk, which populates the products slice.
 * Replaces the old behaviour where /search?q=… 404'd into NotFoundPage.
 */
export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (query) {
      dispatch(searchProducts(query));
    }
  }, [dispatch, query]);

  // Track the search + whether it returned anything, once the request settles.
  useEffect(() => {
    if (!loading && query) {
      posthog.capture('search_performed', { query, resultCount: products.length });
      if (products.length === 0 && !error) {
        posthog.capture('search_no_results', { query });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, query]);

  return (
    <div className="min-h-screen page-enter pt-[80px] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.5,
        }}
      />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h1 className="text-xs uppercase tracking-[0.2em] text-kimber mb-2">Search Results</h1>
            {query && (
              <h2 className="font-serif text-3xl text-kimber">
                “{query}”
                {!loading && !error && (
                  <span className="block text-sm font-light text-kimber/70 mt-2">
                    {products.length} {products.length === 1 ? 'result' : 'results'}
                  </span>
                )}
              </h2>
            )}
          </div>

          {!query ? (
            <div className="text-center py-20 text-kimber">
              <p className="font-light">Type something in the search bar to find products.</p>
            </div>
          ) : loading ? (
            <div className="text-center py-20 text-kimber">Searching…</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 space-y-6">
              <p className="text-kimber font-light">
                No results for “{query}”. Try a different term or browse our collections.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  to="/category/candles"
                  className="text-xs uppercase tracking-[0.2em] text-autumnFern hover:underline"
                >
                  Shop Candles
                </Link>
                <Link
                  to="/category/bowls"
                  className="text-xs uppercase tracking-[0.2em] text-autumnFern hover:underline"
                >
                  Shop Bowls
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((product) => {
                const isOutOfStock = product.countInStock === 0;
                return (
                  <Link
                    to={`/product/${product._id || product.id}`}
                    key={product._id || product.id}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-white/5 mb-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                      />
                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20">
                          <span className="text-white font-serif tracking-[0.2em] text-sm uppercase border border-white/80 px-4 py-2 backdrop-blur-sm">
                            Sold Out
                          </span>
                        </div>
                      )}
                      {!isOutOfStock && (
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-xs uppercase tracking-[0.2em] text-kimber transition-colors">
                        {product.category || 'Collection'}
                      </h3>
                      <h2 className="font-serif text-xl text-kimber group-hover:text-autumnFern transition-colors">
                        {product.name}
                      </h2>
                      <p className="font-light text-kimber">{formatIndianPrice(product.retailPrice)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
