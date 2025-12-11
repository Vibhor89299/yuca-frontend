import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, Mail, CreditCard, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import axiosinstance from '@/axiosinstance/axiosinstance';
import { Product } from '@/types';
import { toast } from 'sonner';

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

const RetailPOS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash');
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosinstance.get('/api/products');
      setProducts(response.data.products || response.data);
      setFilteredProducts(response.data.products || response.data);
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Search products
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1, price: product.price }];
    });
    toast.success(`${product.name} added to cart`);
  };

  // Update cart item quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0;
  const total = subtotal + tax;

  // Generate invoice
  const generateInvoice = async () => {
    if (cart.length === 0) {
      toast.error('Please add items to cart');
      return;
    }

    if (!customerInfo.name || !customerInfo.email) {
      toast.error('Please provide customer name and email');
      return;
    }

    // Validate phone if provided
    if (customerInfo.phone && !/^[6-9]\d{9}$/.test(customerInfo.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setIsGeneratingInvoice(true);

      const orderData = {
        items: cart.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        retailCustomerInfo: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone || '',
          address: 'Retail POS Sale'
        },
        paymentMethod: paymentMethod,
        totalPrice: total
      };

      // Create retail order using the new route
      const orderResponse = await axiosinstance.post('/api/orders/retail', orderData);

      if (orderResponse.data && orderResponse.data.order) {
        const orderId = orderResponse.data.order.id;

        // Send the invoice email using the order ID
        await axiosinstance.post(`/api/email/invoice/${orderId}`);

        toast.success('Invoice sent to customer successfully!');

        // Clear cart and customer info
        setCart([]);
        setCustomerInfo({ name: '', email: '', phone: '' });
      } else {
        throw new Error('Order creation failed');
      }

    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
      } else if (error.response?.status === 404) {
        toast.error('Invoice service not available. Please try again later.');
      } else if (error.response?.status === 400) {
        toast.error('Invalid data provided. Please check your input.');
      } else {
        toast.error('Failed to generate invoice');
      }
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Retail POS System</h1>
        <p className="text-gray-600">Point of Sale for offline transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-50 shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Product Selection
              </CardTitle>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products by name, SKU, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg h-32 mb-2"></div>
                      <div className="bg-gray-200 rounded h-4 mb-1"></div>
                      <div className="bg-gray-200 rounded h-3 w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                        </div>
                        <Badge variant="outline" className="ml-2 text-xs">
                          ₹{product.price}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Stock: {product.countInStock}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={product.countInStock <= 0}
                          className="text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No products found matching your search.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cart & Customer Info */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card className="bg-gray-50 shadow-md border-0">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Customer Name *</label>
                <Input
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email *</label>
                <Input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter customer email"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <Input
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter customer phone"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="bg-gray-50 shadow-md border-0">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'upi')}
                    className="text-amber-600"
                  />
                  <CreditCard className="w-4 h-4" />
                  <span>Cash</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'upi')}
                    className="text-amber-600"
                  />
                  <Smartphone className="w-4 h-4" />
                  <span>UPI</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Cart */}
          <Card className="bg-gray-50 shadow-md border-0 p-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart ({cart.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items in cart</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product._id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-600">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product._id!, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product._id!, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.product._id!)}
                          className="w-8 h-8 p-0 text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={generateInvoice}
                    disabled={isGeneratingInvoice || cart.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    {isGeneratingInvoice ? (
                      'Generating Invoice...'
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Generate & Send Invoice
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RetailPOS;
