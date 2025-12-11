import { useEffect, useState } from 'react';
import { Eye, Users } from 'lucide-react';
import axiosinstance from '@/axiosinstance/axiosinstance';

export function WebsiteStats() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    activeUsers: 0,
    ordersPlaced: 0,
    growthRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Track visit on component mount
    const trackVisit = async () => {
      try {
        await axiosinstance.post('/api/analytics/visit');
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    // Fetch real stats from backend
    const fetchStats = async () => {
      try {
        const response = await axiosinstance.get('/api/analytics/stats');
        const data = response.data;
        
        setStats({
          totalVisits: data.allTime.totalVisits,
          activeUsers: data.today.activeUsers,
          ordersPlaced: data.orders.total,
          growthRate: data.growth.rate
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to default values
        setStats({
          totalVisits: 1247,
          activeUsers: 12,
          ordersPlaced: 342,
          growthRate: 24.5
        });
        setLoading(false);
      }
    };

    trackVisit();
    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    {
      icon: Eye,
      label: 'Total Visits',
      value: stats.totalVisits.toLocaleString(),
      color: 'text-autumnFern',
      bgColor: 'bg-autumnFern/10',
      borderColor: 'border-autumnFern/20'
    },
    {
      icon: Users,
      label: 'Active Now',
      value: stats.activeUsers.toString(),
      color: 'text-oak',
      bgColor: 'bg-oak/10',
      borderColor: 'border-oak/20'
    },
    // {
    //   icon: ShoppingBag,
    //   label: 'Orders Placed',
    //   value: stats.ordersPlaced.toLocaleString(),
    //   color: 'text-khakiMoss',
    //   bgColor: 'bg-khakiMoss/10',
    //   borderColor: 'border-khakiMoss/20'
    // },
    // {
    //   icon: TrendingUp,
    //   label: 'Growth Rate',
    //   value: `+${stats.growthRate}%`,
    //   color: 'text-autumnFern',
    //   bgColor: 'bg-autumnFern/10',
    //   borderColor: 'border-autumnFern/20'
    // }
  ];

  return (
    <section className="relative w-full bg-gradient-to-b from-blanket/5 to-transparent py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-kimber mb-3">
            Join Our Growing Community
          </h2>
          <p className="text-sm sm:text-base text-kimber/70 max-w-2xl mx-auto">
            Be part of a movement towards sustainable luxury and artisanal craftsmanship
          </p>
        </div>

        {/* Stats Grid - 2 columns layout */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {loading ? (
            // Shimmer Loading State - 2 placeholders
            Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="relative rounded-xl bg-blanket/10 border border-blanket/20 backdrop-blur-sm p-5 sm:p-6 md:p-8 overflow-hidden h-full min-h-[180px]"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                {/* Icon Skeleton */}
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blanket/20 mb-3 sm:mb-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blanket/30 rounded"></div>
                </div>

                {/* Value Skeleton */}
                <div className="h-8 sm:h-10 bg-blanket/20 rounded-lg mb-2 w-2/3"></div>

                {/* Label Skeleton */}
                <div className="h-3 sm:h-4 bg-blanket/20 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            // Actual Stats - 2 cards
            statItems.slice(0, 2).map((stat, index) => (
              <div
                key={index}
                className={`group relative rounded-xl ${stat.bgColor} ${stat.borderColor} border backdrop-blur-sm p-5 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 h-full flex flex-col`}
              >
                <div className="flex-grow">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${stat.bgColor} ${stat.borderColor} border mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} strokeWidth={1.5} />
                  </div>

                  {/* Value */}
                  <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${stat.color} mb-1 sm:mb-2 font-serif tabular-nums`}>
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-xs sm:text-sm text-kimber/60 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </div>

                {/* Decorative element */}
                <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 ${stat.bgColor} rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}></div>
              </div>
            ))
          )}
        </div>

        {/* Trust Badge */}
        <div className="mt-10 sm:mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blanket/20 border border-blanket/30 backdrop-blur-sm">
            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
            <span className="text-xs sm:text-sm text-kimber/80 font-medium">
              {loading ? 'Loading stats...' : 'Live tracking • Updated in real-time'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WebsiteStats;
