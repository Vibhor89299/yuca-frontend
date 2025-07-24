import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  console.log(isAuthenticated, user, loading , "dsadhgsadjhgsadjahs") ;

  useEffect(() => {
    // Set a small delay to ensure auth state is properly loaded
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking authentication
  if (loading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sage-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login page with the return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not an admin
  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If authenticated (and admin if required), render the children
  return children;
};

export default ProtectedRoute;
