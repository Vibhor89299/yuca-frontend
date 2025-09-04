import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';
import { syncGuestCart } from '@/store/slices/syncGuestCartThunk';
import { clearGuestCart, fetchCart } from '@/store/slices/cartSlice';


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
      // Check for guest cart in localStorage
      const guestCart = localStorage.getItem('yuca_guest_cart');
      if (guestCart) {
        try {
          const parsed = JSON.parse(guestCart);
          if (parsed.items && parsed.items.length > 0) {
            // First sync the guest cart
            dispatch(syncGuestCart(parsed.items)).then(() => {
              // Clear guest cart from localStorage and Redux
              dispatch(clearGuestCart());
              localStorage.removeItem('yuca_guest_cart');
              // Fetch the updated cart to refresh header and other components
              dispatch(fetchCart());
            });
          }
        } catch {}
      }
      navigate('/');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-blanket flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-autumnFern p-3 rounded-full">
              <Leaf className="h-8 w-8 text-blanket" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-oak">YUCA</h1>
              <p className="text-sm text-autumnFern">Where Luxury Grows With You</p>
            </div>
          </div>
        </div>

        <Card className="shadow-lg shadow-oak/20 border-oak/30 bg-white/90">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-oak">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue your luxury journey
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-oak/30 focus:ring-autumnFern"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-oak/30 focus:ring-autumnFern pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-autumnFern hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-autumnFern hover:bg-autumnFern-600 text-blanket font-medium" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full border-oak/30 hover:bg-mushroom text-oak"
                disabled={loading}
              >
                Continue with Google
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-oak/30 hover:bg-mushroom text-oak"
                disabled={loading}
              >
                Continue with Apple
              </Button>
            </div>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-autumnFern hover:underline font-medium">
                  Create one
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}