import { Link } from 'react-router-dom';
import {Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import YucaLogo from '../../assets/logo.jpg';


export function Footer() {
  return (
    <footer className="bg-kimber border-t border-oak mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="rounded-full">
                <img src={YucaLogo} alt="Yuca Logo" className="h-16 w-16 object-cover rounded-full" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-blanket">YUCA</h3>
                <p className="text-xs text-oak">Where Luxury Grows With You</p>
              </div>
            </div>
            <p className="text-sm text-blanket/80">
              Sustainable luxury lifestyle products that connect you with nature's beauty and your inner well-being.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="p-2 text-blanket hover:text-oak">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-blanket hover:text-oak">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-blanket hover:text-oak">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Shop Section */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-blanket">Shop</h4>
            <div className="space-y-2">
              <Link to="/category/living" className="block text-sm text-blanket/70 hover:text-oak transition-colors">
                Living
              </Link>
              <Link to="/category/wellness" className="block text-sm text-blanket/70 hover:text-oak transition-colors">
                Wellness
              </Link>
              <Link to="/category/fashion" className="block text-sm text-blanket/70 hover:text-oak transition-colors">
                Fashion
              </Link>
              <Link to="/category/garden" className="block text-sm text-blanket/70 hover:text-oak transition-colors">
                Garden
              </Link>
            </div>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-blanket">Support</h4>
            <div className="space-y-2">
              <Link to="/help" className="block text-sm text-blanket/70 hover:text-oak transition-colors">
                Help Center
              </Link>
              <Link to="/shipping" className="block text-sm text-blanket/70 hover:text-oak transition-colors">
                Shipping Info
              </Link>
              <Link to="/returns" className="block text-sm text-blanket/70 hover:text-oak transition-colors">
                Returns
              </Link>
              <Link to="/contact" className="block text-sm text-blanket/70 hover:text-oak transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-blanket">Stay Connected</h4>
            <p className="text-sm text-blanket/70">
              Subscribe to receive exclusive offers and updates on our latest sustainable luxury products.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-blanket border-oak/30"
              />
              <Button className="bg-autumnFern hover:bg-autumnFern-600 text-blanket">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-oak mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-blanket/70">
            © 2024 YUCA. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-blanket/70 hover:text-oak transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-blanket/70 hover:text-oak transition-colors">
              Terms of Service
            </Link>
            <Link to="/sustainability" className="text-sm text-blanket/70 hover:text-oak transition-colors">
              Sustainability
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}