import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser } from '@/store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { registerSchema, type RegisterValues } from '@/lib/validation/schemas';
import YucaLogo from '../assets/logo.jpg';
import bg from '@/assets/bg-bg.jpg';

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = (values: RegisterValues) => {
    dispatch(registerUser({ name: values.name, email: values.email, password: values.password }));
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-kimber font-medium">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Jane Doe"
                              autoComplete="name"
                              className="h-12 bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 transition-all font-light"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-kimber font-medium">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="name@example.com"
                              autoComplete="email"
                              className="h-12 bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 transition-all font-light"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-kimber font-medium">Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Create a password"
                              autoComplete="new-password"
                              className="h-12 bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 transition-all font-light"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-kimber font-medium">Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm your password"
                              autoComplete="new-password"
                              className="h-12 bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 transition-all font-light"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {error && (
                      <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3" role="alert">
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
                </Form>

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
