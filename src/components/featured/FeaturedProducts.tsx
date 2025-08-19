import { Link } from 'react-router-dom';
import { ArrowRight, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { featuredProducts } from '@/data/mockData';

export function FeaturedProducts() {
  return (
    <section className="luxury-section luxury-gradient-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="luxury-badge-eco">
              <Award className="h-3 w-3 mr-1 inline" />
              Curated Selection
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl luxury-heading mb-4">
              Featured Products
            </h2>
            <p className="text-lg luxury-text-muted mb-6">
              Handpicked favorites that embody our commitment to luxury and sustainability
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm luxury-text-muted">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-autumnFern" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-khakiMoss rounded-full"></div>
                <span>Sustainable Materials</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-oak rounded-full"></div>
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
          
          <p className="text-sm luxury-text-muted mt-4">
            Discover our complete collection of luxury sustainable products
          </p>
        </div>
      </div>
    </section>
  );
}