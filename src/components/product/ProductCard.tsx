import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useStore } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Card className="group overflow-hidden luxury-shadow hover:shadow-xl border-sage-200 transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.featured && (
            <Badge className="absolute top-3 left-3 bg-luxury-600 text-white">
              Featured
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-luxury-600 fill-current'
                        : 'text-sage-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            <h3 className="font-serif font-semibold luxury-text group-hover:luxury-accent transition-colors">
              {product.name}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <span className="text-lg font-bold luxury-text">
                  ${product.price.toFixed(2)}
                </span>
                <p className="text-xs text-muted-foreground">
                  {product.brand}
                </p>
              </div>

              <Button
                onClick={handleAddToCart}
                className="luxury-button"
                size="sm"
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}