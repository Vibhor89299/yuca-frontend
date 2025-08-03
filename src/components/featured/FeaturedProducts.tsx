import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { productAPI } from '@/services/apiManager';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/useToast';
import { transformProductsData } from '@/utils/productTransforms';

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const loadFeaturedProducts = async () => {
      try {
        const featuredProducts = await productAPI.getFeaturedProducts();
        if (mounted) {
          setProducts(transformProductsData(featuredProducts));
        }
      } catch (error) {
        if (mounted) {
          toast({
            title: 'Error',
            description: 'Failed to load featured products',
            variant: 'destructive',
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFeaturedProducts();

    return () => {
      mounted = false;
    };
  }, []); // Remove toast from dependencies

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

        <ProductGrid products={products} loading={loading} />

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