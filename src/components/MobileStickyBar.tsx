import React from 'react';
import { Phone, Calendar, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BusinessSettings } from '../types';

interface MobileStickyBarProps {
  settings: BusinessSettings | null;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ settings }) => {
  const { openOrderScheduler, totalItemCount, setIsCartOpen } = useCart();
  const phone = settings?.phone || '+91 98800 23456';
  const cleanPhone = phone.replace(/\s+/g, '');

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EADBCE] p-2.5 px-4 shadow-lg flex items-center gap-3">
      {/* Call Button */}
      <a
        href={`tel:${cleanPhone}`}
        className="flex-1 py-3 px-3 rounded-xl bg-white border border-[#EADBCE] text-[#241A15] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs"
      >
        <Phone className="w-3.5 h-3.5 text-[#B87B37]" />
        <span>Call Bakery</span>
      </a>

      {/* Cart Quick Trigger if items exist */}
      {totalItemCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative p-3 rounded-xl bg-[#FAF7F2] border border-[#EADBCE] text-[#241A15] flex items-center justify-center"
          aria-label="View Cart"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 bg-[#B87B37] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {totalItemCount}
          </span>
        </button>
      )}

      {/* Primary Order / Book Now Button */}
      <button
        onClick={() => openOrderScheduler('Regular Cake Order')}
        className="flex-2 py-3 px-4 rounded-xl bg-[#241A15] text-[#FAF7F2] font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
      >
        <Calendar className="w-3.5 h-3.5 text-[#D29C5B]" />
        <span>Order / Book Now</span>
      </button>
    </div>
  );
};
