import React from 'react';
import { Sparkles, HeartHandshake, ShieldCheck, Clock, Award, Leaf } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B87B37] mb-2">
            <Sparkles className="w-4 h-4" />
            <span>The Amma Pastries Standard</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#241A15] tracking-tight">
            Why Bengaluru Celebrates With Us
          </h2>
          <p className="text-[#6B5A50] mt-2.5 text-sm sm:text-base font-light leading-relaxed">
            Consistent oven-fresh quality, genuine warm hospitality, and recipes crafted specifically for your joyous milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] space-y-3">
            <div className="w-11 h-11 rounded-xl bg-white text-[#B87B37] flex items-center justify-center border border-[#EADBCE] shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#241A15]">
              Daily Morning Bakes
            </h3>
            <p className="text-xs text-[#6B5A50] leading-relaxed">
              Every cake base, cream layer, and savory puff is made fresh each morning. Never frozen or pre-packaged.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] space-y-3">
            <div className="w-11 h-11 rounded-xl bg-white text-emerald-600 flex items-center justify-center border border-[#EADBCE] shadow-xs">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#241A15]">
              Pure Eggless Expertise
            </h3>
            <p className="text-xs text-[#6B5A50] leading-relaxed">
              Extensive vegetarian bakery line. 100% eggless cakes baked with tender crumb and dairy fresh creams.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] space-y-3">
            <div className="w-11 h-11 rounded-xl bg-white text-[#B87B37] flex items-center justify-center border border-[#EADBCE] shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#241A15]">
              Bespoke Celebration Studio
            </h3>
            <p className="text-xs text-[#6B5A50] leading-relaxed">
              Upload your inspiration photo. Our chefs pipe custom greetings, theme figurines, and elegant tiered layers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EADBCE] space-y-3">
            <div className="w-11 h-11 rounded-xl bg-white text-[#B87B37] flex items-center justify-center border border-[#EADBCE] shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#241A15]">
              Punctual Pickup Scheduling
            </h3>
            <p className="text-xs text-[#6B5A50] leading-relaxed">
              Choose your preferred date and 2-hour window. Your cake is chilled, carefully packaged, and ready right on time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
