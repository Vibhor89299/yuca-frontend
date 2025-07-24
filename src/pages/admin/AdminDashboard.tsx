import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package, ShoppingCart, Users, BarChart, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data - replace with actual API calls
const mockStats = {
  totalProducts: 124,
  lowStockItems: 8,
  totalOrders: 42,
  pendingOrders: 5,
  revenue: 12500,
  newCustomers: 28,
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats] = useState(mockStats);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();
        // setStats(data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        toast('Failed to load dashboard data', 'An error occurred while loading dashboard data', 'error');
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={<Package className="h-4 w-4" />} 
        />
        <StatsCard 
          title="Low Stock" 
          value={stats.lowStockItems} 
          icon={<AlertCircle className="h-4 w-4 text-amber-500" />} 
          variant={stats.lowStockItems > 0 ? 'warning' : 'default'}
        />
        <StatsCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={<ShoppingCart className="h-4 w-4" />} 
        />
        <StatsCard 
          title="Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          icon={<BarChart className="h-4 w-4" />} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Manage your product catalog, add new items, and update existing products.</p>
            <Button asChild className="w-full">
              <Link to="/admin/products">Manage Products</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {stats.lowStockItems > 0 ? (
                <span className="text-amber-600 font-medium">{stats.lowStockItems} items low in stock</span>
              ) : 'All items are well stocked.'}
            </p>
            <Button asChild variant={stats.lowStockItems > 0 ? 'destructive' : 'default'} className="w-full">
              <Link to="/admin/inventory">
                {stats.lowStockItems > 0 ? 'Check Low Stock' : 'View Inventory'}
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {stats.pendingOrders > 0 
                ? `${stats.pendingOrders} pending orders to process` 
                : 'No pending orders'}
            </p>
            <Button asChild className="w-full">
              <Link to="/admin/orders">
                {stats.pendingOrders > 0 ? 'Process Orders' : 'View Orders'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <ActivityItem 
                title="New order received"
                description="Order #1234 from John Doe"
                time="2 minutes ago"
                icon={<ShoppingCart className="h-4 w-4" />}
              />
              <ActivityItem 
                title="Product out of stock"
                description="Product 'Premium T-Shirt' is now out of stock"
                time="1 hour ago"
                icon={<AlertCircle className="h-4 w-4 text-amber-500" />}
              />
              <ActivityItem 
                title="New customer registered"
                description="Jane Smith created an account"
                time="3 hours ago"
                icon={<Users className="h-4 w-4" />}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, variant = 'default' }: { 
  title: string; 
  value: string | number;
  icon: React.ReactNode;
  variant?: 'default' | 'warning' | 'success';
}) => {
  const variantClasses = {
    default: 'bg-card text-card-foreground',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    success: 'bg-green-50 text-green-800 border-green-200',
  };

  return (
    <Card className={variantClasses[variant]}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

// Activity Item Component
const ActivityItem = ({ title, description, time, icon }: { 
  title: string; 
  description: string;
  time: string;
  icon: React.ReactNode;
}) => (
  <div className="flex items-start space-x-4">
    <div className="mt-1">
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default AdminDashboard;
