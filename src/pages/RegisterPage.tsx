import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser } from '@/store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import YucaLogo from '../assets/logo.jpg';
import bg from '@/assets/bg-bg.jpg';

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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 page-enter relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.5
        }}
      />
      <div className="w-full max-w-5xl bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[600px] relative z-10">
        {/* Left Column: Brand Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-kimber">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{
              backgroundImage: `url(${YucaLogo})`,
              filter: 'brightness(0.6) hue-rotate(-10deg)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kimber/80 via-transparent to-transparent" />

          <div className="absolute bottom-20 left-12 max-w-lg text-blanket p-8">
            <h2 className="text-4xl font-butler mb-4">Begin your journey.</h2>
            <p className="text-lg font-light opacity-90 leading-relaxed">
              Create an account to access exclusive collections, track your sustainable lifestyle choices, and more.
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
              <h1 className="text-3xl font-philosopher text-kimber">Join the Collective</h1>
              <p className="text-kimber">Enter your details to create an account</p>
            </div>

            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-widest text-kimber font-medium">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="h-12 bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 transition-all font-light"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-widest text-kimber font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="h-12 bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 transition-all font-light"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs uppercase tracking-widest text-kimber font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="h-12 bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 transition-all font-light"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-widest text-kimber font-medium">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      className="h-12 bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 transition-all font-light"
                    />
                  </div>

                  {passwordError && (
                    <div className="text-red-500 text-xs text-center">
                      {passwordError}
                    </div>
                  )}

                  {error && (
                    <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-autumnFern hover:bg-autumnFern-600 text-blanket font-medium tracking-wide shadow-lg hover:shadow-autumnFern/20 transition-all duration-300 mt-2"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-kimber">
                    Already have an account?{' '}
                    <Link to="/login" className="text-autumnFern font-medium hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link to="/" className="text-xs text-kimber hover:text-autumnFern transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="h-3 w-3" /> Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
