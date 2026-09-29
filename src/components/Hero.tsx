import React from 'react';
import { ArrowRight, Sparkles, Clock, ShieldCheck, Heart, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

interface HeroProps {
  onExploreMenu: () => void;
  onOrderCake: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onOrderCake }) => {
  const { openOrderScheduler } = useCart();

  const handleOrderCake = () => {
    openOrderScheduler('Regular Cake Order');
    if (onOrderCake) onOrderCake();
  };

  return (
    <section id="hero" className="relative bg-[#FAF7F2] overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24 border-b border-[#EADBCE]">
      {/* Subtle warm luxury background illumination */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#EAD7C5]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#F4EFE6]/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust statement (clean unboxed text with typographic separator) */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B87B37]">
              <span>Freshly baked</span>
              <span aria-hidden="true" className="text-[#D8CCC0]">·</span>
              <span>Made for celebrations</span>
              <span aria-hidden="true" className="text-[#D8CCC0]">·</span>
              <span>Bengaluru</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#241A15] leading-[1.12] tracking-tight">
              Made With Love. <br />
              <span className="italic font-normal text-[#B87B37]">Baked For Every</span> Celebration.
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-[#6B5A50] max-w-2xl font-light leading-relaxed">
              Fresh cakes, pastries and sweet moments crafted for everyday cravings and unforgettable celebrations.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreMenu}
                className="px-7 py-3.5 rounded-lg bg-[#241A15] text-[#FAF7F2] hover:bg-[#382B23] font-semibold text-base shadow-sm hover:shadow transition-all flex items-center gap-2.5 cursor-pointer group"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-4 h-4 text-[#D29C5B] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleOrderCake}
                className="px-7 py-3.5 rounded-lg bg-[#FFFFFF] text-[#241A15] hover:bg-[#F4EFE6] border border-[#D8CCC0] font-semibold text-base transition-colors shadow-xs cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#B87B37]" />
                <span>Order a Cake</span>
              </button>
            </div>

            {/* Value Highlights (clean unboxed stats / cues) */}
            <div className="pt-8 border-t border-[#EADBCE] grid grid-cols-3 gap-6 text-left">
              <div>
                <div className="font-serif text-2xl font-bold text-[#241A15]">100%</div>
                <div className="text-xs text-[#7E6F65] mt-0.5">Fresh daily bakes</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-[#241A15]">Eggless</div>
                <div className="text-xs text-[#7E6F65] mt-0.5">Options across all flavors</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-[#241A15]">2 Hours</div>
                <div className="text-xs text-[#7E6F65] mt-0.5">Fast celebration pickup</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#EADBCE] bg-white p-2">
                <div className="relative rounded-xl overflow-hidden aspect-4/3 sm:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85"
                    alt="Signature Amma Pastries Belgian Chocolate Celebration Cake"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    loading="eager"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Floating card at bottom */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#FAF7F2]/95 backdrop-blur-md border border-[#EADBCE] shadow-lg flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B87B37]">
                        Chef's Masterpiece
                      </span>
                      <h4 className="font-serif text-base font-bold text-[#241A15]">
                        Pure Chocolate Truffle
                      </h4>
                      <p className="text-xs text-[#7E6F65]">
                        Fresh Belgian ganache & dark cocoa
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#7E6F65] block">Starting from</span>
                      <span className="font-serif font-bold text-lg text-[#241A15]">₹550</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative side badge */}
              <div className="absolute -top-4 -left-4 bg-[#241A15] text-[#FAF7F2] p-3 rounded-xl shadow-lg border border-[#D29C5B]/40 hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#B87B37] flex items-center justify-center text-white">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Bengaluru's Choice</div>
                  <div className="text-[10px] text-[#D8CCC0]">Handcrafted with love</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
