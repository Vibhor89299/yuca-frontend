import { HeroSection } from '@/components/hero/HeroSection';
import { KoshaCollection } from '@/components/featured/FeaturedProducts';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <KoshaCollection />
    </div>
  );
}

