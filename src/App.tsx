import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { CartPage } from '@/pages/CartPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { OrderSummaryPage } from '@/pages/OrderSummaryPage';
// import OrderHistoryPage  from '@/pages/OrderHistoryPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { Toaster } from '@/components/ui/sonner';
import RegisterPage from './pages/RegisterPage';
// import ProtectedRoute from '@/components/ProtectedRoute';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import RetailPOS from './pages/RetailPOS';

import { useAuthCheck } from '@/hooks/useAuthCheck';
import ProfilePage from './pages/Profile';
import OurStoryPage from './pages/StoryPage';
import { CategoryPage } from './pages/Category';
import PrivacyPage from './pages/Privacy';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

function App() {
  // Check authentication status on app load
  useAuthCheck();

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Header />
        <main className="flex-1 z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/category/kosha" element={<CategoryPage />} />
            {/* <Route path="/category/:category/:subcategory" element={<CategoryPage />} /> */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<OurStoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/:id" element={<OrderSummaryPage />} />
            {/* <Route path="/orders" element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            } /> */}
            <Route path="/pos" element={
              <AdminProtectedRoute>
                <RetailPOS />
              </AdminProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;