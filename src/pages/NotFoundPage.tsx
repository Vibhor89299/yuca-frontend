import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-mushroom/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto luxury-card text-center">
          <CardHeader className="pb-6">
            <div className="text-8xl font-bold text-autumnFern mb-4">404</div>
            <CardTitle className="text-3xl font-serif luxury-text mb-2">
              Page Not Found
            </CardTitle>
            <p className="text-lg luxury-text-muted">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Don't worry, even the best explorers sometimes take a wrong turn. 
                Let's get you back on track!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/')}
                  className="luxury-button"
                  size="lg"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
                
                <Button 
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="luxury-button-ghost"
                  size="lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
            
            <div className="pt-6 border-t border-sage-200">
              <p className="text-sm luxury-text-muted mb-4">
                Looking for something specific? Try these popular pages:
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/')}
                  className="luxury-button-ghost"
                >
                  Home
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/cart')}
                  className="luxury-button-ghost"
                >
                  Cart
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/orders')}
                  className="luxury-button-ghost"
                >
                  My Orders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 opacity-10">
          <Search className="h-32 w-32 text-autumnFern" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10">
          <Home className="h-24 w-24 text-sage-600" />
        </div>
      </div>
    </div>
  );
}
