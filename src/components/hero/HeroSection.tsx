import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
       <div className="relative z-10 container mx-auto px-4 py-16 pb-24 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-sage-800 hover:bg-sage-50" size="lg">
              <Link to="/category/living">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="border-white/50 text-white bg-white/10 hover:bg-white/10 hover:text-white hover:backdrop-blur-sm">
              <Link to="/about">
                Our Story
              </Link>
            </Button>
          </div>
       </div>
      
      {/* <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="space-y-6">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Leaf className="h-3 w-3 mr-1" />
              Sustainable Luxury
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white leading-tight">
              Where Luxury{' '}
              <span className="text-sage-300">Grows</span>{' '}
              With You
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
              Discover our curated collection of sustainable luxury products that blend 
              natural beauty with sophisticated design. Every piece tells a story of 
              craftsmanship and conscious living.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-sage-800 hover:bg-sage-50" size="lg">
              <Link to="/category/living">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10 backdrop-blur-sm">
              <Link to="/about">
                Our Story
              </Link>
            </Button>
          </div>

          
          <div className="flex flex-wrap gap-8 justify-center pt-8">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-medium text-white">Eco-Friendly</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-medium text-white">Premium Quality</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-medium text-white">Fast Shipping</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Floating Elements */}
      {/* <div className="absolute top-20 right-20 bg-white/20 p-4 rounded-full backdrop-blur-sm animate-pulse hidden lg:block">
        <Leaf className="h-6 w-6 text-white" />
      </div> */}
      
      {/* <div className="absolute bottom-20 left-20 bg-sage-600/80 text-white p-4 rounded-full backdrop-blur-sm animate-pulse hidden lg:block">
        <Sparkles className="h-6 w-6" />
      </div> */}
    </section>
  );
}