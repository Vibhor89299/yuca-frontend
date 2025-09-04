import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser } from '@/store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f3ee] to-[#e6e1d9] luxury-bg animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-autumnFern p-3 rounded-full shadow-lg">
              <Leaf className="h-8 w-8 text-blanket" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-oak tracking-wide">YUCA</h1>
              <p className="text-sm text-autumnFern font-medium">Where Luxury Grows With You</p>
            </div>
          </div>
        </div>
        <Card className="shadow-2xl border-0 luxury-card bg-white/90">
          <CardHeader>
            <CardTitle className="text-3xl font-serif text-center luxury-text mb-2">Create Your Account</CardTitle>
            <p className="text-center text-autumnFern text-sm mb-2">Join the luxury experience</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="luxury-input rounded-xl shadow-sm"
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="luxury-input rounded-xl shadow-sm"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="luxury-input rounded-xl shadow-sm"
              />
              {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}
              <Button type="submit" className="w-full luxury-button text-lg py-3 rounded-xl shadow-md" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>
            <div className="text-center mt-6">
              <span className="luxury-text-muted">Already have an account?</span>{' '}
              <Link to="/login" className="luxury-link font-semibold">Login</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
