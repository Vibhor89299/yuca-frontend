import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Package, PackagePlus, Home, LineChart, ShoppingCart, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    // toast({
    //   title: "Logged out",
    //   description: "You have been successfully logged out.",
    // });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Yuca Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            asChild
          >
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2",
                  isActive && "bg-accent text-accent-foreground"
                )
              }
            >
              <Home className="h-4 w-4" />
              Dashboard
            </NavLink>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            asChild
          >
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2",
                  isActive && "bg-accent text-accent-foreground"
                )
              }
            >
              <Package className="h-4 w-4" />
              Products
            </NavLink>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            asChild
          >
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2",
                  isActive && "bg-accent text-accent-foreground"
                )
              }
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
            </NavLink>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            asChild
          >
            <NavLink
              to="/admin/inventory"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2",
                  isActive && "bg-accent text-accent-foreground"
                )
              }
            >
              <ClipboardList className="h-4 w-4" />
              Inventory
            </NavLink>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            asChild
          >
            <Link to="/admin/inventory">
              <PackagePlus className="h-4 w-4" />
              Inventory
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            asChild
          >
            <Link to="/admin/orders">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            asChild
          >
            <Link to="/admin/reports">
              <LineChart className="h-4 w-4" />
              Reports
            </Link>
          </Button>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
