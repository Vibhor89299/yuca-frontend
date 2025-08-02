import { useToast as useShadcnToast } from "@/components/ui/use-toast";

export const useToast = () => {
  const { toast: shadcnToast } = useShadcnToast();
  
  const toast = (options: {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success';
  }) => {};

  return { toast };
};

export default useToast;
