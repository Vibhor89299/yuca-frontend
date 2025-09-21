import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react';
import { formatIndianPrice } from '@/utils/currency';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateCartItem, removeFromCart, fetchCart, setGuestCart, updateGuestCartItem, removeGuestCartItem } from '@/store/slices/cartSlice';
import { useEffect } from 'react';

export function CartPage() {
  const dispatch = useAppDispatch();
  const { items, total, itemCount } = useAppSelector(state => state.cart);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      // Load guest cart from localStorage
      const data = localStorage.getItem('yuca_guest_cart');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          dispatch(setGuestCart(parsed));
        } catch {}
      }
    }
  }, [dispatch, isAuthenticated]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen bg-mushroom/95 backdrop-blur-sm">
        <div className="text-center space-y-6">
          <div className="bg-mushroom p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-autumnFern" />
          </div>
          <h1 className="text-2xl luxury-heading">Your Cart is Empty</h1>
          <p className="luxury-text-muted">
            Discover our beautiful collection of sustainable luxury products
          </p>
          <Button asChild className="luxury-button">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (isAuthenticated) {
      if (quantity > 0) dispatch(updateCartItem({ productId: id, quantity }));
    } else {
      if (quantity > 0) dispatch(updateGuestCartItem({ id, quantity }));
    }
  };
  const handleRemove = (id: string) => {
    if (isAuthenticated) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(removeGuestCartItem(id));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-[#f2e0cf] backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 luxury-button-ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
        <h1 className="text-2xl luxury-heading">
          Shopping Cart ({itemCount})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="luxury-card">
              <div className="bg-[#fbfaf8] rounded-lg p-6">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold luxury-text mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm luxury-text-muted mb-2">
                      {item.product.brand}
                    </p>
                    <p className="text-lg font-bold luxury-accent">
                      {formatIndianPrice(item.product.price)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 p-0 luxury-button-secondary"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center font-medium luxury-text">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0 luxury-button-secondary"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-sm font-medium luxury-accent">
                      {formatIndianPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="luxury-card">
            <div className="bg-[#fbfaf8] rounded-lg p-6">
              <h2 className="text-xl luxury-heading mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm luxury-text">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm luxury-text">
                  <span>Shipping</span>
                  <span className="text-khakiMoss">Free</span>
                </div>
                
                <div className="flex justify-between text-sm luxury-text">
                  <span>Tax</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                
                <Separator className="luxury-divider" />
                
                                  <span>Subtotal</span>
                  <span>{formatIndianPrice(total)}</span>
                </div>

                <div className="flex justify-between luxury-text">
                  <span>GST (18%)</span>
                  <span>{formatIndianPrice(total * 0.18)}</span>
                </div>
                
                <Separator className="luxury-divider" />
                
                <div className="flex justify-between text-lg font-bold luxury-accent">
                  <span>Total</span>
                  <span>{formatIndianPrice(total * 1.18)}</span>
              </div>
              
              <Button 
                className="w-full luxury-button mt-6" 
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </Card>
          
          {/* Security Badge */}
          <Card className="luxury-card">
            <CardContent className="bg-[#fbfaf8]  rounded-lg p-4 text-center">
              <p className="text-xs luxury-text-muted">
                Secure checkout powered by industry-leading encryption
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}