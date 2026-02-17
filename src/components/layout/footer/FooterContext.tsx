import { createContext, useContext, ReactNode } from 'react';
import { FooterConfig, defaultFooterConfig } from '../types/navigation';

const FooterContext = createContext<FooterConfig | undefined>(undefined);

interface FooterProviderProps extends Partial<FooterConfig> {
    children: ReactNode;
}

export function FooterProvider({
    children,
    showBrand = defaultFooterConfig.showBrand,
    showNavigation = defaultFooterConfig.showNavigation,
    showPolicies = defaultFooterConfig.showPolicies,
    showSocial = defaultFooterConfig.showSocial,
}: FooterProviderProps) {
    const value: FooterConfig = {
        showBrand,
        showNavigation,
        showPolicies,
        showSocial,
    };

    return (
        <FooterContext.Provider value={value}>
            {children}
        </FooterContext.Provider>
    );
}

export function useFooter(): FooterConfig {
    const context = useContext(FooterContext);
    if (!context) {
        return defaultFooterConfig;
    }
    return context;
}

export { FooterContext };
