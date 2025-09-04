import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { formatIndianPrice } from '@/utils/currency';                  
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart, fetchCart } from '@/store/slices/cartSlice';
import { placeOrder } from '@/store/slices/orderSlice';

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector(state => state.cart);
  const { loading: orderLoading, error: orderError } = useAppSelector(state => state.order);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const subtotal = total;
  const shipping = 0;
  const tax = total * 0.18; // 18% GST
  const finalTotal = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handlePaymentMethod = (val: string) => {
    setForm({ ...form, paymentMethod: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const shippingAddress = {
      firstName: form.firstName,
      lastName: form.lastName,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
    };
    const orderResult = await dispatch(placeOrder({
      items: items.map(item => ({ productId: item.product._id || item.product.id, quantity: item.quantity, price: item.product.price })),
      shippingAddress,
      paymentMethod: form.paymentMethod,
      totalPrice: finalTotal,
    }));
    
    if (placeOrder.fulfilled.match(orderResult)) {
      dispatch(clearCart()); // Clear the cart after successful order
      navigate('/order-confirmation');
    }
  };

  // Get authentication status from your store (adjust selector as needed)
  const isAuthenticated = useAppSelector(state => state.auth?.isAuthenticated);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [items.length, isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in bg-mushroom/95 backdrop-blur-sm min-h-screen">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate('/cart')} className="p-0 luxury-button-ghost">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-serif luxury-text">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" value={form.firstName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main Street" value={form.address} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" value={form.city} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="NY" value={form.state} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="10001" value={form.zip} onChange={handleChange} required />
                  </div>
                </div>
                <Separator />
                <CardTitle className="font-serif luxury-text">Payment Method</CardTitle>
                <RadioGroup value={form.paymentMethod} onValueChange={handlePaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>
                {form.paymentMethod === 'card' && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" value={form.expiry} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" value={form.cvv} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>
                )}
                {orderError && <div className="text-red-500 text-sm text-center font-medium">{orderError}</div>}
                <Button
                  type="submit"
                  className="w-full luxury-button text-lg py-3 rounded-xl shadow-md mt-4"
                  disabled={orderLoading}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {orderLoading ? 'Processing...' : `Pay ${formatIndianPrice(finalTotal)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="luxury-shadow border-sage-200 bg-white/90">
            <CardHeader>
              <CardTitle className="font-serif luxury-text">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium luxury-text truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium luxury-text">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatIndianPrice(subtotal, { compact: false })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-sage-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>{formatIndianPrice(tax, { compact: false })}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold luxury-text">
                  <span>Total</span>
                  <span>{formatIndianPrice(finalTotal, { compact: false })}</span>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Your payment information is encrypted and secure
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}