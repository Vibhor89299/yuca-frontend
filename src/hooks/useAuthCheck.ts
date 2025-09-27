import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProfile } from '@/store/slices/authSlice';
import { fetchCart, setGuestCart } from '@/store/slices/cartSlice';

export function useAuthCheck() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector(state => state.auth);

  useEffect(() => {
    // If we have a token but aren't authenticated yet, verify the token
    if (token && !isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, isAuthenticated]);

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
        } catch (error) {
          console.error('Error parsing guest cart from localStorage:', error);
        }
      }
    }
  }, [dispatch, isAuthenticated]);

  return { isAuthenticated };
}
