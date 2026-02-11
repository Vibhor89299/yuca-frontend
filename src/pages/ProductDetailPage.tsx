import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  Minus,
  Plus,
  Truck,
  // Shield,
  // RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import bg from "@/assets/bg.svg";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addToCart, addGuestCartItem } from "@/store/slices/cartSlice";
import { formatIndianPrice } from "@/utils/currency";
import axiosinstance from "@/axiosinstance/axiosinstance";
import { Product } from "@/types";
import { SEO } from "@/components/seo/SEO";
import { generateProductSchema, generateBreadcrumbSchema } from "@/utils/seoSchemas";
import { fetchProducts } from "@/services/actions";



// interface Review {}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  // const [activeTab, setActiveTab] = useState("reviews");
  // Reviews UI disabled; re-enable to use state below
  // const [visibleReviews, setVisibleReviews] = useState(2);

  // const customerReviews: Review[] = [];


  // const LuxuryOrnament = ({ className = "" }: { className?: string }) => (
  //   <svg
  //     className={className}
  //     viewBox="0 0 100 20"
  //     fill="none"
  //     xmlns="http://www.w3.org/2000/svg"
  //   >
  //     <path
  //       d="M10 10C15 5 25 5 30 10C35 15 45 15 50 10C55 5 65 5 70 10C75 15 85 15 90 10"
  //       stroke="currentColor"
  //       strokeWidth="1.5"
  //       fill="none"
  //       opacity="0.6"
  //     />
  //     <circle cx="50" cy="10" r="2" fill="currentColor" opacity="0.8" />
  //     <circle cx="20" cy="10" r="1" fill="currentColor" opacity="0.6" />
  //     <circle cx="80" cy="10" r="1" fill="currentColor" opacity="0.6" />
  //   </svg>
  // );

  // const PremiumBadge = ({ className = "" }: { className?: string }) => (
  //   <svg
  //     className={className}
  //     viewBox="0 0 120 40"
  //     fill="none"
  //     xmlns="http://www.w3.org/2000/svg"
  //   >
  //     <path
  //       d="M10 20L20 5H100L110 20L100 35H20L10 20Z"
  //       fill="currentColor"
  //       fillOpacity="0.1"
  //       stroke="currentColor"
  //       strokeWidth="1"
  //     />
  //     <path
  //       d="M25 20L30 12H90L95 20L90 28H30L25 20Z"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="0.5"
  //       opacity="0.6"
  //     />
  //   </svg>
  // );



  // const QualityStamp = ({ className = "" }: { className?: string }) => (
  //   <svg
  //     className={className}
  //     viewBox="0 0 60 60"
  //     fill="none"
  //     xmlns="http://www.w3.org/2000/svg"
  //   >
  //     <circle
  //       cx="30"
  //       cy="30"
  //       r="28"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       fill="none"
  //       opacity="0.2"
  //     />
  //     <circle
  //       cx="30"
  //       cy="30"
  //       r="20"
  //       stroke="currentColor"
  //       strokeWidth="1"
  //       fill="none"
  //       opacity="0.4"
  //     />
  //     <path
  //       d="M20 30L26 36L40 22"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     />
  //   </svg>
  // );
  
  const { products, page } = useAppSelector((state) => state.products);
  useEffect(() => {
    dispatch(fetchProducts(page));
  }, [dispatch, page]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosinstance.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);


  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      const productId = product._id || product.id;
      if (!productId) {
        throw new Error("Product ID is missing");
      }

      if (isAuthenticated) {
        // API Call to add to cart
        await axiosinstance.post(
          "/api/cart",
          {
            productId,
            quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("yuca_auth_token")}`,
            },
          }
        );

        // Also update Redux store for UI sync
        dispatch(addToCart({ productId, quantity }));
      } else {
        // Guest cart (local Redux store only)
        dispatch(addGuestCartItem({ product, quantity }));
      }

      // Success toast is handled in ProductCard component
    } catch {
      // Error handled by axios interceptor
    } finally {
      setAddingToCart(false);
    }
    setIsInCart(true);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  // const handleLoadMore = () => {
  //   if (visibleReviews < customerReviews.length) {
  //     setVisibleReviews((prev) => Math.min(prev + 2, customerReviews.length));
  //   } else {
  //     setVisibleReviews(2);
  //   }
  // };

  // const isShowingAll = visibleReviews >= customerReviews.length;

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : [];
  const inStock =
    product?.inStock ??
    (product?.countInStock !== undefined ? product.countInStock > 0 : true);

  // const handleShare = async () => {};
  // rgb(184 159 134)
  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-[140px] min-h-screen bg-mushroom/95 backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 pt-[140px] min-h-screen bg-mushroom/95 backdrop-blur-sm">
        <div className="text-center space-y-6">
          <h1 className="text-2xl luxury-heading">Product Not Found</h1>
          <p className="luxury-text-muted">
            {error || "The product you are looking for does not exist."}
          </p>
          <Button asChild className="luxury-button">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
              }`}
          />
        ))}
      </div>
    );
  };
  function capitalizeFirst(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Generate product schema
  const productSchema = product ? generateProductSchema(product) : undefined;

  // Generate breadcrumb schema
  const breadcrumbSchema = product ? generateBreadcrumbSchema([
    { name: "Home", url: "https://yucalifestyle.com" },
    { name: capitalizeFirst(product.category), url: `https://yucalifestyle.com/category/${product.category}` },
    { name: product.name, url: `https://yucalifestyle.com/product/${product.id}` }
  ]) : undefined;

  return (
    <>
      {product && (
        <SEO
          title={`${product.name} | YUCA Lifestyle`}
          description={product.description}
          keywords={`${product.name}, ${product.category}, luxury home decor, handcrafted, artisanal, YUCA lifestyle`}
          image={product.image}
          url={`https://yucalifestyle.com/product/${product.id}`}
          type="product"
          schema={productSchema}
        />
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      <div className="min-h-screen page-enter" style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {/* Breadcrumb moved inside main container for cleaner layout */}

        {/* Full-width Split Layout */}
        <div className="lg:flex min-h-screen">
          {/* Left Column: Image Gallery (Fixed/Sticky on Desktop) */}
          <div className="lg:w-[55%] relative lg:h-screen lg:sticky lg:top-0 bg-mushroom/20">
            {/* Mobile Breadcrumb & Back */}
            <div className="absolute top-24 left-4 z-20 lg:hidden">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="luxury-button-ghost bg-white/50 backdrop-blur-md rounded-full px-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>

            {/* Desktop Back Button */}
            <div className="absolute top-24 left-8 z-20 hidden lg:block">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="luxury-button-ghost bg-white/50 backdrop-blur-md rounded-full px-4 hover:bg-white/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>

            <div className="h-full w-full relative group">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-[60vh] lg:h-full object-cover transition-transform duration-1000"
              />

              {!inStock && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="text-xl font-philosopher text-red-800 bg-white/90 px-6 py-3 rounded-none tracking-widest uppercase border border-red-800/20">Out of Stock</span>
                </div>
              )}

              {product.featured && (
                <div className="absolute top-24 right-8 z-20">
                  <Badge className="bg-autumnFern text-blanket px-4 py-1.5 text-xs tracking-[0.2em] font-medium uppercase rounded-none">
                    Featured Collection
                  </Badge>
                </div>
              )}

              {/* Thumbnail Overlay (Desktop) */}
              {images.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 p-2 bg-white/20 backdrop-blur-md rounded-full">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${selectedImageIndex === index
                        ? "border-autumnFern scale-110"
                        : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Product Details (Scrollable) */}
          <div className="lg:w-[45%] lg:min-h-screen px-6 py-12 lg:px-16 lg:py-32 flex flex-col justify-center bg-white/40 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none">
            <div className="max-w-xl mx-auto w-full space-y-10 animate-fade-in">

              {/* Header Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-sm tracking-widest uppercase text-khakiMoss">
                  <Link to="/" className="hover:text-autumnFern transition-colors">Home</Link>
                  <span>/</span>
                  <Link to="#" className="hover:text-autumnFern transition-colors">{capitalizeFirst(product.category)}</Link>
                </div>

                <h1 className="text-hero leading-none text-oak">
                  {capitalizeFirst(product.name)}
                </h1>

                <div className="flex items-center justify-between border-b border-oak/10 pb-6">
                  <div className="space-y-1">
                    {(() => {
                      const current = product.retailPrice
                      const mrp = product.mrp
                      return (
                        <div className="flex items-baseline gap-4">
                          <p className="text-3xl font-light text-kimber">
                            {formatIndianPrice(current)}
                          </p>
                          {mrp > current && (
                            <span className="text-lg text-khakiMoss line-through decoration-1">
                              {formatIndianPrice(mrp)}
                            </span>
                          )}
                        </div>
                      )
                    })()}
                  </div>

                  <div className="flex items-center gap-2">
                    {renderStars(product.rating || 0)}
                    <span className="text-xs text-khakiMoss tracking-wider uppercase ml-2">
                      {product.numReviews || 0} Reviews
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-stone prose-lg">
                <p className="text-kimber/80 font-light leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Add to Cart Actions */}
              <div className="space-y-8 pt-6">
                {/* Quantity Selector Style */}
                <div className="flex items-center justify-between">
                  <span className="font-philosopher text-xl text-oak">Quantity</span>
                  <div className="flex items-center border border-oak/30 rounded-full h-12 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-8 w-8 rounded-full hover:bg-mushroom text-oak"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center font-medium text-lg text-oak">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const maxQty = product?.countInStock ?? Number.POSITIVE_INFINITY;
                        setQuantity((q) => Math.min(q + 1, maxQty));
                      }}
                      disabled={
                        !inStock || (product?.countInStock ? quantity >= product.countInStock : false)
                      }
                      className="h-8 w-8 rounded-full hover:bg-mushroom text-oak"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      if (isInCart) {
                        navigate("/cart");
                      } else {
                        handleAddToCart();
                      }
                    }}
                    disabled={!inStock || addingToCart}
                    className="w-full h-14 bg-autumnFern hover:bg-autumnFern-600 text-blanket transition-all duration-300 flex items-center justify-between px-8 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-sm tracking-[0.2em] font-medium uppercase">
                      {isInCart ? "View Cart" : addingToCart ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
                    </span>
                    <span className="transition-transform group-hover:translate-x-2">→</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!inStock || addingToCart}
                    className="w-full h-14 border border-oak text-oak hover:bg-oak hover:text-blanket transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                  >
                    <span className="text-sm tracking-[0.2em] font-medium uppercase">Buy Now</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Brown Feature Section */}
        <div className="bg-[#331D12] py-20 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 text-center md:text-left">
            <div className="flex items-center gap-6 scroll-reveal">
              <div className="p-4 rounded-full border border-blanket/10 bg-blanket/5">
                <Truck className="h-8 w-8 text-blanket" />
              </div>
              <div>
                <h3 className="text-blanket font-philosopher text-xl mb-1">Free Shipping</h3>
                <p className="text-blanket/60 font-light text-sm tracking-wide">On all domestic orders over ₹999</p>
              </div>
            </div>
            <div className="w-24 h-px bg-blanket/10 hidden md:block"></div>
            <div className="flex items-center gap-6 scroll-reveal">
              <div className="p-4 rounded-full border border-blanket/10 bg-blanket/5">
                <ShoppingBag className="h-8 w-8 text-blanket" />
              </div>
              <div>
                <h3 className="text-blanket font-philosopher text-xl mb-1">Secure Checkout</h3>
                <p className="text-blanket/60 font-light text-sm tracking-wide">100% secure payment processing</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Related Products Section */}
          <div className="py-24">
            <section className="max-w-7xl mx-auto px-4">
              <div className="flex items-end justify-between mb-12">
                <h2 className="text-4xl md:text-5xl font-philosopher text-kimber">
                  You Might Also Like
                </h2>
                <div className="hidden md:block w-32 h-px bg-kimber/20 mb-4"></div>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {products.slice(0, 5).map((p) => (
                  <div key={p._id || p.id} className="flex-shrink-0 w-64 md:w-80 group cursor-pointer">
                    <Link to={`/product/${p._id || p.id}`}>
                      {/* Image Container - Borderless */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-mushroom/10 mb-6">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      </div>

                      {/* Content - Center Aligned */}
                      <div className="text-center space-y-2">
                        <h3 className="text-xs tracking-[0.2em] uppercase text-kimber/60 group-hover:text-kimber transition-colors">
                          {p.category || 'Collection'}
                        </h3>
                        <h4 className="font-philosopher text-xl text-kimber">
                          {p.name}
                        </h4>
                        <p className="text-kimber/80 font-light">
                          {formatIndianPrice(p.retailPrice)}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
