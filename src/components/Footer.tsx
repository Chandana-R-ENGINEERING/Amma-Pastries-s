import React from 'react';
import { Cake, Phone, MapPin, Clock, Navigation, ShieldCheck } from 'lucide-react';
import { BusinessSettings } from '../types';

interface FooterProps {
  settings: BusinessSettings | null;
  onOpenAdmin: () => void;
  onOpenAccount: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin, onOpenAccount }) => {
  const brandName = settings?.brandName || 'Amma Pastries Karnataka';
  const address = settings?.address || 'Amma Pastries, Bengaluru, Karnataka, India';
  const phone = settings?.phone || '+91 98800 23456';
  const openingHours = settings?.openingHours || 'Monday – Sunday: 9:00 AM – 10:30 PM';
  const mapsUrl =
    settings?.googleMapsUrl ||
    'https://maps.google.com/?q=Amma+Pastries+Bengaluru+Karnataka';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1A110D] text-[#D8CCC0] pt-16 pb-24 lg:pb-16 border-t border-[#2D211A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2D211A]">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#241A15] border border-[#D29C5B]/40 flex items-center justify-center text-[#D29C5B]">
                <Cake className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white tracking-tight block">
                  Amma Pastries
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D29C5B]">
                  Karnataka · Bengaluru
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A8988B] leading-relaxed">
              Freshly crafted treats for everyday cravings and special celebrations. Baked daily with love in Bengaluru.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-xs text-[#A8988B] hover:text-[#D29C5B] transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Owner Portal</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => scrollTo('hero')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bakery Menu & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('custom-cakes')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Custom Celebration Cakes
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('gallery')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Photo Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Our Bakery
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAccount}
                  className="hover:text-white transition-colors cursor-pointer text-[#D29C5B]"
                >
                  Customer Account & Reorders
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Verified Location & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Bengaluru Bakery Location
            </h4>
            <div className="space-y-2 text-xs text-[#A8988B]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D29C5B] shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D29C5B] shrink-0 mt-0.5" />
                <span>{openingHours}</span>
              </div>
              <div className="pt-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#D29C5B] hover:underline"
                >
                  <Navigation className="w-3 h-3" />
                  <span>View on Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Orders & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Direct Inquiries
            </h4>
            <div className="space-y-2 text-xs text-[#A8988B]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D29C5B] shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {phone}
                </a>
              </div>
              <p className="text-[11px] text-[#A8988B] leading-relaxed pt-1">
                Same-day cake orders accepted prior to 6:00 PM. Custom tiered cakes require 24 hours advance scheduling.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A6B60] gap-4">
          <p>© 2026 Amma Pastries Karnataka. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Bengaluru Celebration Bakery</span>
            <span aria-hidden="true">·</span>
            <span>Handcrafted Treats</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
