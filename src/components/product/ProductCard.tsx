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
    <Card className="group overflow-hidden shadow-lg hover:shadow-2xl border-oak/30 transition-all duration-500 transform hover:-translate-y-2 bg-mushroom">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-kimber/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {product.featured && (
            <Badge className="absolute top-3 left-3 bg-autumnFern text-blanket shadow-lg">
              Featured
            </Badge>
          )}
          
          {!product.inStock && (
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
              disabled={!product.inStock}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {product.inStock ? 'Quick Add' : 'Out of Stock'}
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
                {[...Array(5)].map((_, i) => (
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
                  ({product.reviewCount})
                </span>
              </div>
            </div>

            <h3 className="font-serif font-semibold text-kimber group-hover:text-autumnFern transition-colors text-lg leading-tight">
              {product.name}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-end justify-between pt-3">
              <div className="space-y-1">
                <span className="text-xl font-bold text-autumnFern">
                  ${product.price.toFixed(2)}
                </span>
                <p className="text-xs text-muted-foreground">
                  by {product.brand}
                </p>
              </div>

              <Button
                onClick={handleAddToCart}
                className="bg-autumnFern hover:bg-autumnFern-600 text-blanket shadow-md"
                size="sm"
                disabled={!product.inStock}
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                {product.inStock ? 'Add' : 'Sold Out'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}