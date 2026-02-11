"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Package,
  Settings,
  LogOut,
  CreditCard,
  Menu,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { profileToasts, authToasts } from "@/lib/toast";
import { ProfilePageSkeleton } from "@/components/skeletons";
import bg from "@/assets/bg.svg";
interface UserData {
  _id: string;
  memberSince: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  phone?: string;
}

interface Order {
  id: string;
  orderNumber?: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  items?: any[];
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (window.innerWidth < 1040) {
      setIsMobile(true);
    }
  }, []);

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    // { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  const getAuthToken = () => {
    return localStorage.getItem("yuca_auth_token") || null;
  };

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
          setFormData({
            name: data.user.name || "",
            phone: data.user.phone || "",
          });
        }
      } else {
        setError("Failed to fetch user profile");
      }
    } catch {
      setError("Network error while fetching profile");
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/orders/my", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else if (Array.isArray(data)) {
          setOrders(data);
        }
      }
      // Keep empty array as fallback for non-ok response
    } catch {
      // Keep empty array as fallback
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateProfile = async () => {
    setUpdateLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUserData(data.user);
          profileToasts.updated();
        }
      } else {
        profileToasts.error("Failed to update profile");
      }
    } catch {
      profileToasts.error("Network error while updating profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUserProfile(), fetchOrders()]);
      setLoading(false);
    };

    loadData();
  }, []);


  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "delivered":
      case "completed":
        return "text-green-700 bg-green-50 border-green-200/50";
      case "in transit":
      case "shipped":
      case "shipping":
        return "text-blue-700 bg-blue-50 border-blue-200/50";
      case "processing":
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200/50";
      case "cancelled":
        return "text-red-700 bg-red-50 border-red-200/50";
      default:
        return "text-stone-700 bg-stone-50 border-stone-200/50";
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userProfile");
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      authToasts.logoutSuccess();
      window.location.href = "/";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-[#f5f2e0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-amber-700 text-[#fbfaf8] hover:bg-amber-800"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen page-enter pt-[100px] pb-12" style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Mobile Header */}
      {!isMobile && (
        <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-oak/10 sticky top-0 z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 ring-2 ring-oak/20">
                <AvatarImage src="/professional-woman-diverse.png" />
                <AvatarFallback className="bg-oak text-blanket text-xs">
                  {userData ? getInitials(userData.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-sm font-medium text-oak font-serif">
                  {userData?.name || "User"}
                </h2>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-oak hover:bg-oak/5"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-kimber/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Sidebar */}
          <div
            className={`lg:block ${sidebarOpen
              ? "fixed top-0 left-0 h-full w-80 z-50 bg-blanket p-6 shadow-2xl lg:relative lg:w-auto lg:h-fit lg:p-0 lg:shadow-none lg:bg-transparent"
              : "hidden"
              }`}
          >
            <div className="space-y-8">
              <div className="lg:hidden flex items-center justify-end mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="text-oak/60 hover:text-oak"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Profile Card */}
              <div className="bg-white/40 backdrop-blur-md rounded-xl p-6 border border-oak/10 text-center shadow-sm">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-20 h-20 border border-white shadow-md">
                    <AvatarImage src="/professional-woman-diverse.png" />
                    <AvatarFallback className="bg-oak text-blanket text-xl font-serif">
                      {userData ? getInitials(userData.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-autumnFern rounded-full border-2 border-white"></div>
                </div>
                <h2 className="text-xl font-philosopher text-oak mb-1">
                  {userData?.name || "User"}
                </h2>
                <p className="text-xs uppercase tracking-widest text-kimber/50">Member</p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === "logout") {
                          handleLogout();
                        } else {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg text-left transition-all duration-300 group ${isActive
                        ? "bg-oak text-blanket shadow-lg shadow-oak/20"
                        : "text-kimber/70 hover:bg-white/40 hover:text-oak"
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-autumnFern" : "text-kimber/40 group-hover:text-autumnFern transition-colors"}`} />
                      <span className={`text-sm tracking-wide ${isActive ? "font-medium" : "font-light"}`}>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Stats Mini */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/40 rounded-lg p-4 text-center border border-oak/5">
                  <p className="text-2xl font-light text-oak">{orders.length}</p>
                  <p className="text-[10px] uppercase tracking-widest text-kimber/50">Orders</p>
                </div>
                <div className="bg-white/40 rounded-lg p-4 text-center border border-oak/5">
                  <p className="text-lg font-light text-oak">
                    {orders.reduce((total, order) => total + (order.totalPrice || 0), 0) > 1000 ? '₹' + (orders.reduce((total, order) => total + (order.totalPrice || 0), 0) / 1000).toFixed(1) + 'k' : '₹' + orders.reduce((total, order) => total + (order.totalPrice || 0), 0)}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-kimber/50">Spent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-1 min-h-[600px]">
            {activeTab === "overview" && (
              <div className="space-y-8 animate-fade-in">
                {/* Welcome Hero */}
                <div className="relative overflow-hidden rounded-2xl bg-kimber text-blanket p-8 lg:p-12">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-autumnFern/20 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-butler mb-4">
                      Welcome back, {userData?.name?.split(" ")[0] || "User"}.
                    </h1>
                    <p className="text-white/70 max-w-lg font-light text-lg">
                      Track your sustainable journey and manage your preferences from your personal dashboard.
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/40 backdrop-blur-md border border-oak/10 p-6 rounded-xl hover:shadow-md transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-kimber/50 mb-1">Total Orders</p>
                        <p className="text-4xl font-light text-oak">{orders.length}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-oak/5 flex items-center justify-center group-hover:bg-oak/10 transition-colors">
                        <Package className="w-5 h-5 text-oak" />
                      </div>
                    </div>
                    <div className="text-sm text-kimber/60">
                      <span className="text-autumnFern font-medium">
                        {orders.filter((order) => {
                          const orderDate = new Date(order.createdAt);
                          const currentMonth = new Date();
                          return (
                            orderDate.getMonth() === currentMonth.getMonth() &&
                            orderDate.getFullYear() === currentMonth.getFullYear()
                          );
                        }).length} new
                      </span> this month
                    </div>
                  </div>

                  <div className="bg-white/40 backdrop-blur-md border border-oak/10 p-6 rounded-xl hover:shadow-md transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-kimber/50 mb-1">Total Investment</p>
                        <p className="text-4xl font-light text-oak">
                          ₹{orders.reduce((total, order) => total + (order.totalPrice || 0), 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-oak/5 flex items-center justify-center group-hover:bg-oak/10 transition-colors">
                        <CreditCard className="w-5 h-5 text-oak" />
                      </div>
                    </div>
                    <div className="text-sm text-kimber/60">
                      <span className="text-autumnFern font-medium">
                        ₹{orders
                          .filter((order) => {
                            const orderDate = new Date(order.createdAt);
                            const currentMonth = new Date();
                            return (
                              orderDate.getMonth() === currentMonth.getMonth() &&
                              orderDate.getFullYear() === currentMonth.getFullYear()
                            );
                          })
                          .reduce((total, order) => total + (order.totalPrice || 0), 0)
                          .toLocaleString()}
                      </span> this month
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="bg-white/60 backdrop-blur-md border border-oak/10 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-oak/10 flex items-center justify-between bg-white/40">
                    <h3 className="font-philosopher text-xl text-oak">Personal Details</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('settings')} className="text-autumnFern hover:text-autumnFern-600 hover:bg-transparent p-0 h-auto text-xs uppercase tracking-wider font-medium">Edit</Button>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-widest text-kimber/50">Email</p>
                      <p className="text-oak font-medium">{userData?.email || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-widest text-kimber/50">Phone</p>
                      <p className="text-oak font-medium">{userData?.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white/60 backdrop-blur-md border border-oak/10 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-oak/10 flex items-center justify-between bg-white/40">
                    <h3 className="font-philosopher text-xl text-oak">Recent Orders</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')} className="text-autumnFern hover:text-autumnFern-600 hover:bg-transparent p-0 h-auto text-xs uppercase tracking-wider font-medium">View All History</Button>
                  </div>
                  <div className="divide-y divide-oak/5">
                    {ordersLoading ? (
                      <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-oak/40" /></div>
                    ) : orders.length > 0 ? (
                      orders.slice(0, 3).map((order) => (
                        <div key={order.id} onClick={() => navigate(`/order/${order.id}`)} className="p-4 hover:bg-white/60 transition-colors cursor-pointer flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-oak/5 flex items-center justify-center text-oak font-serif text-sm">
                              {order.orderNumber ? '#' : <Package className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-medium text-oak text-sm">Order {order.orderNumber || `#${order.id?.slice(-6)}`}</p>
                              <p className="text-xs text-kimber/50">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={`uppercase tracking-wider text-[10px] font-medium border-0 shadow-none ${getStatusColor(order.status)}`}>
                              {order.status}
                            </Badge>
                            <p className="font-medium text-oak text-sm">₹{order.totalPrice?.toLocaleString()}</p>
                            <ArrowRight className="w-4 h-4 text-oak/20 group-hover:text-autumnFern transition-colors" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-kimber/50 text-sm">No recent orders found.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-philosopher text-oak">Order History</h2>
                </div>

                {ordersLoading ? (
                  <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-autumnFern" /></div>
                ) : orders.length > 0 ? (
                  <div className="grid gap-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white/40 backdrop-blur-md border border-oak/10 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border-b border-oak/5">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-serif text-oak">Order {order.orderNumber || `#${order.id?.slice(-8)}`}</h3>
                              <Badge className={`uppercase tracking-wider text-[10px] font-medium border-0 shadow-none ${getStatusColor(order.status)}`}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-kimber/60">Placed on {formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-kimber/50 uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-2xl font-light text-oak">₹{order.totalPrice?.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="p-4 bg-white/40 flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-kimber/70">
                            <Package className="w-4 h-4 text-autumnFern" />
                            <span>{order.items?.length || 0} Items</span>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/order/${order.id}`)} className="bg-transparent border-oak/20 text-oak hover:bg-oak hover:text-blanket transition-colors duration-300">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/60 backdrop-blur-md rounded-xl p-12 text-center border border-oak/10">
                    <Package className="w-16 h-16 text-oak/20 mx-auto mb-4" />
                    <h3 className="text-xl font-philosopher text-oak mb-2">No orders yet</h3>
                    <p className="text-kimber/60 mb-6 font-light">Start your sustainable journey with YUCA collection.</p>
                    <Button onClick={() => navigate('/')} className="bg-autumnFern hover:bg-autumnFern-600 text-blanket">Start Shopping</Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
                <h2 className="text-3xl font-philosopher text-oak text-center mb-8">Account Settings</h2>

                <div className="bg-white/60 backdrop-blur-md border border-oak/10 rounded-xl p-8 shadow-sm">
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-kimber/60 font-medium">Display Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white/50 border-oak/20 focus:border-autumnFern h-12 text-oak"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-kimber/60 font-medium">Phone Number</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white/50 border-oak/20 focus:border-autumnFern h-12 text-oak"
                      />
                    </div>

                    <Button
                      onClick={(e) => { e.preventDefault(); updateProfile(); }}
                      disabled={updateLoading}
                      className="w-full h-12 bg-autumnFern hover:bg-autumnFern-600 text-blanket font-medium tracking-wide shadow-lg hover:shadow-autumnFern/20 transition-all duration-300"
                    >
                      {updateLoading ? 'Updates Saved...' : 'Save Changes'}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
