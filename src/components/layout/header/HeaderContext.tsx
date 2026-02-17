import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import {
    HeaderContextValue,
    HeaderVariant,
    defaultHeaderConfig,
} from '../types/navigation';

const HeaderContext = createContext<HeaderContextValue | undefined>(undefined);

interface HeaderProviderProps {
    children: ReactNode;
    variant?: HeaderVariant;
    showAnnouncement?: boolean;
    announcementMessage?: string;
    showNavigation?: boolean;
    showUtilities?: boolean;
}

export function HeaderProvider({
    children,
    variant = defaultHeaderConfig.variant,
    showAnnouncement = defaultHeaderConfig.showAnnouncement,
    announcementMessage,
    showNavigation = defaultHeaderConfig.showNavigation,
    showUtilities = defaultHeaderConfig.showUtilities,
}: HeaderProviderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    // Scroll detection for transparent → solid transition
    useEffect(() => {
        if (variant !== 'transparent') {
            setIsScrolled(true);
            return;
        }

        const handleScroll = () => {
            const scrollThreshold = 100;
            setIsScrolled(window.scrollY > scrollThreshold);
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [variant, location.pathname]);

    const value: HeaderContextValue = {
        variant,
        showAnnouncement,
        announcementMessage,
        showNavigation,
        showUtilities,
        isScrolled,
    };

    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeader(): HeaderContextValue {
    const context = useContext(HeaderContext);
    if (!context) {
        // Return default values if used outside provider
        return {
            ...defaultHeaderConfig,
            isScrolled: true,
        };
    }
    return context;
}

export { HeaderContext };
