import { HeroSection } from '@/components/hero/HeroSection';
// import { CategorySection } from '@/components/category/CategorySection';
import { KoshaCollection } from '@/components/featured/FeaturedProducts';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
  {/* <CategorySection /> */}
      <KoshaCollection />
    </div>
  );
}