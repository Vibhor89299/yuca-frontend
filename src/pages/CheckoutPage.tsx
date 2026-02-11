import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock, ArrowLeft, User, Mail } from "lucide-react";
import { formatIndianPrice } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearCart, fetchCart, clearGuestCart, setGuestCart } from "@/store/slices/cartSlice";
import { placeOrder } from "@/store/slices/orderSlice";
import { paymentService } from "@/services/paymentService";
import { orderToasts, showErrorToast } from "@/lib/toast";
import bg from "@/assets/bg.svg";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  phone?: string;
}
export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { loading: orderLoading, error: orderError } = useAppSelector(
    (state) => state.order
  );
  const [processingPayment, setProcessingPayment] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    // Guest information
    guestEmail: "",
    guestName: "",
    guestPhone: "",
    // Shipping information
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    // Payment information
    paymentMethod: "card",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const navigate = useNavigate();
  const getAuthToken = () => {
    return localStorage.getItem("yuca_auth_token") || null;
  };
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUserData(data.user);
          setForm((prevForm) => ({
            ...prevForm,
            guestEmail: data.user.email || prevForm.guestEmail,
            guestName: data.user.name || prevForm.guestName,
            guestPhone: data.user.phone || prevForm.guestPhone,
            firstName: data.user.name
              ? data.user.name.split(" ")[0]
              : prevForm.firstName,
            lastName: data.user.name
              ? data.user.name.split(" ").slice(1).join(" ")
              : prevForm.lastName,
          }));
        }
      } else {
        setError("Failed to fetch user profile");
      }
    } catch {
      setError("Network error while fetching profile");
    }
  };

  useEffect(() => {
    const authToken = getAuthToken();
    if (authToken) {
      fetchUserProfile();
    }
  }, []);

  useEffect(() => {
    if(isAuthenticated){
      dispatch(fetchCart());
    }else {
      // load guest cart 
      const data = localStorage.getItem('yuca-guest_cart');
      if (data){
        try{
          const parsed = JSON.parse(data);
          dispatch(setGuestCart(parsed));
        }catch (error){
          console.error("Failed to load cart" , error)
        }
      }
    }
  }, [dispatch , isAuthenticated]);

  const subtotal = total;
  // const mrpSubtotal = items.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  // const discount = mrpSubtotal - subtotal; // 10% display discount
  const shipping = 0;
  // Match cart breakdown (prices inclusive of GST)
  const tax = 0;
  const finalTotal = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handlePaymentMethod = (val: string) => {
    setForm({ ...form, paymentMethod: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.paymentMethod !== "razorpay") {
      // Handle other payment methods (if any)
      showErrorToast("Payment method not supported", "Only Razorpay payment is currently available");
      return;
    }

    setProcessingPayment(true);

    try {
      const shippingAddress = {
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
      };

      const orderData: any = {
        items: items.map((item) => ({
          productId: item.product._id || item.product.id,
          quantity: item.quantity,
          price: item.product.retailPrice,
        })),
        shippingAddress,
        paymentMethod: "razorpay",
        totalPrice: finalTotal,
      };

      // Add guest information if not authenticated
      let guestInfo;
      if (!isAuthenticated) {
        guestInfo = {
          email: form.guestEmail,
          name: form.guestName,
          phone: form.guestPhone,
        };
        orderData.guestInfo = guestInfo;
      }

      // Create order first
      const orderResult = await dispatch(placeOrder(orderData));

      if (placeOrder.fulfilled.match(orderResult)) {
        const orderId = orderResult.payload.order.id;
        const guestCheckoutToken = orderResult.payload.order.guestCheckoutToken;

        // Prepare user info for Razorpay
        const userInfo = isAuthenticated
          ? {
            name: `${form.firstName} ${form.lastName}`,
            email: userData?.email || form.guestEmail,
            phone: userData?.phone || form.guestPhone,
          }
          : undefined;

        // Open Razorpay checkout
        const paymentResult = await paymentService.openRazorpayCheckout(
          orderId,
          userInfo,
          guestInfo,
          guestCheckoutToken
        );
        if (paymentResult.payment.status === "paid") {
          // Clear the appropriate cart based on authentication status
          if (isAuthenticated) {
            dispatch(clearCart());
          } else {
            dispatch(clearGuestCart());
          }
          orderToasts.paymentSuccess();
          navigate(`/order/${orderId}`);
        }
      }
    } catch (error: any) {
      orderToasts.paymentFailed(error.message);
    } finally {
      setProcessingPayment(false);
    }
  };


  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  // const itemCountCalc = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen page-enter pt-[120px] pb-20" style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-section-title text-4xl md:text-5xl text-oak tracking-tight mb-4">Secure Checkout</h1>
          <div className="flex items-center justify-center space-x-2 text-sm text-kimber/60 uppercase tracking-widest">
            <span>Cart</span>
            <span className="text-autumnFern">&bull;</span>
            <span className="text-oak font-medium">Checkout</span>
            <span className="text-autumnFern">&bull;</span>
            <span>Payment</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-24 items-start">
          {/* Left Column: Forms */}
          <div className="space-y-12">
            <Button
              variant="ghost"
              onClick={() => navigate("/cart")}
              className="p-0 hover:bg-transparent text-oak hover:text-autumnFern group mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              <span className="tracking-widest uppercase text-xs">Return to Cart</span>
            </Button>

            {/* Guest Info */}
            {!isAuthenticated && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-oak/10 pb-4">
                  <h2 className="text-2xl font-philosopher text-kimber">Contact Information</h2>
                  <User className="h-5 w-5 text-autumnFern opacity-70" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="guestName" className="text-xs uppercase tracking-widest text-kimber/60">Full Name</Label>
                    <Input
                      id="guestName"
                      placeholder="John Doe"
                      value={form.guestName}
                      onChange={handleChange}
                      required
                      className="bg-white/30 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestPhone" className="text-xs uppercase tracking-widest text-kimber/60">Phone</Label>
                    <Input
                      id="guestPhone"
                      type="tel"
                      placeholder="9876543210"
                      value={form.guestPhone}
                      onChange={handleChange}
                      required
                      className="bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 h-12"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="guestEmail" className="text-xs uppercase tracking-widest text-kimber/60">Email Address</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={form.guestEmail}
                      onChange={handleChange}
                      required
                      className="bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 h-12"
                    />
                    <p className="text-xs text-kimber/50 pt-1">We'll send your order confirmation here.</p>
                  </div>
                </div>
              </section>
            )}

            {/* Shipping Info */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-oak/10 pb-4">
                <h2 className="text-2xl font-philosopher text-kimber">Shipping Address</h2>
                <Mail className="h-5 w-5 text-autumnFern opacity-70" />
              </div>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs uppercase tracking-widest text-kimber/60">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs uppercase tracking-widest text-kimber/60">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      className="bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 h-12"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-xs uppercase tracking-widest text-kimber/60">Street Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Luxury Lane"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs uppercase tracking-widest text-kimber/60">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-xs uppercase tracking-widest text-kimber/60">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="text-xs uppercase tracking-widest text-kimber/60">Postal Code</Label>
                    <Input
                      id="zip"
                      placeholder="10001"
                      value={form.zip}
                      onChange={handleChange}
                      required
                      className="bg-white/50 border-oak/20 focus:border-autumnFern focus:ring-autumnFern/20 h-12"
                    />
                  </div>
                </div>
              </form>
            </section>

            {/* Payment Method */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-oak/10 pb-4">
                <h2 className="text-2xl font-philosopher text-kimber">Payment Method</h2>
                <CreditCard className="h-5 w-5 text-autumnFern opacity-70" />
              </div>

              <div className="bg-white/40 border border-oak/10 rounded-xl p-6">
                <RadioGroup value={form.paymentMethod} onValueChange={handlePaymentMethod}>
                  <div className="flex items-start space-x-3 bg-white/60 p-4 rounded-lg border border-oak/20">
                    <RadioGroupItem value="razorpay" id="razorpay" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="razorpay" className="text-oak font-medium cursor-pointer">Razorpay Secure</Label>
                      <p className="text-xs text-kimber/60">Credit/Debit Cards, UPI, Net Banking, Wallets</p>
                    </div>
                  </div>
                </RadioGroup>

                {form.paymentMethod === "razorpay" && (
                  <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-kimber/50 bg-oak/5 py-2 rounded">
                    <Lock className="h-3 w-3" />
                    <span>Redirecting to secure payment gateway</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Summary & Total (Sticky) */}
          <div className="lg:sticky lg:top-32 space-y-8">
            <div className="bg-white/40 backdrop-blur-md p-8 lg:p-10 border border-oak/10 shadow-luxury rounded-xl">
              <h3 className="text-xl font-philosopher text-kimber mb-6">Order Summary</h3>

              {/* Mini Cart Items */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-oak/20 scrollbar-track-transparent">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-2">
                    <div className="h-16 w-16 bg-mushroom/20 rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm text-oak truncate">{item.product.name}</p>
                      <p className="text-xs text-kimber/50">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-oak">
                      {formatIndianPrice(item.product.retailPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-6 h-px bg-oak/10" />

              <div className="space-y-3 text-sm text-kimber/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatIndianPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-autumnFern uppercase text-[10px] bg-autumnFern/5 border border-autumnFern/20 px-2 py-0.5 rounded-full font-semibold tracking-wider">Free</span>
                </div>
              </div>

              <div className="my-6 h-px bg-oak/10" />

              <div className="flex justify-between items-baseline mb-6">
                <span className="font-serif text-lg text-oak">Total Payable</span>
                <span className="text-2xl font-light text-oak">{formatIndianPrice(finalTotal)}</span>
              </div>

              {orderError && (
                <div className="text-red-500 text-sm text-center font-medium mb-4">
                  {orderError}
                </div>
              )}

              <Button
                onClick={(_e) => {
                  // Trigger standard form submission since the button is outside the form
                  const formEl = document.getElementById('checkout-form') as HTMLFormElement;
                  if (formEl) {
                    formEl.requestSubmit();
                  }
                }}
                disabled={orderLoading || processingPayment}
                className="w-full bg-autumnFern hover:bg-autumnFern-600 text-blanket h-14 text-sm tracking-[0.2em] uppercase font-medium shadow-lg hover:shadow-autumnFern/20 transition-all duration-300"
              >
                {processingPayment ? "Processing..." : orderLoading ? "Creating Order..." : `Pay ${formatIndianPrice(finalTotal)}`}
              </Button>

              <div className="mt-6 flex justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                {/* Placeholder icons for trust/payments */}
                <div className="h-6 w-10 bg-oak/10 rounded" title="Visa" />
                <div className="h-6 w-10 bg-oak/10 rounded" title="Mastercard" />
                <div className="h-6 w-10 bg-oak/10 rounded" title="UPI" />
              </div>
            </div>

            <div className="bg-sage-50/50 p-6 rounded-xl border border-sage-100 flex items-start gap-4">
              <Lock className="h-5 w-5 text-sage-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-medium text-sage-800 mb-1">Secure Transaction</h4>
                <p className="text-xs text-sage-600 leading-relaxed">
                  All payments are processed securely via 256-bit SSL encryption. We do not store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
