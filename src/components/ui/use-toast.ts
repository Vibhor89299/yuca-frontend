import { toast as sonnerToast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

export function useToast() {
  const toast = (
    title: string,
    description?: string,
    type: ToastType = 'default',
    options: {
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    } = {}
  ) => {
    const { duration = 5000, action } = options;
    
    const toastOptions = {
      duration,
      ...(action && {
        action: {
          label: action.label,
          onClick: action.onClick,
        },
      }),
    };

    switch (type) {
      case 'success':
        return sonnerToast.success(title, {
          description,
          ...toastOptions,
        });
      case 'error':
        return sonnerToast.error(title, {
          description,
          ...toastOptions,
        });
      case 'warning':
        return sonnerToast.warning(title, {
          description,
          ...toastOptions,
        });
      case 'info':
        return sonnerToast.info(title, {
          description,
          ...toastOptions,
        });
      default:
        return sonnerToast(title, {
          description,
          ...toastOptions,
        });
    }
  };

  return {
    toast,
    dismiss: sonnerToast.dismiss,
    promise: sonnerToast.promise,
  };
}

export { Toaster } from './sonner';
