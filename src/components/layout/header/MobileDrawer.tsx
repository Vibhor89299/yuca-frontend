import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { shopNavLinks, footerNavSections } from '../types/navigation';

interface MobileDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isTransparent?: boolean;
}

export function MobileDrawer({ isOpen, onOpenChange, isTransparent = false }: MobileDrawerProps) {
    const textColor = isTransparent ? 'text-blanket' : 'text-blanket';

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`md:hidden h-8 px-2 ${textColor} hover:bg-blanket/10`}
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="w-[300px] bg-autumnFern-900 border-l border-oak/20 p-0"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-oak/10">
                    <span
                        className="text-xl font-semibold text-blanket tracking-wider"
                        style={{ fontFamily: "'Afacad', sans-serif" }}
                    >
                        YUCA
                    </span>
                    <SheetClose asChild>
                        <Button variant="ghost" size="sm" className="text-blanket hover:bg-blanket/10">
                            <X className="h-5 w-5" />
                        </Button>
                    </SheetClose>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col py-6">
                    {/* Shop Section */}
                    <div className="px-6 mb-6">
                        <h3 className="text-xs uppercase tracking-[0.15em] text-blanket/50 mb-3">
                            Shop
                        </h3>
                        <div className="flex flex-col gap-2">
                            {shopNavLinks.map((link) => (
                                <SheetClose key={link.href} asChild>
                                    <Link
                                        to={link.href}
                                        className="text-blanket/80 hover:text-blanket text-base tracking-wide py-1 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </SheetClose>
                            ))}
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="px-6 mb-6">
                        <h3 className="text-xs uppercase tracking-[0.15em] text-blanket/50 mb-3">
                            About
                        </h3>
                        <div className="flex flex-col gap-2">
                            {footerNavSections[1]?.links.map((link) => (
                                <SheetClose key={link.href} asChild>
                                    <Link
                                        to={link.href}
                                        className="text-blanket/80 hover:text-blanket text-base tracking-wide py-1 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </SheetClose>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-oak/10 my-4" />

                    {/* Quick Links */}
                    <div className="px-6">
                        <div className="flex flex-col gap-2">
                            <SheetClose asChild>
                                <Link
                                    to="/cart"
                                    className="text-blanket/80 hover:text-blanket text-base tracking-wide py-1 transition-colors"
                                >
                                    Cart
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link
                                    to="/profile"
                                    className="text-blanket/80 hover:text-blanket text-base tracking-wide py-1 transition-colors"
                                >
                                    Account
                                </Link>
                            </SheetClose>
                        </div>
                    </div>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-oak/10">
                    <p className="text-xs text-blanket/40 tracking-wide text-center">
                        Mindful objects shaped by hand and nature.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
