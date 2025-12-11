import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CartItemSkeleton() {
  return (
    <Card className="luxury-card">
      <div className="bg-[#fbfaf8] rounded-lg p-6">
        <div className="flex space-x-4">
          <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Skeleton className="h-8 w-8" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function CartSummarySkeleton() {
  return (
    <Card className="luxury-card">
      <div className="bg-[#fbfaf8] rounded-lg p-6">
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <Skeleton className="h-12 w-full mt-6" />
      </div>
    </Card>
  );
}

export function CartPageSkeleton() {
  return (
    <div className="container mx-auto px-4 pt-[100px] min-h-screen bg-[#f2e0cf] backdrop-blur-sm">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-8 w-36" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <CartItemSkeleton />
          <CartItemSkeleton />
          <CartItemSkeleton />
        </div>
        <div className="space-y-6">
          <CartSummarySkeleton />
          <Card className="luxury-card">
            <CardContent className="bg-[#fbfaf8] rounded-lg p-4">
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
