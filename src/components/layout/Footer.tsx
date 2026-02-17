import { BrandBlock } from './footer/BrandBlock';
import { NavigationBlock } from './footer/NavigationBlock';
import { PoliciesBlock } from './footer/PoliciesBlock';
import { SocialBlock } from './footer/SocialBlock';

interface FooterProps {
  showBrand?: boolean;
  showNavigation?: boolean;
  showPolicies?: boolean;
  showSocial?: boolean;
}

export function Footer({
  showBrand = true,
  showNavigation = true,
  showPolicies = true,
  showSocial = true,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-kimber border-t border-oak/10">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand Block */}
          {showBrand && (
            <div className="flex justify-center md:justify-start">
              <BrandBlock />
            </div>
          )}

          {/* Navigation Block */}
          {showNavigation && (
            <div className="flex justify-center md:justify-center">
              <NavigationBlock />
            </div>
          )}

          {/* Social Block */}
          {showSocial && (
            <div className="flex justify-center md:justify-end items-start">
              <SocialBlock />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-oak/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright + Delivery Info */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
              <p className="text-blanket/40 text-sm" style={{ fontFamily: "'Afacad', sans-serif" }}>
                © {currentYear} YUCA. All rights reserved.
              </p>
              <span className="hidden md:inline text-blanket/20">·</span>
              <p className="text-blanket/40 text-xs" style={{ fontFamily: "'Afacad', sans-serif" }}>
                Delhi NCR: 2-3 days · Pan India: 7-8 days
              </p>
            </div>

            {/* Policies */}
            {showPolicies && <PoliciesBlock />}
          </div>
        </div>
      </div>
    </footer>
  );
}
