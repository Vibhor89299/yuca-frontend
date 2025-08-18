import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, Leaf } from 'lucide-react';
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
import { useStore } from '@/store/useStore';
import { categories } from '@/data/mockData';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { itemCount, isAuthenticated, user, logout } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isCurrentlyScrolled = scrollY > 50;
      
      setIsVisible(isCurrentlyScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'translate-y-0 bg-white/95 backdrop-blur-lg shadow-lg border-b border-sage-200/50' 
          : '-translate-y-full bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-sage-600 p-1.5 rounded-full">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-serif  luxury-text">YUCA</h1>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium luxury-text hover:text-sage-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium luxury-text hover:text-sage-600 transition-colors"
            >
              Products
            </Link>
            {categories.slice(0, 3).map((category) => (
              <DropdownMenu key={category.id}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-sm font-medium luxury-text hover:text-sage-600 h-auto p-1">
                    {category.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white/95 backdrop-blur-lg border-sage-200/50">
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
                  className="w-48 h-8 text-sm rounded-r-none border-sage-200 focus:ring-sage-600"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 rounded-l-none bg-sage-600 hover:bg-sage-700"
                >
                  <Search className="h-3 w-3" />
                </Button>
              </form>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="luxury-text h-8 px-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1 text-xs">
                    {isAuthenticated ? user?.firstName : 'Account'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-lg border-sage-200/50">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/login')}>
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/register')}>
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
              onClick={() => navigate('/cart')}
              className="relative luxury-text h-8 px-2"
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-sage-600 text-xs">
                  {itemCount}
                </Badge>
              )}
              <span className="hidden sm:inline ml-1 text-xs">Cart</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden h-8 px-2">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white/95 backdrop-blur-lg">
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
                    <Button type="submit" className="rounded-l-none bg-sage-600 hover:bg-sage-700" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>

                  <Link
                    to="/"
                    className="text-lg font-medium luxury-text hover:text-sage-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>

                  <Link
                    to="/products"
                    className="text-lg font-medium luxury-text hover:text-sage-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Products
                  </Link>

                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="text-lg font-medium luxury-text hover:text-sage-600 transition-colors"
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
      </div>
    </header>
  );
}