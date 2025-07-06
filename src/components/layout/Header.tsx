import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Leaf } from 'lucide-react';
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
  const navigate = useNavigate();
  const { itemCount, isAuthenticated, user, logout } = useStore();

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
                <Button variant="ghost" size="sm" className="luxury-text">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline ml-2">
                    {isAuthenticated ? user?.firstName : 'Account'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
              className="relative luxury-text"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-luxury-600 text-xs">
                  {itemCount}
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