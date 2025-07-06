import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden luxury-gradient">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-sage-100 text-sage-800 border-sage-200">
                <Leaf className="h-3 w-3 mr-1" />
                Sustainable Luxury
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-serif font-bold luxury-text leading-tight">
                Where Luxury{' '}
                <span className="luxury-accent">Grows</span>{' '}
                With You
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                Discover our curated collection of sustainable luxury products that blend 
                natural beauty with sophisticated design. Every piece tells a story of 
                craftsmanship and conscious living.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="luxury-button" size="lg">
                <Link to="/category/living">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="border-sage-200 text-sage-800 hover:bg-sage-50">
                <Link to="/sustainability">
                  Our Story
                </Link>
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="bg-sage-100 p-2 rounded-full">
                  <Leaf className="h-4 w-4 text-sage-600" />
                </div>
                <span className="text-sm font-medium luxury-text">Eco-Friendly</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="bg-sage-100 p-2 rounded-full">
                  <Sparkles className="h-4 w-4 text-sage-600" />
                </div>
                <span className="text-sm font-medium luxury-text">Premium Quality</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="bg-sage-100 p-2 rounded-full">
                  <ArrowRight className="h-4 w-4 text-sage-600" />
                </div>
                <span className="text-sm font-medium luxury-text">Fast Shipping</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl luxury-shadow">
              <img
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
                alt="Luxury sustainable living"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-900/20 to-transparent" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white p-4 rounded-full luxury-shadow animate-bounce">
              <Leaf className="h-6 w-6 text-sage-600" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-luxury-600 text-white p-4 rounded-full luxury-shadow">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}