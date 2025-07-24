import { Middleware, isAnyOf } from '@reduxjs/toolkit';
import { login, loadUser } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store/store';

type AppMiddleware = Middleware<{}, RootState, AppDispatch>;

export const authMiddleware: AppMiddleware = (store) => (next) => (action: any) => {
  const typedAction = action as { type: string; payload?: any };
  // Check if the action is login.fulfilled
  if (login.fulfilled.match(action)) {
    // Save token to localStorage
    localStorage.setItem('token', action.payload.token);
    localStorage.setItem('user', JSON.stringify(action.payload.user));
    
    // Migrate guest cart to user cart if needed
    const { guestItems } = store.getState().cart;
    if (guestItems.length > 0) {
      store.dispatch({ type: 'cart/migrateGuestCart' });
    }
  }
  
  // Check if the action is logout.fulfilled
  if (typedAction.type === 'auth/logout/fulfilled') {
    // Clear localStorage on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  // Check if the action is a page load and we have a token but no user data
  if (typedAction.type === 'persist/REHYDRATE' || typedAction.type === 'persist/PERSIST') {
    const { token } = store.getState().auth;
    const { user } = store.getState().auth;
    
    if (token && !user) {
      // Try to load user data if we have a token but no user data
      (store.dispatch as AppDispatch)(loadUser());
    }
  }
  
  // Let the action pass through
  return next(action);
};
