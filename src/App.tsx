import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor, useAppDispatch, useAppSelector } from '@/store/store';
import type { RootState } from '@/store/store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { ProductPage } from '@/pages/ProductPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { CartPage } from '@/pages/CartPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { Toaster } from '@/components/ui/sonner';
import { loadUser, logout, clearLoading } from '@/store/slices/authSlice';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoutes from '@/routes/AdminRoutes';

// Component to handle route protection and auth initialization
const AppContent = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: { _persist: any } & RootState) => state.auth.loading);

  // Load user on initial render
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser()).unwrap().catch(() => {
        // Handle error if token is invalid
        dispatch(logout());
      });
    } else {
      // If no token, ensure loading is set to false
      dispatch(clearLoading());
    }
  }, [dispatch]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sage-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<CategoryPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          
          {/* Auth routes */}
          <Route path="/login" element={
            <GuestOnly>
              <LoginPage />
            </GuestOnly>
          } />
          <Route path="/register" element={
            <GuestOnly>
              <RegisterPage />
            </GuestOnly>
          } />
          
          {/* Protected routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          } />
          
          {/* Catch all other routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

// Component to redirect authenticated users away from auth pages
const GuestOnly = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppContent />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;