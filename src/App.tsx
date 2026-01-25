import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoadingFallback } from '@/components/PageLoadingFallback';

// Eagerly loaded pages (critical path)
import { HomePage } from '@/pages/HomePage';
import { LandingPage } from '@/pages/LandingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Lazily loaded pages (non-critical)
const CartPage = lazy(() => import('@/pages/CartPage').then(m => ({ default: m.CartPage })));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSummaryPage = lazy(() => import('@/pages/OrderSummaryPage').then(m => ({ default: m.OrderSummaryPage })));
const ProfilePage = lazy(() => import('./pages/Profile'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CategoryPage = lazy(() => import('./pages/Category').then(m => ({ default: m.CategoryPage })));
const OurStoryPage = lazy(() => import('./pages/StoryPage'));
const PrivacyPage = lazy(() => import('./pages/Privacy'));
const RetailPOS = lazy(() => import('./pages/RetailPOS'));
const AdminProtectedRoute = lazy(() => import('@/components/AdminProtectedRoute'));

function App() {
  // Check authentication status on app load
  useAuthCheck();

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen flex flex-col">
          <ScrollToTop />
          <Header />
          <main className="flex-1 z-10">
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/category/kosha" element={<CategoryPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<OurStoryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/:id" element={<OrderSummaryPage />} />
                <Route path="/pos" element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <AdminProtectedRoute>
                      <RetailPOS />
                    </AdminProtectedRoute>
                  </Suspense>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
