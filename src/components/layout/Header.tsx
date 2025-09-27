import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
// import { categories } from '@/data/mockData';
import YucaLogo from "../../assets/logo.jpg";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  // const itemCount = useAppSelector(state => state.cart.itemCount);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  // const [itemCount, setItemCount] = useState(0);

  // TODO: Implement logout via Redux if needed
  // const dispatch = useAppDispatch();
  // const handleLogout = () => { dispatch(logoutUser()); navigate('/'); };
  // useEffect(() => {
  //   const fetchCartItemCount = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5001/api/cart', {
  //         headers: {
  //             Authorization: `Bearer ${localStorage.getItem("yuca_auth_token")}`, // make sure token is stored in localStorage
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch cart data');
  //       }

  //       const data = await response.json();

  //       // Assuming the response looks like: { items: [...] }
  //       const count = data.items?.length ?? 0;
  //       setItemCount(count);
  //     } catch (error) {
  //       console.error('Error fetching cart item count:', error);
  //       setItemCount(0);
  //     }
  //   };
  //   fetchCartItemCount();
  // }, []);

  const reduxItemCount = useAppSelector((state) => state.cart.itemCount);



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${"translate-y-0 bg-kimber/95 backdrop-blur-lg shadow-lg border-b border-oak/50"}`}
    >
      <div className="container mx-auto px-4 ">
        {/* Compact Header */}
        <div className="flex items-center justify-between py-0">
          {/* Logo */}
          <Link to="/" className="flex items-center  flex-shrink-0">
            <div className="rounded-full h-[3rem] w-[4rem] overflow-hidden">
              <img
                src={YucaLogo}
                alt="Yuca Logo"
                className="h-full w-full rounded-full object-cover "
              />
            </div>
            <div>
              <span className="text-[20px] font-serif text-blanket">YUCA</span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Navigation links removed as requested */}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search - Desktop */}
            <div className="hidden lg:flex">
              <form onSubmit={handleSearch} className="flex">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 h-8 text-sm rounded-r-none border-oak/30 focus:ring-autumnFern bg-blanket"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 rounded-l-none bg-autumnFern hover:bg-autumnFern-600"
                >
                  <Search className="h-3 w-3" />
                </Button>
              </form>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blanket h-8 px-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1 text-xs">
                    {isAuthenticated ? user?.firstName : "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-mushroom/95 backdrop-blur-lg border-oak/50"
              >
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/orders")}>
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/login")}>
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/register")}>
                      Create Account
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cart")}
              className="relative text-blanket h-8 px-2"
            >
              <ShoppingBag className="h-4 w-4" />
              {reduxItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-autumnFern text-blanket text-xs">
                  {reduxItemCount}
                </Badge>
              )}
              <span className="hidden sm:inline ml-1 text-xs">Cart</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden h-8 px-2 text-blanket"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-mushroom/95 backdrop-blur-lg"
              >
                <nav className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="flex w-full mb-6">
                    <Input
                      type="search"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button
                      type="submit"
                      className="rounded-l-none bg-autumnFern hover:bg-autumnFern-600"
                      size="sm"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
