import { toast } from 'sonner';

// Success toasts
export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 3000,
  });
};

// Error toasts
export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
    duration: 4000,
  });
};

// Info toasts
export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
    duration: 3000,
  });
};

// Warning toasts
export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    duration: 3500,
  });
};

// Loading toast (returns dismiss function)
export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

// Dismiss a specific toast
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

// Promise toast for async operations
export const showPromiseToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  }
) => {
  return toast.promise(promise, messages);
};

// Cart-specific toasts
export const cartToasts = {
  added: (productName?: string) =>
    showSuccessToast(
      'Added to cart',
      productName ? `${productName} has been added to your cart` : undefined
    ),
  removed: (productName?: string) =>
    showSuccessToast(
      'Removed from cart',
      productName ? `${productName} has been removed` : undefined
    ),
  updated: () =>
    showSuccessToast('Cart updated'),
  cleared: () =>
    showSuccessToast('Cart cleared'),
  error: (message: string) =>
    showErrorToast('Cart error', message),
};

// Order-specific toasts
export const orderToasts = {
  placed: (orderId?: string) =>
    showSuccessToast(
      'Order placed successfully!',
      orderId ? `Order ID: ${orderId}` : undefined
    ),
  paymentSuccess: () =>
    showSuccessToast('Payment successful!', 'Your order is being processed'),
  paymentFailed: (reason?: string) =>
    showErrorToast('Payment failed', reason || 'Please try again'),
  error: (message: string) =>
    showErrorToast('Order error', message),
};

// Auth-specific toasts
export const authToasts = {
  loginSuccess: (name?: string) =>
    showSuccessToast(
      'Welcome back!',
      name ? `Logged in as ${name}` : undefined
    ),
  logoutSuccess: () =>
    showSuccessToast('Logged out successfully'),
  registerSuccess: () =>
    showSuccessToast('Account created!', 'Welcome to YUCA Lifestyle'),
  error: (message: string) =>
    showErrorToast('Authentication error', message),
  sessionExpired: () =>
    showWarningToast('Session expired', 'Please log in again'),
};

// Profile-specific toasts
export const profileToasts = {
  updated: () =>
    showSuccessToast('Profile updated', 'Your changes have been saved'),
  error: (message: string) =>
    showErrorToast('Profile error', message),
};
