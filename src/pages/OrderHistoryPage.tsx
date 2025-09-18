import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, Search, Filter, Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchMyOrders } from '@/store/slices/orderSlice';
import { formatIndianPrice } from '@/utils/currency';
import { Order } from '@/types';

export function OrderHistoryPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector(state => state.order);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Only fetch if we don't already have orders or if there was an error
      if (orders.length === 0 && !loading) {
        dispatch(fetchMyOrders());
      }
    } else {
      navigate('/login', { state: { from: '/orders' } });
    }
  }, [dispatch, isAuthenticated, navigate, orders.length, loading]);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item =>
          item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order =>
        order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleRefresh = () => {
    dispatch(fetchMyOrders());
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-mushroom/95 backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-mushroom/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 luxury-button-ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-serif luxury-heading">Order History</h1>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="luxury-button-secondary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="luxury-card mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders by ID or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {error && (
        <Card className="luxury-card mb-8">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error loading orders: {error}</p>
              <Button onClick={handleRefresh} className="mt-4 luxury-button">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredOrders.length === 0 && !loading ? (
        <Card className="luxury-card">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold luxury-heading mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="luxury-text-muted mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start shopping to see your orders here.'
              }
            </p>
            <Button asChild className="luxury-button">
              <Link to="/">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="luxury-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="text-lg font-semibold luxury-text">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm luxury-text-muted">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} px-3 py-1`}>
                        {order.status}
                      </Badge>
                    </div>

                    {/* Order Items Preview */}
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium luxury-text truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs luxury-text-muted">
                              Qty: {item.quantity} × {formatIndianPrice(item.product.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm luxury-text-muted">
                          +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Summary and Actions */}
                  <div className="lg:text-right space-y-4">
                    <div>
                      <p className="text-lg font-semibold luxury-accent">
                        {formatIndianPrice(order.total)}
                      </p>
                      <p className="text-sm luxury-text-muted">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button asChild variant="outline" className="luxury-button-secondary">
                        <Link to={`/order/${order.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      
                      {order.status === 'delivered' && (
                        <Button variant="outline" className="luxury-button-secondary">
                          Reorder
                        </Button>
                      )}
                      
                      {order.status === 'processing' && (
                        <Button variant="outline" className="luxury-button-secondary">
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Loading indicator for refresh */}
      {loading && orders.length > 0 && (
        <div className="text-center py-4">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
          <p className="text-sm luxury-text-muted mt-2">Updating orders...</p>
        </div>
      )}

      {/* Order Statistics */}
      {orders.length > 0 && (
        <Card className="luxury-card mt-8">
          <CardHeader>
            <CardTitle className="font-serif luxury-text">Order Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold luxury-accent">{orders.length}</p>
                <p className="text-sm luxury-text-muted">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold luxury-accent">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
                <p className="text-sm luxury-text-muted">Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold luxury-accent">
                  {orders.filter(o => o.status === 'processing' || o.status === 'shipped').length}
                </p>
                <p className="text-sm luxury-text-muted">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold luxury-accent">
                  {formatIndianPrice(orders.reduce((sum, order) => sum + order.total, 0))}
                </p>
                <p className="text-sm luxury-text-muted">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
