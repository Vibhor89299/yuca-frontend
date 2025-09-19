import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';
import { syncGuestCart } from '@/store/slices/syncGuestCartThunk';
import { clearGuestCart, fetchCart } from '@/store/slices/cartSlice';
import YucaLogo from '../assets/logo.jpg';


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
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="relative">
              <div className="rounded-full h-20 w-20 overflow-hidden  bg-autumnFern shadow-autumnFern/30 ring-2 ring-autumnFern/20">
                <img 
                  src={YucaLogo} 
                  alt="Yuca Logo" 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-autumnFern/20 to-oak/20 blur-sm -z-10"></div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-butler font-bold text-oak tracking-wide mb-1">
                YUCA
              </h1>
              <p className="text-sm text-autumnFern/80 font-medium tracking-wide">
                Where Luxury Grows With You
              </p>
            </div>
          </div>
        </div>

        <Card className="shadow-xl shadow-oak/25 border-oak/40 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-butler font-semibold text-oak mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-autumnFern/70 font-medium">
              Sign in to your account to continue your luxury journey
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-oak font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-oak/40 focus:ring-autumnFern focus:border-autumnFern/50 bg-white/80"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-oak font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-oak/40 focus:ring-autumnFern focus:border-autumnFern/50 bg-white/80 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-autumnFern/10 text-oak/60"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {/* <Link 
                  to="/forgot-password" 
                  className="text-sm text-autumnFern hover:underline"
                >
                  Forgot password?
                </Link> */}
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3 font-medium">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-autumnFern text-blanket font-semibold shadow-lg shadow-autumnFern/25 transition-all duration-200" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div> */}

            {/* <div className="space-y-3">
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
            </div> */}

            <div className="text-center pt-4">
              <span className="text-sm text-oak/70">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-autumnFern hover:text-autumnFern-700 font-semibold hover:underline transition-colors duration-200"
                >
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