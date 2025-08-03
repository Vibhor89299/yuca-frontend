import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart, 
  AlertCircle,
  TrendingUp,
  DollarSign 
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { productAPI, orderAPI, adminAPI } from '@/services/apiManager';
import { Product } from '@/types/product';
import { Order } from '@/types/order';
import { transformProductsData } from '@/utils/productTransforms';

interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  newCustomers: number;
  avgOrderValue: number;
}

interface TopProduct extends Product {
  revenue: number;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockItems: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    newCustomers: 0,
    avgOrderValue: 0
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      if (!isMounted) return;

      try {
        // Get products data from admin API
        const productsResponse = await adminAPI.products.getAll({
          page: 1,
          limit: 5,
          sortBy: 'createdAt'
        });
        if (!isMounted) return;
        setRecentProducts(productsResponse.products);

        // Get low stock items
        const lowStockItems = productsResponse.products.filter(p => p.countInStock < 10).length;

        // Get orders data
        const { orders } = await adminAPI.orders.getAll();
        if (!isMounted) return;
        const pendingOrders = orders.filter((order: Order) => order.status === 'pending').length;
        const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0);
        const newCustomers = new Set(orders.map((order: Order) => order.user)).size;

        setStats({
          totalProducts: productsResponse.totalProducts,
          lowStockItems,
          totalOrders: orders.length,
          pendingOrders,
          revenue: totalRevenue,
          newCustomers,
          avgOrderValue: totalRevenue / (orders.length || 1)
        });

      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []); // Remove toast from dependencies as it's not needed

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <Button asChild>
          <Link to="/admin/products/new">Add New Product</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            {stats.lowStockItems > 0 && (
              <p className="text-sm text-red-500 mt-1">
                {stats.lowStockItems} items low in stock
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            {stats.pendingOrders > 0 && (
              <p className="text-sm text-amber-500 mt-1">
                {stats.pendingOrders} orders pending
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.revenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              ${stats.avgOrderValue.toFixed(2)} avg. order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newCustomers}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Active customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Products</CardTitle>
          <Button variant="ghost" asChild>
            <Link to="/admin/products">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${product.price.toFixed(2)} · {product.category}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(product.createdAt!).toLocaleDateString()}
                </div>
                <div className={`text-sm ${
                  product.countInStock < 10 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {product.countInStock} in stock
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 grid-cols-2">
            <Button asChild variant="outline" className="h-24">
              <Link to="/admin/products/new">
                <Package className="h-6 w-6 mb-2" />
                Add Product
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24">
              <Link to="/admin/orders">
                <ShoppingCart className="h-6 w-6 mb-2" />
                View Orders
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24">
              <Link to="/admin/analytics">
                <BarChart className="h-6 w-6 mb-2" />
                Analytics
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24">
              <Link to="/admin/products?stock=low">
                <AlertCircle className="h-6 w-6 mb-2" />
                Low Stock
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

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
