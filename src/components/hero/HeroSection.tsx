import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import video from "../../assets/banner.mp4"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-end justify-center">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={video} type="video/mp4" />
          {/* Fallback image if video fails to load */}
          <img
            src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
            alt="Luxury sustainable living"
            className="w-full h-full object-cover"
          />
        </video>
        {/* Enhanced overlay with brand-inspired gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-kimber/60 via-kimber/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 pb-24 text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="luxury-button" size="lg">
            <Link to="/category/living">
              Explore Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="border-blanket/50 text-blanket bg-blanket/10 hover:bg-blanket/20 hover:text-kimber hover:backdrop-blur-sm transition-all duration-300">
            <Link to="/about">
              Our Story
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
