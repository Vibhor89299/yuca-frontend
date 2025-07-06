import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden luxury-shadow border-sage-200">
      <Skeleton className="w-full h-64" />
      <CardContent className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}