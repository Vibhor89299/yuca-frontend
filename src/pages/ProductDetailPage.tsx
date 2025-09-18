import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Heart, Star, Share2, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToCart, addGuestCartItem } from '@/store/slices/cartSlice';
import { formatIndianPrice } from '@/utils/currency';
import axiosinstance from '@/axiosinstance/axiosinstance';
import { Product } from '@/types';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosinstance.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch product');
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
        throw new Error('Product ID is missing');
      }

      if (isAuthenticated) {
        await dispatch(addToCart({ productId, quantity }));
      } else {
        dispatch(addGuestCartItem({ product, quantity }));
      }
      
      // Show success message (you can add toast notification here)
      console.log('Added to cart successfully');
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const images = product?.images && product.images.length > 0 ? product.images : (product?.image ? [product.image] : []);
  const inStock = product?.inStock ?? (product?.countInStock ? product.countInStock > 0 : true);
  const productBrand = product?.brand || 'YUCA';

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
          <p className="luxury-text-muted">{error || 'The product you are looking for does not exist.'}</p>
          <Button asChild className="luxury-button">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-mushroom/95 backdrop-blur-sm">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 luxury-button-ghost">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <span className="text-muted-foreground">/</span>
        <Link to="/" className="luxury-text-muted hover:luxury-accent">Home</Link>
        <span className="text-muted-foreground">/</span>
        <Link to={`/category/${product.category}`} className="luxury-text-muted hover:luxury-accent">
          {product.category}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="luxury-text">{product.name}</span>
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
              onError={e => {
                const target = e.target as HTMLImageElement;
                if (!target.src.endsWith('/fallback.jpg')) {
                  target.src = '/fallback.jpg';
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
                      ? 'border-autumnFern'
                      : 'border-gray-200 hover:border-gray-300'
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
                {product.category}
              </Badge>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="luxury-button-ghost">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="luxury-button-ghost">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <h1 className="text-3xl font-serif luxury-heading">{product.name}</h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-autumnFern fill-current'
                        : 'text-khakiMoss'
                    }`}
                  />
                ))}
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

            <p className="luxury-text leading-relaxed">{product.description}</p>
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
                onClick={handleAddToCart}
                disabled={!inStock || addingToCart}
                className="flex-1 luxury-button"
                size="lg"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {addingToCart ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
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
            <h3 className="text-lg font-semibold luxury-heading">Product Features</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-autumnFern" />
                <span className="luxury-text">Free shipping on orders over ₹2,000</span>
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
          <div className="p-4 bg-sage-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="luxury-text font-medium">Availability:</span>
              <span className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                {inStock ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-serif luxury-heading mb-8">You Might Also Like</h2>
        {/* You can add related products here */}
        <div className="text-center py-8">
          <p className="luxury-text-muted">Related products will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
