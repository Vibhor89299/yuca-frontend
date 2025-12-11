import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock, ArrowLeft, User, Mail } from "lucide-react";
import { formatIndianPrice } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearCart, fetchCart, clearGuestCart } from "@/store/slices/cartSlice";
import { placeOrder } from "@/store/slices/orderSlice";
import { paymentService } from "@/services/paymentService";

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
          console.log("data", data.user);
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
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Network error while fetching profile");
    }
  };

  useEffect(() => {
    const authToken = getAuthToken();
    console.log("auth", authToken);
    if (authToken) {
      fetchUserProfile();
    }
  }, []);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const subtotal = total;
  const mrpSubtotal = Math.round(subtotal / 0.9);
  const discount = mrpSubtotal - subtotal; // 10% display discount
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
      alert("Only Razorpay payment is currently supported");
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
          price: item.product.price,
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
          guestInfo
        );
        paymentResult.payment.status
        if (paymentResult.payment.status === "paid") {
          // Clear the appropriate cart based on authentication status
          if (isAuthenticated) {
            dispatch(clearCart());
          } else {
            dispatch(clearGuestCart());
          }
          navigate(`/order/${orderId}`);
        }
      }
    } catch (error: any) {
      console.error("Payment failed:", error);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Get authentication status from your store (adjust selector as needed)
  const isAuthenticated =
    useAppSelector((state) => state.auth?.isAuthenticated) || !!getAuthToken();

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  const itemCountCalc = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="container mx-auto px-4 pt-[80px] animate-fade-in  backdrop-blur-sm min-h-screen">
      {error}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/cart")}
          className="p-0 luxury-button-ghost"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Guest Information Form (only show if not authenticated) */}
          {!isAuthenticated && (
            <Card className="bg-[#fbfaf8] ">
              <CardHeader>
                <CardTitle className="font-serif luxury-text flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Guest Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestName">Full Name</Label>
                    <Input
                      id="guestName"
                      placeholder="John Doe"
                      value={form.guestName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={form.guestEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestPhone">Phone Number</Label>
                  <Input
                    id="guestPhone"
                    type="tel"
                    placeholder="9876543210"
                    value={form.guestPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="p-4 bg-sage-50 rounded-lg">
                  <p className="text-sm luxury-text-muted">
                    <Mail className="h-4 w-4 inline mr-2" />
                    We'll send your order confirmation and tracking details to
                    this email address.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="bg-[#fbfaf8] ">
            <CardHeader>
              <CardTitle className="font-serif luxury-text">
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={form.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="10001"
                      value={form.zip}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <Separator />
                <CardTitle className="font-serif luxury-text">
                  Payment Method
                </CardTitle>
                <RadioGroup
                  value={form.paymentMethod}
                  onValueChange={handlePaymentMethod}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Razorpay (Cards, UPI, Net Banking, Wallets)
                    </Label>
                  </div>
                </RadioGroup>
                {form.paymentMethod === "razorpay" && (
                  <div className="p-4 bg-sage-50 rounded-lg">
                    <p className="text-sm luxury-text-muted">
                      <Lock className="h-4 w-4 inline mr-2" />
                      Secure payment powered by Razorpay. You'll be redirected
                      to a secure payment page.
                    </p>
                  </div>
                )}
                {orderError && (
                  <div className="text-red-500 text-sm text-center font-medium">
                    {orderError}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full luxury-button text-lg py-3 rounded-xl shadow-md mt-4"
                  disabled={orderLoading || processingPayment}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {processingPayment
                    ? "Processing Payment..."
                    : orderLoading
                    ? "Creating Order..."
                    : `Pay ${formatIndianPrice(finalTotal)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="luxury-shadow border-sage-200 bg-white/90">
            <CardHeader>
              <CardTitle className="font-serif luxury-text">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <img
                      src={item.product.image || "/placeholder.svg"}
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
                      {formatIndianPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex justify-between text-sm luxury-text">
                  <span>MRP ({itemCountCalc} items)</span>
                  <span className="line-through text-muted-foreground">{formatIndianPrice(mrpSubtotal, { compact: false })}</span>
                </div>
                <div className="flex justify-between text-sm luxury-text">
                  <span>Diwali Discount (10%)</span>
                  <span className="text-autumnFern">- {formatIndianPrice(discount, { compact: false })}</span>
                </div>
                <Separator className="luxury-divider" />
                <div className="flex justify-between text-sm luxury-text font-medium">
                  <span>Subtotal (Inclusive of GST)</span>
                  <span>{formatIndianPrice(finalTotal, { compact: false })}</span>
                </div>
                <div className="flex justify-between text-sm luxury-text">
                  <span>Shipping</span>
                  <span className="text-sage-600">Free</span>
                </div>
                <Separator className="luxury-divider" />
                <div className="flex justify-between text-lg font-bold luxury-accent">
                  <span>Total Payable</span>
                  <span>
                    {formatIndianPrice(finalTotal, { compact: false })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground text-right">Prices are inclusive of GST</p>
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
