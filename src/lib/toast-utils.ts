type ToastType = 'default' | 'success' | 'error' | 'warning';

export function showToast(
  toast: any,
  title: string,
  description?: string,
  type: ToastType = 'default'
) {
  return toast({
    title,
    description,
    variant: type === 'default' ? undefined : type === 'error' ? 'destructive' : type
  });
}
