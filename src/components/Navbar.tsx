import React, { useState } from 'react';
import {
  ShoppingBag,
  User as UserIcon,
  Menu as MenuIcon,
  X,
  Phone,
  Cake,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BusinessSettings } from '../types';

interface NavbarProps {
  settings: BusinessSettings | null;
  onOpenAdmin: () => void;
  onOpenAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onOpenAdmin, onOpenAccount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { totalItemCount, setIsCartOpen, openOrderScheduler } = useCart();

  const brandName = settings?.brandName || 'Amma Pastries Karnataka';
  const phone = settings?.phone || '+91 98800 23456';

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#241A15] text-[#FAF7F2] text-xs py-2 px-4 border-b border-[#3A2D26]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium tracking-wide">
              Bengaluru's Fresh Celebration Bakery · Daily Fresh Bakes Available
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs text-[#D8CCC0]">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D29C5B]" />
              <span>{phone}</span>
            </a>
            <span aria-hidden="true" className="text-[#523F34]">·</span>
            <span>Pickup: 9:30 AM – 10:00 PM</span>
            <span aria-hidden="true" className="text-[#523F34]">·</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-[#A8988B] hover:text-[#D29C5B] transition-colors cursor-pointer"
              title="Owner / Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADBCE] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a href="#" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-full bg-[#241A15] flex items-center justify-center text-[#D29C5B] shadow-sm border border-[#D29C5B]/30 group-hover:scale-105 transition-transform">
                  <Cake className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#241A15] leading-none">
                    Amma Pastries
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B87B37] mt-0.5">
                    Karnataka · Bengaluru
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#4A3B32]">
              <button
                onClick={() => scrollTo('hero')}
                className="hover:text-[#B87B37] transition-colors py-1 cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => scrollTo('menu')}
                className="hover:text-[#B87B37] transition-colors py-1 cursor-pointer"
              >
                Menu
              </button>
              <button
                onClick={() => scrollTo('custom-cakes')}
                className="hover:text-[#B87B37] transition-colors py-1 cursor-pointer"
              >
                Custom Cakes
              </button>
              <button
                onClick={() => scrollTo('gallery')}
                className="hover:text-[#B87B37] transition-colors py-1 cursor-pointer"
              >
                Gallery
              </button>
              <button
                onClick={() => scrollTo('about')}
                className="hover:text-[#B87B37] transition-colors py-1 cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => scrollTo('location')}
                className="hover:text-[#B87B37] transition-colors py-1 cursor-pointer"
              >
                Contact & Hours
              </button>
            </nav>

            {/* Right Action Icons & CTA */}
            <div className="flex items-center gap-3">
              {/* Customer Account Button */}
              <button
                onClick={onOpenAccount}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#241A15] hover:bg-[#F0E8DC] transition-colors cursor-pointer"
                title={user ? `Signed in as ${user.name}` : 'Sign in or register'}
              >
                <div className="w-8 h-8 rounded-full bg-[#EADBCE] flex items-center justify-center text-[#241A15]">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs text-[#7E6F65] leading-none">
                    {user ? 'Welcome,' : 'Account'}
                  </span>
                  <span className="text-sm font-semibold truncate max-w-[100px] leading-tight">
                    {user ? user.name.split(' ')[0] : 'Sign In'}
                  </span>
                </div>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-lg text-[#241A15] hover:bg-[#F0E8DC] transition-colors cursor-pointer"
                aria-label="View shopping cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B87B37] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* Primary Order CTA */}
              <button
                onClick={() => openOrderScheduler('Regular Cake Order')}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#241A15] text-[#FAF7F2] hover:bg-[#3A2D26] text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#D29C5B]" />
                <span>Order / Book Now</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-[#241A15] hover:bg-[#F0E8DC] transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#EADBCE] px-4 pt-3 pb-6 space-y-3">
            <div className="flex flex-col space-y-2 text-[15px] font-medium text-[#241A15]">
              <button
                onClick={() => scrollTo('hero')}
                className="text-left px-3 py-2 rounded-md hover:bg-[#F0E8DC]"
              >
                Home
              </button>
              <button
                onClick={() => scrollTo('menu')}
                className="text-left px-3 py-2 rounded-md hover:bg-[#F0E8DC]"
              >
                Menu (Cakes, Pastries, Snacks)
              </button>
              <button
                onClick={() => scrollTo('custom-cakes')}
                className="text-left px-3 py-2 rounded-md hover:bg-[#F0E8DC]"
              >
                Custom Celebration Cakes
              </button>
              <button
                onClick={() => scrollTo('gallery')}
                className="text-left px-3 py-2 rounded-md hover:bg-[#F0E8DC]"
              >
                Photo Gallery
              </button>
              <button
                onClick={() => scrollTo('about')}
                className="text-left px-3 py-2 rounded-md hover:bg-[#F0E8DC]"
              >
                About Our Bakery
              </button>
              <button
                onClick={() => scrollTo('location')}
                className="text-left px-3 py-2 rounded-md hover:bg-[#F0E8DC]"
              >
                Bengaluru Location & Hours
              </button>
            </div>

            <div className="pt-3 border-t border-[#EADBCE] flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openOrderScheduler('Regular Cake Order');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#241A15] text-[#FAF7F2] font-semibold text-sm shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#D29C5B]" />
                <span>Order / Schedule Pickup</span>
              </button>

              <div className="flex items-center justify-between text-xs text-[#7E6F65] pt-2 px-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex items-center gap-1.5 hover:text-[#241A15]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#B87B37]" />
                  <span>Owner Admin Portal</span>
                </button>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-1 hover:text-[#241A15]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#B87B37]" />
                  <span>Call {phone}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
