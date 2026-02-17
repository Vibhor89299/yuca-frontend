import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/slices/authSlice';
import { syncGuestCart } from '@/store/slices/syncGuestCartThunk';
import { clearGuestCart, fetchCart } from '@/store/slices/cartSlice';
import bg from '@/assets/bg.svg';
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
        } catch { }
      }
      navigate('/');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 page-enter" style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="w-full max-w-5xl bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[600px]">
        {/* Left Column: Brand Image (Hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-kimber">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{
              backgroundImage: `url(${YucaLogo})`,
              filter: 'brightness(0.6)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kimber/80 via-transparent to-transparent" />

          <div className="absolute bottom-20 left-12 max-w-lg text-blanket p-8">
            <h2 className="text-4xl font-butler mb-4">The art of mindful living.</h2>
            <p className="text-lg font-light opacity-90 leading-relaxed">
              Join our community of conscious consumers and discover products that elevate your everyday rituals.
            </p>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white/40">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <Link to="/" className="inline-block mb-6">
                <img src={YucaLogo} alt="YUCA" className="h-16 w-16 rounded-full object-cover mx-auto shadow-lg ring-4 ring-white/50" />
              </Link>
              <h1 className="text-3xl font-philosopher text-kimber">Welcome Back</h1>
              <p className="text-kimber/60">Sign in to continue your journey</p>
            </div>

            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-widest text-kimber/60 font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 transition-all font-light"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs uppercase tracking-widest text-kimber/60 font-medium">Password</Label>
                      <Link to="/forgot-password" className="text-xs text-autumnFern hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 transition-all font-light pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 h-full px-3 text-oak/40 hover:text-oak hover:bg-transparent"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-autumnFern hover:bg-autumnFern-600 text-blanket font-medium tracking-wide shadow-lg hover:shadow-autumnFern/20 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-kimber/60">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-autumnFern font-medium hover:underline">
                      Create Account
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link to="/" className="text-xs text-kimber/40 hover:text-autumnFern transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="h-3 w-3" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}