import { HeroSection } from '@/components/hero/HeroSection';
import { KoshaCollection } from '@/components/featured/FeaturedProducts';
import { DiwaliOfferBanner } from '@/components/offers/DiwaliOfferBanner';
import { WebsiteStats } from '@/components/stats/WebsiteStats';
import { SEO } from '@/components/seo/SEO';

export function HomePage() {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "YUCA Lifestyle - Luxury Handcrafted Home Decor",
    "description": "Discover exclusive handcrafted artisanal home decor and sustainable luxury products",
    "url": "https://yucalifestyle.com"
  };

  return (
    <>
      <SEO
        title="YUCA Lifestyle - Luxury Handcrafted Home Decor & Artisanal Products"
        description="Discover YUCA Lifestyle's exclusive collection of handcrafted artisanal home decor, sustainable luxury products, and eco-friendly lifestyle essentials. Shop premium coconut wood cutlery, enamel bowls, tea sets, and more."
        keywords="luxury home decor, handcrafted products, artisanal lifestyle, sustainable luxury, eco-friendly home goods, coconut wood cutlery, premium tea sets, handmade bowls, artisan craftsmanship, YUCA lifestyle"
        url="https://yucalifestyle.com"
        schema={homeSchema}
      />
      <div className="min-h-screen">
        <HeroSection />
        <DiwaliOfferBanner />
        <KoshaCollection />
        <WebsiteStats />
      </div>
    </>
  );
}

