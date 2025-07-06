import React from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import { CategorySection } from '@/components/category/CategorySection';
import { FeaturedProducts } from '@/components/featured/FeaturedProducts';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
    </div>
  );
}