import { Link } from 'react-router-dom';
import { ArrowRight, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/product/ProductGrid';
import { featuredProducts } from '@/data/mockData';

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-gradient-to-br from-sage-50 via-cream-50 to-earth-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge className="bg-luxury-100 text-luxury-800 border-luxury-200">
              <Award className="h-3 w-3 mr-1" />
              Curated Selection
            </Badge>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold luxury-text mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Handpicked favorites that embody our commitment to luxury and sustainability
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-luxury-600" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                <span>Sustainable Materials</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-earth-400 rounded-full"></div>
                <span>Artisan Crafted</span>
              </div>
            </div>
          </div>
        </div>

        <ProductGrid products={featuredProducts} />

        <div className="text-center mt-12">
          <Button asChild className="luxury-button" size="lg">
            <Link to="/category/living">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            Discover our complete collection of luxury sustainable products
          </p>
        </div>
      </div>
    </section>
  );
}