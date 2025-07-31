import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sparkles, Play, Star, Award, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const heroSlides = [
    {
      title: "Where Luxury",
      accent: "Grows",
      subtitle: "With You",
      description: "Discover our curated collection of sustainable luxury products that blend natural beauty with sophisticated design.",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      cta: "Explore Collection",
      link: "/category/living"
    },
    {
      title: "Crafted for",
      accent: "Excellence",
      subtitle: "Since 1920",
      description: "Every piece tells a story of masterful craftsmanship, sustainable practices, and timeless elegance.",
      image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
      cta: "View Heritage",
      link: "/heritage"
    },
    {
      title: "Sustainable",
      accent: "Luxury",
      subtitle: "Redefined",
      description: "Experience the future of luxury with our eco-conscious designs that don't compromise on elegance.",
      image: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg",
      cta: "Learn More",
      link: "/sustainability"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sage-50 via-white to-sage-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-sage-200/20 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            left: '10%',
            top: '20%'
          }}
        />
        <div 
          className="absolute w-72 h-72 bg-luxury-200/20 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            right: '15%',
            bottom: '25%'
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Premium Badge */}
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-sage-100 to-sage-200 text-sage-800 border-sage-300 px-4 py-2">
                <Award className="h-3 w-3 mr-2" />
                Award-Winning Design
              </Badge>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">4.9/5 (2,847 reviews)</span>
              </div>
            </div>
            
            {/* Main Heading with Animation */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-serif font-bold luxury-text leading-tight">
                <span className="block animate-slide-up">{currentSlideData.title}</span>
                <span className="block luxury-accent animate-slide-up animation-delay-200">
                  {currentSlideData.accent}
                </span>
                <span className="block text-3xl lg:text-4xl animate-slide-up animation-delay-400">
                  {currentSlideData.subtitle}
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in animation-delay-600">
                {currentSlideData.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-800">
              <Button asChild className="luxury-button group" size="lg">
                <Link to={currentSlideData.link}>
                  {currentSlideData.cta}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-sage-200 text-sage-800 hover:bg-sage-50 group"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Watch Story
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in animation-delay-1000">
              <div className="text-center">
                <div className="bg-sage-100 p-3 rounded-full w-fit mx-auto mb-2">
                  <Shield className="h-6 w-6 text-sage-600" />
                </div>
                <span className="text-sm font-medium luxury-text">Lifetime Warranty</span>
              </div>
              
              <div className="text-center">
                <div className="bg-sage-100 p-3 rounded-full w-fit mx-auto mb-2">
                  <Leaf className="h-6 w-6 text-sage-600" />
                </div>
                <span className="text-sm font-medium luxury-text">100% Sustainable</span>
              </div>
              
              <div className="text-center">
                <div className="bg-sage-100 p-3 rounded-full w-fit mx-auto mb-2">
                  <Sparkles className="h-6 w-6 text-sage-600" />
                </div>
                <span className="text-sm font-medium luxury-text">Handcrafted</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Image */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-3xl luxury-shadow-xl transform transition-transform duration-700 group-hover:scale-[1.02]">
              <img
                src={currentSlideData.image}
                alt="Luxury sustainable living"
                className="w-full h-[600px] lg:h-[700px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-8 left-8 right-8">
                <Card className="bg-white/90 backdrop-blur-sm p-6 border-0 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-lg luxury-text">Featured Collection</h3>
                      <p className="text-sm text-muted-foreground">Discover our latest arrivals</p>
                    </div>
                    <Button size="sm" className="luxury-button">
                      View All
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
            
            {/* Floating Interactive Elements */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-full luxury-shadow-xl animate-float">
              <Sparkles className="h-8 w-8 text-luxury-600" />
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-sage-600 to-sage-700 text-white p-4 rounded-full luxury-shadow-xl animate-float animation-delay-500">
              <Leaf className="h-8 w-8" />
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-sage-200">
          <div className="text-center animate-fade-in">
            <div className="text-3xl font-bold luxury-text">50K+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center animate-fade-in animation-delay-200">
            <div className="text-3xl font-bold luxury-text">25+</div>
            <div className="text-sm text-muted-foreground">Countries Served</div>
          </div>
          <div className="text-center animate-fade-in animation-delay-400">
            <div className="text-3xl font-bold luxury-text">100%</div>
            <div className="text-sm text-muted-foreground">Sustainable</div>
          </div>
          <div className="text-center animate-fade-in animation-delay-600">
            <div className="text-3xl font-bold luxury-text">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-12 right-0 text-white hover:text-sage-200 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-black rounded-lg overflow-hidden">
              <video
                className="w-full h-auto"
                controls
                autoPlay
                poster={currentSlideData.image}
              >
                <source src="/videos/brand-story.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}