import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchOrderById } from '@/store/slices/orderSlice';
import { formatIndianPrice } from '@/utils/currency';

export function OrderSummaryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentOrder, loading, error } = useAppSelector(state => state.order);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [id, dispatch]);

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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && currentOrder) {
      try {
        await navigator.share({
          title: `Order #${currentOrder.id}`,
          text: `Check out my order from Yuca Lifestyle`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Order link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-mushroom/95 backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-mushroom/95 backdrop-blur-sm">
        <div className="text-center space-y-6">
          <h1 className="text-2xl luxury-heading">Order Not Found</h1>
          <p className="luxury-text-muted">{error || 'The order you are looking for does not exist.'}</p>
          <Button asChild className="luxury-button">
            <Link to="/">Continue Shopping</Link>
          </Button>
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
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePrint} className="luxury-button-secondary">
            <Download className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleShare} className="luxury-button-secondary">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Order Status Banner */}
      <Card className="luxury-card mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon(currentOrder.status)}
              <div>
                <h1 className="text-2xl font-serif luxury-heading">
                  Order #{currentOrder.id}
                </h1>
                <p className="luxury-text-muted">
                  Placed on {new Date(currentOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge className={`${getStatusColor(currentOrder.status)} px-3 py-1`}>
              {currentOrder.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-serif luxury-text">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="flex space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium luxury-text truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm luxury-text-muted">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm luxury-text-muted">
                      Price: {formatIndianPrice(item.product.price)}
                    </p>
                  </div>
                  <div className="text-sm font-medium luxury-text">
                    {formatIndianPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-serif luxury-text flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="luxury-text">
                <p className="font-medium">
                  {currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}
                </p>
                <p>{currentOrder.shippingAddress.address1}</p>
                {currentOrder.shippingAddress.address2 && <p>{currentOrder.shippingAddress.address2}</p>}
                <p>
                  {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.province} {currentOrder.shippingAddress.postalCode}
                </p>
                <p>{currentOrder.shippingAddress.country}</p>
                {currentOrder.shippingAddress.phone && <p>{currentOrder.shippingAddress.phone}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-serif luxury-text flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="luxury-text-muted">Payment Method:</span>
                  <span className="luxury-text">Razorpay</span>
                </div>
                <div className="flex justify-between">
                  <span className="luxury-text-muted">Payment Status:</span>
                  <Badge className={getStatusColor(currentOrder.status || 'paid')}>
                    {currentOrder.status || 'Paid'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="luxury-text-muted">Total Amount:</span>
                  <span className="luxury-text font-semibold">
                    {formatIndianPrice(currentOrder.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-serif luxury-text">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatIndianPrice(currentOrder.total * 0.85)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-sage-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>{formatIndianPrice(currentOrder.total * 0.15)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold luxury-text">
                  <span>Total</span>
                  <span>{formatIndianPrice(currentOrder.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Actions */}
          <Card className="luxury-card">
            <CardContent className="p-6 space-y-4">
              <Button className="w-full luxury-button" asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
              {currentOrder.status === 'delivered' && (
                <Button variant="outline" className="w-full luxury-button-secondary">
                  Reorder Items
                </Button>
              )}
              {currentOrder.status === 'processing' && (
                <Button variant="outline" className="w-full luxury-button-secondary">
                  Cancel Order
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="luxury-card">
            <CardContent className="p-6">
              <h3 className="font-semibold luxury-text mb-2">Need Help?</h3>
              <p className="text-sm luxury-text-muted mb-4">
                If you have any questions about your order, please contact our support team.
              </p>
              <Button variant="outline" className="w-full luxury-button-secondary">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
