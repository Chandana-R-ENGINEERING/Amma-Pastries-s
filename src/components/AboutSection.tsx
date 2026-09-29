import React from 'react';
import { Heart, Sparkles, Coffee, ShieldCheck, Check } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#EADBCE] bg-white p-2">
              <div className="aspect-4/3 sm:aspect-5/4 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1000&q=80"
                  alt="Amma Pastries Karnataka warm bakery atmosphere"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Accent Floating Card */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-4 rounded-xl border border-[#EADBCE] shadow-md max-w-xs hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#B87B37] flex items-center justify-center shrink-0 border border-[#EADBCE]">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#241A15]">Baking for Bengaluru</div>
                  <div className="text-[11px] text-[#7E6F65]">Everyday joy & milestones</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Factual & Warm Brand Story */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B87B37]">
              <span>Our Philosophy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241A15] tracking-tight leading-[1.15]">
              Baked With The Warmth Of Home.
            </h2>

            <div className="space-y-4 text-base text-[#523F34] font-light leading-relaxed">
              <p>
                At <strong>Amma Pastries Karnataka</strong>, we believe every dessert table tells a story. From a cheerful child’s birthday party to a quiet afternoon slice enjoyed with family, our kitchen exists to turn simple moments into sweet celebrations.
              </p>
              <p>
                We start before sunrise, whisking pure dairy cream, balancing delicate cocoa notes, and stewing fresh seasonal fruit fillings. Every cake, bento box, pastry slice, and hot savory puff is prepared with genuine care, ensuring consistent quality, balanced sweetness, and honest bakery flavors.
              </p>
              <p>
                Whether you drop in for your favorite Black Forest pastry or collaborate with us on a custom tiered celebration cake, you will always be greeted with the comforting warmth of a neighborhood bakery that cares about your special day.
              </p>
            </div>

            {/* Core Values / Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EADBCE]">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#241A15]">Fresh Daily Batches</h4>
                  <p className="text-xs text-[#7E6F65] mt-0.5">
                    Oven-fresh sponges, never stale or pre-frozen.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#241A15]">Vegetarian & Eggless Focus</h4>
                  <p className="text-xs text-[#7E6F65] mt-0.5">
                    Thoughtful options tailored for every family tradition.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#241A15]">Celebration Craftsmanship</h4>
                  <p className="text-xs text-[#7E6F65] mt-0.5">
                    Custom piping, personalized messages, and curated themes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#241A15]">Welcoming Hospitality</h4>
                  <p className="text-xs text-[#7E6F65] mt-0.5">
                    Friendly service and punctual pickup coordination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
