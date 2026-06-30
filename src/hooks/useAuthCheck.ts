import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProfile } from '@/store/slices/authSlice';
import { fetchCart, setGuestCart } from '@/store/slices/cartSlice';
import { posthog } from '@/lib/posthog';

export function useAuthCheck() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    // If we have a token but aren't authenticated yet, verify the token
    if (token && !isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      posthog.identify(user._id, {
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Fetch cart data when user becomes authenticated
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      // Load guest cart from localStorage for non-authenticated users
      const data = localStorage.getItem('yuca_guest_cart');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          dispatch(setGuestCart(parsed));
        } catch {
          // Invalid cart data in localStorage, ignore
        }
      }
    }
  }, [dispatch, isAuthenticated]);

  return { isAuthenticated };
}
