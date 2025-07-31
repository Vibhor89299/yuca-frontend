import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu , Leaf, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { fetchCart } from '@/store/slices/cartSlice';
import { categories } from '@/data/mockData';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { itemCount, guestItems } = useAppSelector((state) => state.cart);
  const totalItemCount = isAuthenticated 
    ? itemCount || 0 
    : guestItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/');
  };

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <header className="luxury-gradient border-b luxury-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        {/* Top row - Logo, Search, Actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-sage-600 p-2 rounded-full">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold luxury-text">YUCA</h1>
              <p className="text-xs luxury-accent font-medium">Where Luxury Grows With You</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                type="search"
                placeholder="Search luxury products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none border-sage-200 focus:ring-sage-600"
              />
              <Button
                type="submit"
                className="rounded-l-none luxury-button"
                size="sm"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="luxury-text hover:bg-sage-50/50 rounded-full px-3"
                >
                  <div className="h-8 w-8 rounded-full bg-sage-100 flex items-center justify-center">
                    {isAuthenticated && user?.name ? (
                      <span className="text-sage-800 font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    ) : (
                      <User className="h-4 w-4 text-sage-600" />
                    )}
                  </div>
                  <span className="hidden sm:inline ml-2">
                    {isAuthenticated ? user?.name?.split(' ')[0] || 'Account' : 'Account'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-sage-900">{user?.name}</p>
                      <p className="text-xs text-sage-500 truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuItem 
                      onClick={() => navigate('/profile')}
                      className="cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-sage-50"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/orders')}
                      className="cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-sage-50"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </DropdownMenuItem>
                    <div className="h-px bg-sage-100 my-1" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer rounded-md px-2 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut  className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem 
                      onClick={() => navigate('/login')}
                      className="cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-sage-50"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Sign In</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/register')}
                      className="cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-sage-50"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Create Account</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cart')}
              className="relative luxury-text"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-luxury-600 text-xs">
                  {totalItemCount}
                </Badge>
              )}
              <span className="hidden sm:inline ml-2">Cart</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
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
                    <Button type="submit" className="rounded-l-none luxury-button" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>

                  <Link
                    to="/"
                    className="text-lg font-medium luxury-text hover:luxury-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>

                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="text-lg font-medium luxury-text hover:luxury-accent transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center justify-center space-x-8 mt-4 pt-4 border-t border-sage-200">
          <Link
            to="/"
            className="text-sm font-medium luxury-text hover:luxury-accent transition-colors"
          >
            Home
          </Link>
          {categories.map((category) => (
            <DropdownMenu key={category.id}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium luxury-text hover:luxury-accent">
                  {category.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate(`/category/${category.slug}`)}>
                  All {category.name}
                </DropdownMenuItem>
                {category.subcategories?.map((sub) => (
                  <DropdownMenuItem
                    key={sub.id}
                    onClick={() => navigate(`/category/${category.slug}/${sub.slug}`)}
                  >
                    {sub.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>
      </div>
    </header>
  );
}