import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Star,
  Share2,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addToCart, addGuestCartItem } from "@/store/slices/cartSlice";
import { formatIndianPrice } from "@/utils/currency";
import axiosinstance from "@/axiosinstance/axiosinstance";
import { Product } from "@/types";
import { Helmet } from "react-helmet-async";


interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpful: number;
}

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
  const [visibleReviews, setVisibleReviews] = useState(2);

  const relatedProducts: Product[] = [
    {
      _id: "68b488f78dbaffb39227034e",
      name: "tea cup",
      description: "Classic tea cup for a refined tea experience.",
      price: 299,
      countInStock: 10,
      category: "kosha",
      image: "/assets/kosha/TEA CUP/tea-cup/1.png",
      images: [
        "/assets/kosha/TEA CUP/tea-cup/1.png",
        "/assets/kosha/TEA CUP/tea-cup/2.png",
      ],
      rating: 0,
      numReviews: 0,
      user: "68937dc830a98a8ec17eb3d1",
      createdAt: "2025-08-31T17:40:07.665Z",
      updatedAt: "2025-08-31T17:40:07.665Z",
      id: "68b488f78dbaffb39227034e",
    },
    {
      _id: "68b488f78dbaffb39227034f",
      name: "wine",
      description: "Luxury wine glass for celebrations and fine dining.",
      price: 499,
      countInStock: 10,
      category: "kosha",
      image: "/assets/kosha/WINE/wine/1.png",
      images: [
        "/assets/kosha/WINE/wine/1.png",
        "/assets/kosha/WINE/wine/2.png",
      ],
      rating: 0,
      numReviews: 0,
      user: "68937dc830a98a8ec17eb3d1",
      createdAt: "2025-08-31T17:40:07.665Z",
      updatedAt: "2025-08-31T17:40:07.665Z",
      id: "68b488f78dbaffb39227034f",
    },
    {
      _id: "68b488f78dbaffb39227034a",
      name: "glass",
      description: "Premium glassware for a sophisticated dining experience.",
      price: 399,
      countInStock: 8,
      category: "kosha",
      image: "/assets/kosha/GLASS/glass/1.png",
      images: [
        "/assets/kosha/GLASS/glass/1.png",
        "/assets/kosha/GLASS/glass/2.png",
      ],
      rating: 0,
      numReviews: 0,
      user: "68937dc830a98a8ec17eb3d1",
      createdAt: "2025-08-31T17:40:07.665Z",
      updatedAt: "2025-09-04T08:32:39.296Z",
      id: "68b488f78dbaffb39227034a",
    },
    {
      _id: "68b488f78dbaffb39227034d",
      name: "spoon",
      description: "Elegant spoon, perfect for daily use or special occasions.",
      price: 99,
      countInStock: 10,
      category: "kosha",
      image: "/assets/kosha/SPOON FOLK/spoon/1.png",
      images: ["/assets/kosha/SPOON FOLK/spoon/1.png"],
      rating: 0,
      numReviews: 0,
      user: "68937dc830a98a8ec17eb3d1",
      createdAt: "2025-08-31T17:40:07.665Z",
      updatedAt: "2025-08-31T17:40:07.665Z",
      id: "68b488f78dbaffb39227034d",
    },
    {
      _id: "68b488f78dbaffb39227034b",
      name: "katori",
      description:
        "Traditional katori bowls, perfect for serving sides and desserts.",
      price: 199,
      countInStock: 10,
      category: "kosha",
      image: "/assets/kosha/KATORI/katori/1.png",
      images: [
        "/assets/kosha/KATORI/katori/1.png",
        "/assets/kosha/KATORI/katori/2.png",
      ],
      rating: 0,
      numReviews: 0,
      user: "68937dc830a98a8ec17eb3d1",
      createdAt: "2025-08-31T17:40:07.665Z",
      updatedAt: "2025-08-31T17:40:07.665Z",
      id: "68b488f78dbaffb39227034b",
    },
  ];

  const customerReviews: Review[] = [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Absolutely love this geo bowl! The geometric design is stunning and it's perfect for serving salads. The quality is excellent and it feels very sturdy. Highly recommended!",
      verified: true,
      helpful: 12,
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      rating: 4,
      date: "1 month ago",
      comment:
        "Good quality wooden bowl. The design is unique and adds a modern touch to our dining table. Only minor issue is that it requires careful hand washing.",
      verified: true,
      helpful: 8,
    },
    {
      id: 3,
      name: "Anita Patel",
      rating: 5,
      date: "3 weeks ago",
      comment:
        "Beautiful craftsmanship! The bowl arrived well-packaged and exactly as shown in the pictures. Perfect size for family meals. Will definitely buy more from YUCA.",
      verified: false,
      helpful: 15,
    },
    {
      id: 4,
      name: "Vikram Singh",
      rating: 4,
      date: "1 week ago",
      comment:
        "Nice bowl with elegant design. The wooden utensils that come with it are a nice touch. Good value for money. Delivery was quick too.",
      verified: true,
      helpful: 6,
    },
  ];

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

  // const LuxuryDivider = ({ className = "" }: { className?: string }) => (
  //   <svg
  //     className={className}
  //     viewBox="0 0 200 4"
  //     fill="none"
  //     xmlns="http://www.w3.org/2000/svg"
  //   >
  //     <line
  //       x1="0"
  //       y1="2"
  //       x2="80"
  //       y2="2"
  //       stroke="currentColor"
  //       strokeWidth="1"
  //       opacity="0.3"
  //     />
  //     <circle cx="100" cy="2" r="2" fill="currentColor" opacity="0.6" />
  //     <line
  //       x1="120"
  //       y1="2"
  //       x2="200"
  //       y2="2"
  //       stroke="currentColor"
  //       strokeWidth="1"
  //       opacity="0.3"
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

  // const handleAddToCart = async () => {
  //   if (!product) return;

  //   setAddingToCart(true);
  //   try {
  //     const productId = product._id || product.id;
  //     if (!productId) {
  //       throw new Error('Product ID is missing');
  //     }

  //     if (isAuthenticated) {
  //       await dispatch(addToCart({ productId, quantity }));
  //     } else {
  //       dispatch(addGuestCartItem({ product, quantity }));
  //     }

  //     // Show success message (you can add toast notification here)
  //     console.log('Added to cart successfully');
  //   } catch (err) {
  //     console.error('Failed to add to cart:', err);
  //   } finally {
  //     setAddingToCart(false);
  //   }
  // };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      const productId = product._id || product.id;
      if (!productId) {
        throw new Error("Product ID is missing");
      }

      if (isAuthenticated) {
        // 🔹 API Call
        const response = await axiosinstance.post(
          "/api/cart",
          {
            productId,
            quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // make sure token is stored in localStorage
            },
          }
        );

        console.log("Cart updated:", response.data);

        // 🔹 Also update Redux store (optional but recommended for UI sync)
        dispatch(addToCart({ productId, quantity }));
      } else {
        // Guest cart (local Redux store only)
        dispatch(addGuestCartItem({ product, quantity }));
      }

      // ✅ Success feedback
      console.log("Added to cart successfully");
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setAddingToCart(false);
    }
    setIsInCart(true);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  const handleLoadMore = () => {
    if (visibleReviews < customerReviews.length) {
      setVisibleReviews((prev) => Math.min(prev + 2, customerReviews.length));
    } else {
      setVisibleReviews(2);
    }
  };

  const isShowingAll = visibleReviews >= customerReviews.length;

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : product?.image
      ? [product.image]
      : [];
  const inStock =
    product?.inStock ??
    (product?.countInStock ? product.countInStock > 0 : true);
  const productBrand = product?.brand || "YUCA";
  const pdescription = product?.description || "Product description";
  const pname = product?.name || "Product";
  const pimage = images?.[0] || "/fallback.jpg";
  const purl = `${import.meta.env.VITE_UI_URL}/product/${id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pname}`,
          text: `${pdescription}`,
          url: `${import.meta.env.VITE_UI_URL}/product/${id}`,
        });
      } catch (err) {
        console.error(" Error sharing:", err);
      }
    } else {
      alert(
        "Sharing not supported on this browser. Please copy the link manually."
      );
    }
  };
  // rgb(184 159 134)
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-mushroom/95 backdrop-blur-sm">
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
      <div className="container mx-auto px-4 py-8 min-h-screen bg-mushroom/95 backdrop-blur-sm">
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
            className={`${size} ${
              star <= rating
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
  return (
    <>
      <Helmet>
        <title>{`${pname} | YUCA`}</title>
        <meta name="description" content={pdescription} />

        <meta property="og:title" content={pname} />
        <meta property="og:description" content={pdescription} />
        <meta property="og:image" content={pimage} />
        <meta property="og:url" content={purl} />
        <meta property="og:type" content="product" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pname} />
        <meta name="twitter:description" content={pdescription} />
        <meta name="twitter:image" content={pimage} />
      </Helmet>
      <div className="container mx-auto px-4 mt-4 py-8 min-h-screen bg-white rounded backdrop-blur-sm">
        {/* Breadcrumb */}

        <div className="flex items-center space-x-2 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="px-2 py-0 luxury-button-ghost"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <span className="text-muted-foreground">/</span>
          <Link to="/" className="luxury-text-muted hover:luxury-accent">
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            // to={`/category/${product.category}`}
            to={"#"}
            className="luxury-text-muted hover:luxury-accent"
          >
            {capitalizeFirst(product.category)}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="luxury-text">{capitalizeFirst(product.name)}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith("/fallback.jpg")) {
                    target.src = "/fallback.jpg";
                  }
                }}
              />
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-autumnFern text-blanket shadow-lg">
                  Featured
                </Badge>
              )}
              {!inStock && (
                <Badge className="absolute top-4 left-4 bg-red-600 text-white shadow-lg">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-autumnFern"
                        : "border-gray-200 hover:border-gray-300"
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

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-oak/30 text-oak">
                  {capitalizeFirst(product.category)}
                </Badge>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleShare}
                    variant="ghost"
                    size="sm"
                    className="luxury-button-ghost"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="luxury-button-ghost"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h1 className="text-3xl font-serif luxury-heading">
                {capitalizeFirst(product.name)}
              </h1>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {/* {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0)
                          ? "text-autumnFern fill-current"
                          : "text-khakiMoss"
                      }`}
                    />
                  ))} */}
                  {renderStars(product.rating || 0)}
                  <span className="text-sm luxury-text-muted ml-2">
                    ({product.numReviews || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-3xl font-bold luxury-accent">
                  {formatIndianPrice(product.price)}
                </p>
                <p className="text-sm luxury-text-muted">by {productBrand}</p>
              </div>

              <p className="luxury-text leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator className="luxury-divider" />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="luxury-text font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-8 w-8 p-0 luxury-button-secondary"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-12 text-center font-medium luxury-text">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!inStock}
                    className="h-8 w-8 p-0 luxury-button-secondary"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => {
                    if (isInCart) {
                      navigate("/cart");
                    } else {
                      handleAddToCart();
                    }
                  }}
                  disabled={!inStock || addingToCart}
                  className="flex-1 luxury-button"
                  size="lg"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {isInCart
                    ? "Go to Cart"
                    : addingToCart
                    ? "Adding..."
                    : inStock
                    ? "Add to Cart"
                    : "Out of Stock"}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={!inStock || addingToCart}
                  variant="outline"
                  className="flex-1 luxury-button-secondary"
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            <Separator className="luxury-divider" />

            {/* Product Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold luxury-heading">
                Product Features
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-autumnFern" />
                  <span className="luxury-text">
                    Free shipping on orders over ₹2,000
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-autumnFern" />
                  <span className="luxury-text">1-year warranty included</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-autumnFern" />
                  <span className="luxury-text">30-day return policy</span>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="py-4 px-0 bg-sage-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="luxury-text font-medium">Availability:</span>
                <span
                  className={`font-medium ${
                    inStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {inStock
                    ? `In Stock (${product.countInStock} available)`
                    : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="flex mt-8 justify-center" >
        {[...Array(5)].map((_, i) => (
          <LuxuryOrnament key={i} className="h-4 text-amber-600" />
        ))}
        </div> */}
        {/* Related Products Section */}
        <div className="mt-16">
          <section className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-medium text-amber-700 mb-8">
              You Might Also Like
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer flex-shrink-0 w-64"
                >
                  <div className="relative bg-stone-50 rounded-lg p-4 mb-4 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">
                      {capitalizeFirst(product.category)}
                    </p>
                    <h3 className="text-lg font-medium text-gray-800 group-hover:text-amber-700 transition-colors">
                      {capitalizeFirst(product.name)}
                    </h3>

                    <div className="flex items-center gap-2">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-500">
                        ({product.numReviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-800">
                        ₹{product.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Customer Reviews Section */}
        <section className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-medium text-amber-700">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(4.2, "w-5 h-5")}
                <span className="text-lg font-medium text-gray-800">4.2</span>
                <span className="text-gray-500">
                  ({customerReviews.length} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="mb-8 p-6 bg-stone-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-4">
                  Rating Breakdown
                </h3>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-600 w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-400 h-2 rounded-full"
                        style={{
                          width: `${
                            rating === 5
                              ? 60
                              : rating === 4
                              ? 30
                              : rating === 3
                              ? 8
                              : rating === 2
                              ? 2
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8">
                      {rating === 5
                        ? "60%"
                        : rating === 4
                        ? "30%"
                        : rating === 3
                        ? "8%"
                        : rating === 2
                        ? "2%"
                        : "0%"}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-4">
                  Review Highlights
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Quality
                    </span>
                    <span className="text-sm text-gray-600">
                      Mentioned 15 times
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Design
                    </span>
                    <span className="text-sm text-gray-600">
                      Mentioned 12 times
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      Value
                    </span>
                    <span className="text-sm text-gray-600">
                      Mentioned 8 times
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {customerReviews.slice(0, visibleReviews).map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 pb-6 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-700 font-medium text-sm">
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-800">
                          {review.name}
                        </h4>
                        {review.verified && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="p-2 hover:bg-gray-50 rounded-full">
                    <Share2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {review.comment}
                </p>

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                  <button className="text-sm text-gray-600 hover:text-amber-700 transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 border border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
            >
              {isShowingAll ? "Show Less" : "Load More Reviews"}
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
