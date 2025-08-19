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
    <section className="luxury-section bg-blanket">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl luxury-heading mb-4">
            Explore Our Collections
          </h2>
          <p className="text-lg luxury-text-muted max-w-2xl mx-auto">
            Discover thoughtfully curated collections that bring luxury and sustainability together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Home;
            return (
            <Card
              key={category.id}
              className="group overflow-hidden luxury-card-elevated hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <Link to={`/category/${category.slug}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-kimber/70 via-kimber/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  
                  {/* Icon overlay */}
                  <div className="absolute top-4 right-4 bg-blanket/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <IconComponent className="h-5 w-5 text-autumnFern" />
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-autumnFern/10 p-2 rounded-full">
                      <IconComponent className="h-5 w-5 text-autumnFern" />
                    </div>
                    <h3 className="text-xl luxury-heading group-hover:luxury-accent transition-colors">
                      {category.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm luxury-text-muted mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="luxury-button-secondary group-hover:bg-autumnFern/10 transition-colors"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    {category.subcategories && (
                      <span className="text-xs luxury-text-muted">
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