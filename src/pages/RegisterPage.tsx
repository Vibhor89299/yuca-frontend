import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser } from '@/store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import YucaLogo from '../assets/logo.jpg';

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="min-h-screen bg-blanket flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="relative">
              <div className="rounded-full h-20 w-20 overflow-hidden bg-autumnFern shadow-autumnFern/30 ring-2 ring-autumnFern/20">
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
              Create Your Account
            </CardTitle>
            <CardDescription className="text-autumnFern/70 font-medium">
              Join the luxury experience and start your journey with us
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-oak font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="border-oak/40 focus:ring-autumnFern focus:border-autumnFern/50 bg-white/80"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-oak font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="border-oak/40 focus:ring-autumnFern focus:border-autumnFern/50 bg-white/80"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-oak font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="border-oak/40 focus:ring-autumnFern focus:border-autumnFern/50 bg-white/80"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-oak font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="border-oak/40 focus:ring-autumnFern focus:border-autumnFern/50 bg-white/80"
                />
              </div>

              {passwordError && (
                <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3 font-medium">
                  {passwordError}
                </div>
              )}
              
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3 font-medium">
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-autumnFern hover:from-autumnFern-700 hover:to-oak-600 text-blanket font-semibold shadow-lg shadow-autumnFern/25 transition-all duration-200" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            <div className="text-center pt-4">
              <span className="text-sm text-oak/70">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-autumnFern hover:text-autumnFern-700 font-semibold hover:underline transition-colors duration-200"
                >
                  Sign In
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
