import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProfile } from '@/store/slices/authSlice';

export function useAuthCheck() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector(state => state.auth);

  useEffect(() => {
    // If we have a token but aren't authenticated yet, verify the token
    if (token && !isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, isAuthenticated]);

  return { isAuthenticated };
}
