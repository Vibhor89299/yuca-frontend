import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { formatIndianPrice } from '@/utils/currency';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import bg from '@/assets/bg-bg.jpg';
import { updateCartItem, removeFromCart, fetchCart, setGuestCart, updateGuestCartItem, removeGuestCartItem } from '@/store/slices/cartSlice';
import { useEffect, useMemo, useCallback } from 'react';
import { cartToasts } from '@/lib/toast';
import { CartPageSkeleton } from '@/components/skeletons';

export function CartPage() {
  const dispatch = useAppDispatch();
  const { items, total, itemCount, loading } = useAppSelector(state => state.cart);
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
        } catch { }
      }
    }
  }, [dispatch, isAuthenticated]);

  // All hooks must be called before any early returns
  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    if (isAuthenticated) {
      if (quantity > 0) dispatch(updateCartItem({ productId: id, quantity }));
    } else {
      if (quantity > 0) dispatch(updateGuestCartItem({ id, quantity }));
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = useCallback((id: string, productName?: string) => {
    if (isAuthenticated) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(removeGuestCartItem(id));
    }
    cartToasts.removed(productName);
  }, [dispatch, isAuthenticated]);

  const handleCheckout = useCallback(() => {
    navigate('/checkout');
  }, [navigate]);

  // Memoized pricing calculations for display-only discount (backend prices unchanged)
  const { mrpTotal } = useMemo(() => {
    const mrp = items.reduce((sum, item) => {
      return sum + item.product.mrp * item.quantity;
    }, 0);
    return {
      mrpTotal: mrp,
      displayDiscount: Math.max(0, mrp - total)
    };
  }, [items, total]);

  // Now we can have early returns after all hooks are called
  if (loading) {
    return <CartPageSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center page-enter relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 0.5
          }}
        />
        <div className="relative z-10 text-center space-y-8 animate-fade-in px-4">
          <div className="relative mx-auto w-28 h-28">
            <div className="absolute inset-0 bg-autumnFern/10 rounded-full animate-pulse" />
            <div className="relative bg-white/50 backdrop-blur-md border border-kimber/10 rounded-full w-28 h-28 flex items-center justify-center shadow-[0_4px_20px_-10px_rgba(44,37,33,0.1)]">
              <ShoppingBag className="h-12 w-12 text-autumnFern" strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="font-butler font-extralight text-4xl md:text-5xl text-kimber tracking-tight">
              Your Cart is Empty
            </h1>
            <p className="text-khakiMoss tracking-[0.15em] uppercase text-sm font-medium">
              Nothing here yet — let's change that
            </p>
          </div>

          <p className="text-kimber max-w-md mx-auto leading-relaxed font-light">
            Discover our curated collection of sustainable luxury pieces, crafted with care for you and the planet.
          </p>

          <Button asChild className="bg-autumnFern hover:bg-autumnFern-600 text-blanket h-14 px-10 text-sm tracking-[0.2em] uppercase font-medium shadow-lg hover:shadow-autumnFern/20 transition-all duration-300">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-enter pt-[120px] pb-20 relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.5
        }}
      />
      <div className="relative z-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

          {/* Editorial Header */}
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h1 className="text-section-title text-5xl md:text-6xl text-kimber tracking-tight">
              Your Selection
            </h1>
            <p className="text-khakiMoss tracking-[0.2em] uppercase text-sm font-medium">
              {itemCount} {itemCount === 1 ? 'Item' : 'Items'} &bull; Sustainable Luxury
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-8">
              <div className="hidden md:flex items-center justify-between pb-4 border-b border-kimber/10 text-sm tracking-widest uppercase text-kimber font-medium">
                <span className="flex-1">Product</span>
                <span className="w-32 text-center">Quantity</span>
                <span className="w-24 text-right">Total</span>
              </div>

              {items.map((item) => (
                <div key={item.id} className="group flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start py-6 border-b border-kimber/10 last:border-0 hover:bg-white/40 transition-colors duration-300 rounded-lg p-4 -mx-4">
                  {/* Product Image */}
                  <div className="w-full md:w-32 aspect-[3/4] md:aspect-square bg-mushroom/20 overflow-hidden relative group-hover:shadow-md transition-shadow duration-300">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-khakiMoss tracking-widest uppercase mb-1">{item.product.brand || 'YUCA'}</span>
                      <Link to={`/product/${item.product.id || item.product._id}`} className="font-serif text-2xl text-kimber hover:text-autumnFern transition-colors">
                        {item.product.name}
                      </Link>
                    </div>
                    <p className="text-kimber font-light">
                      {formatIndianPrice(item.product.retailPrice)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-kimber/20 rounded-full h-10 px-2 bg-white/50 backdrop-blur-sm">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-kimber hover:bg-kimber/5 rounded-full transition-colors disabled:opacity-30"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-medium text-kimber text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={
                        (item.product.countInStock ? item.quantity >= item.product.countInStock : false)
                      }
                      className="w-8 h-8 flex items-center justify-center text-kimber hover:bg-kimber/5 rounded-full transition-colors disabled:opacity-30"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Remove & Total */}
                  <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-24">
                    <span className="text-lg font-medium text-kimber">
                      {formatIndianPrice(item.product.retailPrice * item.quantity)}
                    </span>
                    <button
                      onClick={() => handleRemove(item.id, item.product.name)}
                      className="text-xs text-red-800/60 hover:text-red-800 underline underline-offset-4 transition-colors tracking-wide"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-8">
                <Button onClick={() => navigate('/')} variant="ghost" className="text-kimber hover:text-autumnFern hover:bg-transparent pl-0 group">
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  <span className="tracking-widest uppercase text-xs">Continue Shopping</span>
                </Button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white/40 backdrop-blur-md p-8 lg:p-10 sticky top-32 border border-kimber/10 shadow-[0_4px_20px_-10px_rgba(44,37,33,0.05)]">
                <h2 className="text-2xl font-philosopher text-kimber mb-8">Order Summary</h2>

                <div className="space-y-4 text-sm tracking-wide text-kimber">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatIndianPrice(total)}</span>
                  </div>
                  {mrpTotal > total && (
                    <div className="flex justify-between text-autumnFern">
                      <span>Savings</span>
                      <span>-{formatIndianPrice(mrpTotal - total)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-kimber uppercase text-xs font-semibold tracking-widest border border-kimber/20 px-2 py-0.5 rounded-full bg-kimber/5">Free</span>
                  </div>
                </div>

                <div className="my-8 h-px w-full bg-kimber/10"></div>

                <div className="flex justify-between items-baseline mb-8">
                  <span className="text-lg font-serif text-kimber">Total</span>
                  <span className="text-3xl font-light text-kimber">{formatIndianPrice(total)}</span>
                </div>

                <div className="space-y-4">
                  <Button
                    className="w-full bg-autumnFern hover:bg-autumnFern-600 text-blanket h-14 text-sm tracking-[0.2em] uppercase font-medium shadow-lg hover:shadow-autumnFern/20 transition-all duration-300"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>

                  <p className="text-xs text-center text-kimber leading-relaxed">
                    Shipping taxes and duties calculated at next step. <br />
                    Secure checkout powered by Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
