import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnnouncementStrip } from './header/AnnouncementStrip';
import { LogoModule } from './header/LogoModule';
import { NavigationModule } from './header/NavigationModule';
import { UtilitiesModule } from './header/UtilitiesModule';
import { MobileDrawer } from './header/MobileDrawer';
import { HeaderVariant } from './types/navigation';

interface HeaderProps {
  variant?: HeaderVariant;
  showAnnouncement?: boolean;
  announcementMessage?: string;
}

export function Header({
  variant: propVariant,
  showAnnouncement = false,
  announcementMessage,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine variant based on route if not explicitly set
  const isHomePage = location.pathname === '/' || location.pathname === '/landing';
  const variant = propVariant ?? (isHomePage ? 'transparent' : 'solid');

  // Scroll detection for transparent → solid transition
  // Transition happens after scrolling past the hero section (100vh - header height)
  useEffect(() => {
    if (variant !== 'transparent') {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      // Hero section is 100vh, transition after scrolling past it
      const heroHeight = window.innerHeight - 64; // 64px = header height
      setIsScrolled(window.scrollY > heroHeight);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant, location.pathname]);

  // Reset scroll state on route change
  useEffect(() => {
    if (variant === 'transparent') {
      const heroHeight = window.innerHeight - 64;
      setIsScrolled(window.scrollY > heroHeight);
    }
  }, [location.pathname, variant]);

  // Determine current visual state
  const isTransparent = variant === 'transparent' && !isScrolled;

  // Dynamic styles
  const headerStyles = isTransparent
    ? 'bg-transparent border-transparent'
    : 'bg-autumnFern-900/95 backdrop-blur-lg border-oak/10 shadow-sm';

  return (
    <>
      {/* Announcement Strip - Only shown when header is solid */}
      {showAnnouncement && !isTransparent && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <AnnouncementStrip message={announcementMessage} />
        </div>
      )}

      {/* Main Header */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b ${headerStyles}`}
        style={{ top: showAnnouncement && !isTransparent ? '36px' : '0' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <LogoModule
              variant={isTransparent ? 'full' : 'compact'}
              isTransparent={isTransparent}
            />

            {/* Desktop Navigation */}
            <NavigationModule isTransparent={isTransparent} />

            {/* Utilities + Mobile Menu */}
            <div className="flex items-center gap-2">
              <UtilitiesModule
                isTransparent={isTransparent}
                showLabels={!isTransparent}
              />
              <MobileDrawer
                isOpen={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
                isTransparent={isTransparent}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div
        className="header-spacer"
        style={{
          height: showAnnouncement ? 'calc(3.5rem + 36px)' : '3.5rem',
          display: isTransparent ? 'none' : 'block'
        }}
      />
    </>
  );
}
