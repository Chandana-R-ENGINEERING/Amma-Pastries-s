import React from 'react';
import { MapPin, Clock, Phone, Navigation, CakeSlice, ExternalLink } from 'lucide-react';
import { BusinessSettings } from '../types';

interface BusinessInfoProps {
  settings: BusinessSettings | null;
  onOpenLocation: () => void;
}

export const BusinessInfo: React.FC<BusinessInfoProps> = ({ settings, onOpenLocation }) => {
  const address = settings?.address || 'Amma Pastries, Bengaluru, Karnataka, India';
  const openingHours = settings?.openingHours || 'Monday – Sunday: 9:00 AM – 10:30 PM';
  const phone = settings?.phone || '+91 98800 23456';
  const category = settings?.category || 'Bakery • Cakes • Pastries • Desserts • Baked Snacks';
  const mapsUrl = settings?.googleMapsUrl || 'https://maps.google.com/?q=Amma+Pastries+Bengaluru+Karnataka';

  return (
    <section className="bg-white border-b border-[#EADBCE] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          {/* Location & Directions */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#B87B37] border border-[#EADBCE] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider text-[#7E6F65] font-semibold">
                Bengaluru Location
              </div>
              <div className="text-sm font-semibold text-[#241A15] line-clamp-1">
                {address}
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#B87B37] hover:text-[#9E6426] mt-0.5"
              >
                <span>Get Directions</span>
                <Navigation className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#B87B37] border border-[#EADBCE] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider text-[#7E6F65] font-semibold">
                Opening Hours
              </div>
              <div className="text-sm font-semibold text-[#241A15]">
                {openingHours}
              </div>
              <span className="text-xs text-emerald-600 font-medium">
                Open Daily for Celebrations
              </span>
            </div>
          </div>

          {/* Contact / Phone */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#B87B37] border border-[#EADBCE] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider text-[#7E6F65] font-semibold">
                Bakery Direct Line
              </div>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="text-sm font-semibold text-[#241A15] hover:text-[#B87B37] transition-colors block"
              >
                {phone}
              </a>
              <span className="text-xs text-[#7E6F65]">
                Same-day cake booking available
              </span>
            </div>
          </div>

          {/* Category & Badge */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#B87B37] border border-[#EADBCE] shrink-0">
              <CakeSlice className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider text-[#7E6F65] font-semibold">
                Bakery Category
              </div>
              <div className="text-xs font-semibold text-[#241A15] leading-snug">
                {category}
              </div>
              <button
                onClick={onOpenLocation}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#B87B37] hover:underline mt-0.5 cursor-pointer"
              >
                <span>View Full Map & Info</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
