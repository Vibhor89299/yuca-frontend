// Header & Footer Navigation Types

export interface NavLink {
    label: string;
    href: string;
    isExternal?: boolean;
}

export interface NavSection {
    title: string;
    links: NavLink[];
}

// Header Types
export type HeaderVariant = 'transparent' | 'solid';

export interface HeaderConfig {
    variant: HeaderVariant;
    showAnnouncement: boolean;
    announcementMessage?: string;
    showNavigation: boolean;
    showUtilities: boolean;
}

export interface HeaderContextValue extends HeaderConfig {
    isScrolled: boolean;
}

// Footer Types
export interface FooterConfig {
    showBrand: boolean;
    showNavigation: boolean;
    showPolicies: boolean;
    showSocial: boolean;
}

export interface SocialLink {
    platform: 'instagram' | 'email' | 'twitter' | 'facebook';
    href: string;
    label: string;
}

// Default configurations
export const defaultHeaderConfig: HeaderConfig = {
    variant: 'solid',
    showAnnouncement: false,
    showNavigation: true,
    showUtilities: true,
};

export const defaultFooterConfig: FooterConfig = {
    showBrand: true,
    showNavigation: true,
    showPolicies: true,
    showSocial: true,
};

// Navigation data
export const mainNavLinks: NavLink[] = [
    { label: 'Shop', href: '/category/kosha' },
    { label: 'Our Story', href: '/about' },
];

export const shopNavLinks: NavLink[] = [
    { label: 'Bowls', href: '/category/bowls' },
    { label: 'Candles', href: '/category/candles' },
    { label: 'Glassware', href: '/category/glassware' },
    { label: 'Cutlery', href: '/category/cutlery' },
    { label: 'Lifestyle', href: '/category/lifestyle' },
];

export const footerNavSections: NavSection[] = [
    {
        title: 'Shop',
        links: [
            { label: 'Bowls', href: '/category/bowls' },
            { label: 'Candles', href: '/category/candles' },
        ],
    },
    {
        title: 'About',
        links: [
            { label: 'Our Story', href: '/about' },        ],
    },
];

export const policyLinks: NavLink[] = [
    { label: 'Shipping', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Privacy', href: '/privacy' },
];

export const socialLinks: SocialLink[] = [
    {
        platform: 'instagram',
        href: 'https://www.instagram.com/yuca.lifestyle/',
        label: 'Follow us on Instagram',
    },
    {
        platform: 'email',
        href: 'mailto:enquire@yucalifestyle.com',
        label: 'Email us',
    },
];
