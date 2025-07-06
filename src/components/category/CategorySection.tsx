import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { categories } from '@/data/mockData';

export function CategorySection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold luxury-text mb-4">
            Explore Our Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover thoughtfully curated collections that bring luxury and sustainability together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              className={`group overflow-hidden luxury-shadow hover:shadow-xl border-sage-200 transition-all duration-300 transform hover:-translate-y-1 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <Link to={`/category/${category.slug}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      index === 0 ? 'h-80 lg:h-96' : 'h-64'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sage-900/60 via-sage-900/20 to-transparent" />
                  
                  <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className={`font-serif font-bold mb-2 ${
                      index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                    }`}>
                      {category.name}
                    </h3>
                    <p className={`mb-4 opacity-90 ${
                      index === 0 ? 'text-base' : 'text-sm'
                    }`}>
                      {category.description}
                    </p>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/20 p-0 h-auto font-semibold"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}