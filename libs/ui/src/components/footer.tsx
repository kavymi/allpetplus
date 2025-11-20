import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export interface FooterProps {
  LinkComponent?: React.ComponentType<{ href: string; children: React.ReactNode; className?: string }>;
}

export function Footer({ LinkComponent }: FooterProps): React.ReactElement {
  const Link = LinkComponent || (({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ));

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span>🐾</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">All Pet Plus</span>
            </div>
            <p className="text-sm text-neutral-400">
              Handcrafted, customizable dog collars and leashes made with love
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/builder" className="hover:text-white transition-colors">
                  Custom Collars
                </Link>
              </li>
              <li>
                <Link href="/builder?product=leash" className="hover:text-white transition-colors">
                  Custom Leashes
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-white transition-colors">
                  Collar & Leash Sets
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-400">
            © 2025 All Pet Plus. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/allpetplus"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/allpetplus"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com/allpetplus"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors"
              aria-label="Like us on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

