import { Link } from 'react-router-dom';
import { ArrowRight, Home, Sparkles, Shirt, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { categories } from '@/data/mockData';

const categoryIcons = {
  'living': Home,
  'wellness': Sparkles,
  'fashion': Shirt,
  'garden': TreePine,
};

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Home;
            return (
            <Card
              key={category.id}
              className="group overflow-hidden luxury-shadow hover:shadow-xl border-sage-200 transition-all duration-300 transform hover:-translate-y-2 bg-white"
            >
              <Link to={`/category/${category.slug}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sage-900/70 via-sage-900/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  
                  {/* Icon overlay */}
                  <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <IconComponent className="h-5 w-5 text-sage-600" />
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-sage-100 p-2 rounded-full">
                      <IconComponent className="h-5 w-5 text-sage-600" />
                    </div>
                    <h3 className="text-xl font-serif font-bold luxury-text group-hover:luxury-accent transition-colors">
                      {category.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-sage-200 text-sage-700 hover:bg-sage-50 group-hover:border-sage-400 transition-colors"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    {category.subcategories && (
                      <span className="text-xs text-muted-foreground">
                        {category.subcategories.length} categories
                      </span>
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}