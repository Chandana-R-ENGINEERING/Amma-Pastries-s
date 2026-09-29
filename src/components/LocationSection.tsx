import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Navigation,
  ExternalLink,
  Store,
} from 'lucide-react';
import { BusinessSettings } from '../types';

interface LocationSectionProps {
  settings: BusinessSettings | null;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings }) => {
  const address = settings?.address || 'Amma Pastries, Bengaluru, Karnataka, India';
  const openingHours = settings?.openingHours || 'Monday – Sunday: 9:00 AM – 10:30 PM';
  const pickupTimings = settings?.pickupTimings || '9:30 AM – 10:00 PM Daily';
  const phone = settings?.phone || '+91 98800 23456';
  const whatsapp = settings?.whatsapp || '+91 98800 23456';
  const mapsUrl =
    settings?.googleMapsUrl ||
    'https://maps.google.com/?q=Amma+Pastries+Bengaluru+Karnataka';
  const mapsEmbed =
    settings?.googleMapsEmbed ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124414.28189601438!2d77.51478149887702!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2f768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000';

  const cleanPhone = phone.replace(/\s+/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  return (
    <section id="location" className="py-16 sm:py-24 bg-white border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B87B37] mb-2">
            <Store className="w-4 h-4" />
            <span>Bengaluru Destination</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241A15] tracking-tight">
            Visit Amma Pastries
          </h2>
          <p className="text-[#6B5A50] mt-3 text-base sm:text-lg font-light leading-relaxed">
            Stop by for freshly baked daily treats, pick up scheduled celebration cakes, or consult with our confectioners.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Business Details & Contact Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-[#FAF7F2] p-6 sm:p-7 rounded-2xl border border-[#EADBCE] shadow-xs space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#B87B37] flex items-center justify-center border border-[#EADBCE] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7E6F65]">
                    Bakery Address
                  </h4>
                  <p className="text-base font-semibold text-[#241A15] mt-1 leading-snug">
                    {address}
                  </p>
                  <p className="text-xs text-[#7E6F65] mt-0.5">
                    Bengaluru, Karnataka, India
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#B87B37] flex items-center justify-center border border-[#EADBCE] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7E6F65]">
                    Bakery Hours
                  </h4>
                  <p className="text-base font-semibold text-[#241A15] mt-1">
                    {openingHours}
                  </p>
                  <p className="text-xs text-[#7E6F65] mt-0.5">
                    Order Pickups: {pickupTimings}
                  </p>
                </div>
              </div>

              {/* Direct Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#B87B37] flex items-center justify-center border border-[#EADBCE] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7E6F65]">
                    Direct Phone Line
                  </h4>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-base font-semibold text-[#241A15] hover:text-[#B87B37] transition-colors mt-1 block"
                  >
                    {phone}
                  </a>
                  <p className="text-xs text-[#7E6F65] mt-0.5">
                    For orders, queries and party requirements
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-[#241A15] text-[#FAF7F2] hover:bg-[#382B23] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#D29C5B]" />
                <span>Get Directions</span>
              </a>

              <a
                href={`tel:${cleanPhone}`}
                className="p-3.5 rounded-xl bg-white border border-[#EADBCE] text-[#241A15] hover:bg-[#FAF7F2] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4 text-[#B87B37]" />
                <span>Call Bakery</span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                  'Hello Amma Pastries Karnataka! I would like to inquire about fresh celebration cakes.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="lg:col-span-7 bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#EADBCE] shadow-xs min-h-[360px] relative">
            <iframe
              src={mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Amma Pastries Google Maps Location"
              className="w-full h-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
