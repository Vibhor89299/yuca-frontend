import { HeroSection } from '@/components/hero/HeroSection';
import { KoshaCollection } from '@/components/featured/FeaturedProducts';
import { DiwaliOfferBanner } from '@/components/offers/DiwaliOfferBanner';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <DiwaliOfferBanner />
      <KoshaCollection />
    </div>
  );
}

