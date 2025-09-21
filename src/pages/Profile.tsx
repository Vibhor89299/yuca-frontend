"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Package,
  Heart,
  Settings,
  LogOut,
  Edit3,
  ShoppingBag,
  Star,
  Truck,
  CreditCard,
  Menu,
  X,
  Loader2,
} from "lucide-react"

interface UserData {
  _id: string
  name: string
  email: string
  role: string
  isAdmin: boolean
  phone?: string
}

interface Order {
  _id: string
  orderNumber?: string
  createdAt: string
  status: string
  totalAmount: number
  items?: any[]
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [userData, setUserData] = useState<UserData | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  })

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ]

  const getAuthToken = () => {
    return (
      localStorage.getItem("yuca_auth_token") ||
      null
    )
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUserData(data.user)
          setFormData({
            name: data.user.name || "",
            phone: data.user.phone || "",
          })
        }
      } else {
        setError("Failed to fetch user profile")
      }
    } catch (err) {
      console.error("Error fetching user profile:", err)
      setError("Network error while fetching profile")
    }
  }

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const response = await fetch("http://localhost:5001/api/orders/my", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders)
        } else if (Array.isArray(data)) {
          setOrders(data)
        }
      } else {
        console.error("Failed to fetch orders")
        // Keep empty array as fallback
      }
    } catch (err) {
      console.error("Error fetching orders:", err)
      // Keep empty array as fallback
    } finally {
      setOrdersLoading(false)
    }
  }

  const updateProfile = async () => {
    setUpdateLoading(true)
    try {
      const response = await fetch("http://localhost:5001/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUserData(data.user)
          alert("Profile updated successfully!")
        }
      } else {
        alert("Failed to update profile")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      alert("Network error while updating profile")
    } finally {
      setUpdateLoading(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchUserProfile(), fetchOrders()])
      setLoading(false)
    }

    loadData()
  }, [])

  const wishlistItems = [
    { name: "Premium Wine Glass", price: "₹799", image: "/elegant-wine-glass.png" },
    { name: "Ceramic Tea Set", price: "₹1,499", image: "/ceramic-tea-set.png" },
    { name: "Wooden Serving Tray", price: "₹1,299", image: "/wooden-tray.png" },
  ]

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800"
      case "in transit":
      case "shipped":
      case "shipping":
        return "bg-blue-100 text-blue-800"
      case "processing":
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    localStorage.removeItem("userProfile")

    // Clear any other user-related data
    localStorage.clear()

    // Clear session storage as well
    sessionStorage.clear()

    // Clear any cookies (if using document.cookie)
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=")
      const name = eqPos > -1 ? c.substr(0, eqPos) : c
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    })
    alert("user logged put successfuly")
    // Redirect to login or home page
    window.location.href = "/" // or "/" for home page
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatOrderId = (order: Order) => {
    return order.orderNumber || `#ORD-${order._id.slice(-6).toUpperCase()}`
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f2e0] flex items-center justify-center">
        <div className="flex items-center gap-2 text-amber-700">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-[#f5f2e0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-amber-700 text-white hover:bg-amber-800">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f2e0]">
      <div className="lg:hidden bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/professional-woman-diverse.png" />
              <AvatarFallback className="bg-amber-700 text-white text-sm">
                {userData ? getInitials(userData.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-sm font-semibold text-amber-900">{userData?.name || "User"}</h2>
              <p className="text-xs text-amber-700">Premium Member</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-amber-700 hover:bg-amber-50"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div
            className={`lg:col-span-1 lg:sticky lg:top-8 lg:h-fit ${
              sidebarOpen ? "fixed top-0 left-0 h-full w-80 z-50 lg:relative lg:w-auto lg:h-fit" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden h-full lg:h-auto">
              <div className="lg:hidden flex items-center justify-between p-4 border-b border-stone-200">
                <h3 className="text-lg font-semibold text-amber-900">Menu</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="text-amber-700 hover:bg-amber-50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Profile Header */}
              <div className="bg-gradient-to-r from-amber-50 to-stone-100 p-6 border-b border-stone-200">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-20 h-20 mb-3 border-3 border-white shadow-lg">
                    <AvatarImage src="/professional-woman-diverse.png" />
                    <AvatarFallback className="bg-amber-700 text-white text-lg">
                      {userData ? getInitials(userData.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-lg font-semibold text-amber-900 mb-1">{userData?.name || "User"}</h2>
                  <p className="text-sm text-amber-700 mb-2">Premium Member</p>
                  <Badge className="bg-amber-700 text-white text-xs px-2 py-1">VIP Customer</Badge>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => {if (item.id === "logout") {
                        handleLogout()
                      } else {
                        setActiveTab(item.id)
                        setSidebarOpen(false)
                      }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 mb-1 ${
                        activeTab === item.id
                          ? "bg-amber-700 text-white shadow-sm"
                          : "text-stone-700 hover:bg-stone-50 hover:text-amber-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </nav>

              {/* Quick Stats */}
              <div className="p-4 border-t border-stone-200 bg-stone-50">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold text-amber-700">{orders.length}</p>
                    <p className="text-xs text-stone-600">Orders</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-700"> ₹0 </p>
                    <p className="text-xs text-stone-600">Spent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Hero Welcome Section */}
                <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                  <div className="relative bg-gradient-to-r from-amber-50 to-stone-100 p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                        <AvatarImage src="/professional-woman-diverse.png" />
                        <AvatarFallback className="bg-amber-700 text-white text-xl">
                          {userData ? getInitials(userData.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h1 className="text-3xl font-bold text-amber-900 mb-2">
                              Welcome back, {userData?.name?.split(" ")[0] || "User"}!
                            </h1>
                            <p className="text-amber-700 text-lg mb-3">Premium Member since January 2023</p>
                            <div className="flex items-center gap-4">
                              <Badge className="bg-amber-700 text-white px-3 py-1">VIP Customer</Badge>
                              <Badge className="bg-green-100 text-green-800 px-3 py-1">Premium Loyalty</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-stone-600 mb-1">Total Orders</p>
                        <p className="text-3xl font-bold text-amber-900">{orders.length}</p>
                        <p className="text-xs text-green-600 mt-1">
                          {
                            orders.filter((order) => {
                              const orderDate = new Date(order.createdAt)
                              const currentMonth = new Date()
                              return (
                                orderDate.getMonth() === currentMonth.getMonth() &&
                                orderDate.getFullYear() === currentMonth.getFullYear()
                              )
                            }).length
                          }{" "}
                          this month
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-amber-700" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-stone-600 mb-1">Total Spent</p>
                        <p className="text-3xl font-bold text-amber-900">
                          ₹{orders.reduce((total, order) => total + (order.totalAmount || 0), 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          ₹
                          {orders
                            .filter((order) => {
                              const orderDate = new Date(order.createdAt)
                              const currentMonth = new Date()
                              return (
                                orderDate.getMonth() === currentMonth.getMonth() &&
                                orderDate.getFullYear() === currentMonth.getFullYear()
                              )
                            })
                            .reduce((total, order) => total + (order.totalAmount || 0), 0)
                            .toLocaleString()}{" "}
                          this month
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-700" />
                      </div>
                    </div>
                  </div>


                  <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-stone-600 mb-1">
                          Wishlist Items
                        </p>
                        <p className="text-3xl font-bold text-amber-900">12</p>
                        <p className="text-xs text-purple-600 mt-1">
                          2 new items
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-white rounded-lg shadow-sm border border-stone-200">
                  <div className="p-6 border-b border-stone-200">
                    <h3 className="text-xl font-semibold text-amber-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                          <Mail className="w-5 h-5 text-amber-700" />
                          <div>
                            <p className="text-sm text-stone-600">Email Address</p>
                            <p className="font-medium text-stone-900">{userData?.email || "Not provided"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                          <Phone className="w-5 h-5 text-amber-700" />
                          <div>
                            <p className="text-sm text-stone-600">Phone Number</p>
                            <p className="font-medium text-stone-900">{userData?.phone || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-amber-700" />
                          <div>
                            <p className="text-sm text-stone-600">Location</p>
                            <p className="font-medium text-stone-900">Mumbai, Maharashtra, India</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-amber-700" />
                          <div>
                            <p className="text-sm text-stone-600">Member Since</p>
                            <p className="font-medium text-stone-900">January 15, 2023</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Orders */}
                  <div className="bg-white rounded-lg shadow-sm border border-stone-200">
                    <div className="p-6 border-b border-stone-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-amber-900 flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Recent Orders
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-700 hover:text-amber-900"
                          onClick={() => setActiveTab("orders")}
                        >
                          View All
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      {ordersLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-amber-700" />
                        </div>
                      ) : orders.length > 0 ? (
                        <div className="space-y-4">
                          {orders.slice(0, 3).map((order) => (
                            <div
                              key={order._id}
                              className="flex items-center justify-between p-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                  <Package className="w-5 h-5 text-amber-700" />
                                </div>
                                <div>
                                  <p className="font-medium text-stone-900 text-sm">{formatOrderId(order)}</p>
                                  <p className="text-xs text-stone-600">{formatDate(order.createdAt)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                                <p className="text-sm font-medium text-stone-900 mt-1">
                                  ₹{order.totalAmount?.toLocaleString() || "0"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-stone-500">
                          <Package className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                          <p>No orders found</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow-sm border border-stone-200">
                    <div className="p-6 border-b border-stone-200">
                      <h3 className="text-xl font-semibold text-amber-900 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Quick Actions
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab("orders")}
                          className="h-20 flex flex-col items-center gap-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 bg-transparent"
                        >
                          <ShoppingBag className="w-6 h-6 text-amber-700" />
                          <span className="text-sm text-amber-900">Track Orders</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab("wishlist")}
                          className="h-20 flex flex-col items-center gap-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 bg-transparent"
                        >
                          <Heart className="w-6 h-6 text-amber-700" />
                          <span className="text-sm text-amber-900">View Wishlist</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab("settings")}
                          className="h-20 flex flex-col items-center gap-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 bg-transparent"
                        >
                          <Settings className="w-6 h-6 text-amber-700" />
                          <span className="text-sm text-amber-900">Account Settings</span>
                        </Button>
                        {/* <Button
                          variant="outline"
                          className="h-20 flex flex-col items-center gap-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 bg-transparent"
                        >
                          <CreditCard className="w-6 h-6 text-amber-700" />
                          <span className="text-sm text-amber-900">Payment Methods</span>
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-sm border border-stone-200">
                <div className="p-6 border-b border-stone-200">
                  <h2 className="text-xl font-semibold text-amber-900">Order History</h2>
                </div>
                <div className="p-6">
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order._id} className="border border-stone-200 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-stone-900">{formatOrderId(order)}</h3>
                              <p className="text-sm text-stone-600">Placed on {formatDate(order.createdAt)}</p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </div>
                          <Separator className="my-4" />
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-stone-900">
                                {order.items?.length ? `${order.items.length} item(s)` : "Order details"}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Truck className="w-4 h-4 text-stone-600" />
                                <span className="text-sm text-stone-600">
                                  {order.status.toLowerCase() === "delivered"
                                    ? "Delivered"
                                    : order.status.toLowerCase().includes("transit") ||
                                        order.status.toLowerCase().includes("shipped")
                                      ? "Expected delivery soon"
                                      : "Processing your order"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-stone-900">
                                ₹{order.totalAmount?.toLocaleString() || "0"}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 border-stone-200 text-stone-900 hover:bg-amber-50 hover:text-amber-900 bg-transparent"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto mb-4 text-stone-300" />
                      <h3 className="text-lg font-medium text-stone-900 mb-2">No orders yet</h3>
                      <p className="text-stone-600">Start shopping to see your orders here</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="bg-white rounded-lg shadow-sm border border-stone-200">
                <div className="p-6 border-b border-stone-200">
                  <h2 className="text-xl font-semibold text-amber-900">My Wishlist</h2>
                  <p className="text-sm text-stone-600 mt-1">Wishlist API not available - showing sample items</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item, index) => (
                      <div key={index} className="border border-stone-200 rounded-lg p-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-medium text-stone-900 mb-2">{item.name}</h3>
                        <p className="text-lg font-semibold text-amber-700 mb-4">{item.price}</p>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-amber-700 text-white hover:bg-amber-800">
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-stone-200 text-stone-900 hover:bg-red-50 hover:text-red-600 bg-transparent"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-sm border border-stone-200">
                <div className="p-6 border-b border-stone-200">
                  <h2 className="text-xl font-semibold text-amber-900">Account Settings</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-stone-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 border border-stone-200 rounded-lg bg-white text-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-3 border border-stone-200 rounded-lg bg-white text-stone-900"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium text-stone-900 mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-2">Email</label>
                          <input
                            type="email"
                            value={userData?.email || ""}
                            disabled
                            className="w-full p-3 border border-stone-200 rounded-lg bg-stone-50 text-stone-500"
                          />
                          <p className="text-xs text-stone-500 mt-1">Email cannot be changed</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={updateProfile}
                        disabled={updateLoading}
                        className="bg-amber-700 text-white hover:bg-amber-800"
                      >
                        {updateLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            name: userData?.name || "",
                            phone: userData?.phone || "",
                          })
                        }}
                        className="border-stone-200 text-stone-900 hover:bg-stone-50 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
