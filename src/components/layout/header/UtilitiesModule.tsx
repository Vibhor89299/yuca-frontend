import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

interface UtilitiesModuleProps {
    isTransparent?: boolean;
    showLabels?: boolean;
}

export function UtilitiesModule({ isTransparent = false, showLabels = true }: UtilitiesModuleProps) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const user = useAppSelector((state) => state.auth.user);
    const itemCount = useAppSelector((state) => state.cart.itemCount);

    const textColor = isTransparent ? 'text-blanket' : 'text-blanket';
    const hoverBg = isTransparent ? 'hover:bg-blanket/10' : 'hover:bg-blanket/10';

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setSearchOpen(false);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {/* Search */}
            <div className="relative">
                {searchOpen ? (
                    <form onSubmit={handleSearch} className="flex items-center gap-1">
                        <Input
                            type="search"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-40 h-8 text-sm bg-blanket/90 border-oak/30 focus:ring-autumnFern"
                            autoFocus
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchOpen(false)}
                            className={`h-8 px-2 ${textColor} ${hoverBg}`}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </form>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchOpen(true)}
                        className={`h-8 px-2 ${textColor} ${hoverBg}`}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Account */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 px-2 ${textColor} ${hoverBg}`}
                    >
                        <User className="h-4 w-4" />
                        {showLabels && (
                            <span className="hidden sm:inline ml-1 text-xs tracking-wide">
                                {isAuthenticated ? user?.firstName : 'Account'}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="bg-kimber/95 backdrop-blur-lg border-oak/20"
                >
                    {isAuthenticated ? (
                        <>
                            <DropdownMenuItem
                                onClick={() => navigate('/profile')}
                                className="text-blanket/80 hover:text-blanket cursor-pointer"
                            >
                                My Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate('/orders')}
                                className="text-blanket/80 hover:text-blanket cursor-pointer"
                            >
                                My Orders
                            </DropdownMenuItem>
                            {(user?.role === 'ADMIN' || user?.isAdmin === true) && (
                                <DropdownMenuItem
                                    onClick={() => navigate('/pos')}
                                    className="text-blanket/80 hover:text-blanket cursor-pointer"
                                >
                                    Retail POS
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-blanket/80 hover:text-blanket cursor-pointer"
                            >
                                Sign Out
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem
                                onClick={() => navigate('/login')}
                                className="text-blanket/80 hover:text-blanket cursor-pointer"
                            >
                                Sign In
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate('/register')}
                                className="text-blanket/80 hover:text-blanket cursor-pointer"
                            >
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
                className={`relative h-8 px-2 ${textColor} ${hoverBg}`}
            >
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-autumnFern text-blanket text-[10px]">
                        {itemCount}
                    </Badge>
                )}
                {showLabels && (
                    <span className="hidden sm:inline ml-1 text-xs tracking-wide">Cart</span>
                )}
            </Button>
        </div>
    );
}
