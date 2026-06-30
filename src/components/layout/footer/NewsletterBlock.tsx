import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import axiosinstance from '@/axiosinstance/axiosinstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { newsletterSchema, type NewsletterValues } from '@/lib/validation/schemas';
import { posthog } from '@/lib/posthog';

/**
 * Footer email capture (YL-001). Posts to the existing POST /api/subscribe.
 * Both a fresh subscribe (201) and an already-subscribed (200) response are
 * treated as success in the UI.
 */
export function NewsletterBlock() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: NewsletterValues) => {
    setServerError(null);
    try {
      const res = await axiosinstance.post('/api/subscribe', {
        email: values.email,
        source: 'footer',
      });
      if (res.data?.success) {
        posthog.capture('newsletter_signup', { source: 'footer' });
        setDone(true);
      } else {
        setServerError(res.data?.message || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      // 409 / already-subscribed still means we have their address — treat as success.
      const status = err?.response?.status;
      if (status === 409 || status === 200) {
        setDone(true);
        return;
      }
      setServerError(
        err?.response?.data?.message || 'Could not subscribe right now. Please try again later.'
      );
    }
  };

  return (
    <div className="w-full max-w-md">
      <h3
        className="text-blanket text-sm uppercase tracking-[0.2em] mb-3"
        style={{ fontFamily: "'Afacad', sans-serif" }}
      >
        Join our world
      </h3>
      <p className="text-blanket/60 text-sm mb-4" style={{ fontFamily: "'Afacad', sans-serif" }}>
        Mindful living, new arrivals, and early access — straight to your inbox.
      </p>

      {done ? (
        <p className="text-blanket/90 text-sm" role="status">
          Thank you — you're on the list. ✦
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2" noValidate>
            <div className="flex gap-2 items-start">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-1">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        aria-label="Email address"
                        className="h-11 bg-blanket/10 border-blanket/20 text-blanket placeholder:text-blanket/40 focus:border-blanket/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-11 bg-blanket text-autumnFern-900 hover:bg-blanket/90 font-medium px-4"
              >
                {form.formState.isSubmitting ? '…' : <Send className="h-4 w-4" />}
              </Button>
            </div>
            {serverError && (
              <p className="text-red-300 text-xs font-medium" role="alert">
                {serverError}
              </p>
            )}
          </form>
        </Form>
      )}
    </div>
  );
}
