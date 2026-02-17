import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mainNavLinks, shopNavLinks } from '../types/navigation';

interface NavigationModuleProps {
    isTransparent?: boolean;
}

export function NavigationModule({ isTransparent = false }: NavigationModuleProps) {
    const textColor = isTransparent
        ? 'text-blanket/90 hover:text-blanket'
        : 'text-blanket/90 hover:text-blanket';

    return (
        <nav className="hidden md:flex items-center gap-8">
            {/* Shop Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger
                    className={`flex items-center gap-1 text-sm tracking-wider font-medium uppercase transition-colors duration-200 ${textColor} focus:outline-none`}
                    style={{ fontFamily: "'Afacad', sans-serif" }}
                >
                    Shop
                    <ChevronDown className="h-3 w-3 opacity-60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="start"
                    className="bg-kimber/95 backdrop-blur-lg border-oak/20 min-w-[160px]"
                >
                    {shopNavLinks.map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
                            <Link
                                to={link.href}
                                className="text-blanket/80 hover:text-blanket text-sm tracking-wide cursor-pointer"
                            >
                                {link.label}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Direct Links */}
            {mainNavLinks.slice(1).map((link) => (
                <Link
                    key={link.href}
                    to={link.href}
                    className={`text-sm tracking-wider font-medium uppercase transition-colors duration-200 ${textColor}`}
                    style={{ fontFamily: "'Afacad', sans-serif" }}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
