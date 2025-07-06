import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { featuredProducts } from '@/data/mockData';

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-sage-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold luxury-text mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Handpicked favorites that embody our commitment to luxury and sustainability
            </p>
          </div>
          
          <Button variant="outline" asChild className="hidden sm:flex border-sage-200 text-sage-800 hover:bg-sage-100">
            <Link to="/products">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid products={featuredProducts} />

        <div className="text-center mt-8 sm:hidden">
          <Button variant="outline" asChild className="border-sage-200 text-sage-800 hover:bg-sage-100">
            <Link to="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}