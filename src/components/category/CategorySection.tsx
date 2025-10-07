import { Link } from 'react-router-dom';
import { ArrowRight, Home, Sparkles, Shirt, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategories } from '@/store/slices/categoriesSlice';

const categoryIcons = {
  'living': Home,
  'wellness': Sparkles,
  'fashion': Shirt,
  'garden': TreePine,
};

export function CategorySection() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => ({
    categories: state.categories.categories,
    loading: state.categories.loading,
  }));

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
          {loading && (
            <p className="luxury-text-muted">Loading categories...</p>
          )}
          {!loading && categories.map((category) => {
            const slug = String(category).toLowerCase();
            const name = String(category).charAt(0).toUpperCase() + String(category).slice(1);
            const IconComponent = categoryIcons[slug as keyof typeof categoryIcons] || Home;
            return (
            <Card
              key={slug}
              className="group overflow-hidden luxury-card-elevated hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <Link to={`/category/${slug}`}>
                <div className="relative overflow-hidden">
                  <img
                    src="https://i.pinimg.com/736x/1e/75/55/1e7555a65f6e0b34358ad110ae31f562.jpg"
                    alt={name}
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
                      {name}
                    </h3>
                  </div>
                  
                  {/* Description unavailable from API categories; remove mock description */}
                  <p className="text-sm luxury-text-muted mb-4 line-clamp-2">
                    Explore premium products in {name}
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
                    
                    {/* Subcategories not available from API-derived categories */}
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