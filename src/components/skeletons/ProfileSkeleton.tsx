import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSidebarSkeleton() {
  return (
    <div className="bg-[#fbfaf8] rounded-lg shadow-sm border border-sage-200 overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-amber-50 to-stone-100 p-6 border-b border-sage-200">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="w-20 h-20 rounded-full mb-3" />
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2 space-y-1">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-sage-200 bg-stone-50">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-14 mx-auto" />
          </div>
          <div>
            <Skeleton className="h-8 w-16 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileOverviewSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Welcome Section */}
      <div className="bg-[#fbfaf8] rounded-lg shadow-sm border border-sage-200 overflow-hidden">
        <div className="relative bg-gradient-to-r from-amber-50 to-stone-100 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-48" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-[#fbfaf8] rounded-lg shadow-sm border border-sage-200 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Contact Information */}
      <div className="bg-[#fbfaf8] rounded-lg shadow-sm border border-sage-200">
        <div className="p-6 border-b border-sage-200">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <Skeleton className="w-10 h-10 rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#fbfaf8] rounded-lg shadow-sm border border-sage-200">
          <div className="p-6 border-b border-sage-200">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-sage-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#fbfaf8] rounded-lg shadow-sm border border-sage-200">
          <div className="p-6 border-b border-sage-200">
            <Skeleton className="h-6 w-28" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#ebd9c9] pt-[80px]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 hidden lg:block">
            <ProfileSidebarSkeleton />
          </div>
          <div className="lg:col-span-3">
            <ProfileOverviewSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
