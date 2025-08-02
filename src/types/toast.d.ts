import { ToasterToast } from '@/components/ui/toast';

declare module '@/hooks/use-toast' {
  export function toast(options: {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success';
  }): {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
}
