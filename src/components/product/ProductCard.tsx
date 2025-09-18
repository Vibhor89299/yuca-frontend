import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Utility to convert a string to start case
function toStartCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, addGuestCartItem } from '@/store/slices/cartSlice';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  // const { addToCart: addToCartLegacy } = useStore();
  // const { category, subcategory } = useParams();

  // Handle backwards compatibility between old and new schema
  const productId = product._id || product.id;
  const inStock = product.inStock ?? (product.countInStock ? product.countInStock > 0 : true);
  const productBrand = product.brand || 'YUCA';

  // Build the product URL
  const getProductUrl = () => {
    if (!productId) return '#';
    return `/product/${productId}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = product._id || product.id;
    if (!productId) {
      console.error('Product ID is missing');
      return;
    }
    if (isAuthenticated) {
      // Authenticated: call backend API via Redux thunk
      dispatch(addToCart({ productId, quantity: 1 }));
    } else {
      // Guest: update Redux/localStorage
      dispatch(addGuestCartItem({ product, quantity: 1 }));
    }
  };

  const [imgIdx, setImgIdx] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  // Auto-rotate images every minute
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      console.log('Rotating image ' + images[imgIdx]);
      setImgIdx(idx => (idx + 1) % images.length);
    }, 10000); // 10,000 ms = 10 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Card className="group overflow-hidden shadow-lg hover:shadow-2xl border-oak/30 transition-all duration-500 transform hover:-translate-y-2 bg-mushroom">
      <Link to={getProductUrl()} className="block">
        <div className="relative overflow-hidden">
          <img
            src={images[imgIdx]}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110 bg-gray-100"
            onError={e => {
              const target = e.target as HTMLImageElement;
              if (!target.src.endsWith('/fallback.jpg')) {
                target.src = '/fallback.jpg';
              }
            }}
          />
          {/* Image selector dots/arrows */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {images.map((img, idx) => (
                <button
                  key={img}
                  className={`w-2 h-2 rounded-full border border-oak/50 ${imgIdx === idx ? 'bg-autumnFern' : 'bg-blanket/70'}`}
                  onClick={e => { e.preventDefault(); setImgIdx(idx); }}
                  aria-label={`Show image ${idx + 1}`}
                />
              ))}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-kimber/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {product.featured && (
            <Badge className="absolute top-3 left-3 bg-autumnFern text-blanket shadow-lg">
              Featured
            </Badge>
          )}
          {!inStock && (
            <Badge className="absolute top-3 left-3 bg-red-600 text-white shadow-lg">
              Out of Stock
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-blanket/90 hover:bg-blanket shadow-lg transform translate-y-2 group-hover:translate-y-0"
          >
            <Heart className="h-4 w-4" />
          </Button>
          {/* Quick add to cart overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-autumnFern hover:bg-autumnFern-600 text-blanket shadow-lg"
              size="sm"
              disabled={!inStock}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {inStock ? 'Quick Add' : 'Out of Stock'}
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs border-oak/30 text-oak">
                {product.category}
              </Badge>
              <div className="flex items-center">
                {/* {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-autumnFern fill-current'
                        : 'text-khakiMoss'
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  ({reviewCount})
                </span> */}
              </div>
            </div>

            <h3 className="font-serif font-semibold text-kimber group-hover:text-autumnFern transition-colors text-lg leading-tight">
              {toStartCase(product.name)}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-end justify-between pt-3">
              <div className="space-y-1">
                <span className="text-xl font-bold text-autumnFern">
                  ₹{product.price.toFixed(2)}
                </span>
                <p className="text-xs text-muted-foreground">
                  by {productBrand}
                </p>
              </div>

              <Button
                onClick={handleAddToCart}
                className="bg-autumnFern hover:bg-autumnFern-600 text-blanket shadow-md"
                size="sm"
                disabled={!inStock}
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                {inStock ? 'Add' : 'Sold Out'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}