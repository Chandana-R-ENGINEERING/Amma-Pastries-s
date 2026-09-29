import React from 'react';
import { Star, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { handleImageError } from '../utils/imageFallback';

interface FeaturedProductsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAllMenu: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onSelectProduct,
  onViewAllMenu,
}) => {
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B87B37] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Bengaluru's Most Loved</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#241A15] tracking-tight">
              Featured Celebration Treats
            </h2>
            <p className="text-[#6B5A50] mt-2 max-w-xl text-sm sm:text-base">
              Time-honored recipes baked with pure cream, rich Belgian couverture, and Karnataka farm-fresh ingredients.
            </p>
          </div>
          <button
            onClick={onViewAllMenu}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#B87B37] hover:text-[#9E6426] transition-colors cursor-pointer group"
          >
            <span>View Full Menu & Pricing</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => {
            const minPrice = Math.min(...product.sizes.map((s) => s.price));
            const primarySize = product.sizes[0]?.size || '';

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-[#EADBCE] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image with dietary tag */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#FAF7F2]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={handleImageError}
                    />
                    
                    {/* Dietary indicator badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/90 backdrop-blur-xs text-[11px] font-medium text-[#241A15] shadow-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          product.isVeg ? 'bg-emerald-500' : 'bg-amber-600'
                        }`}
                      />
                      <span>{product.isVeg ? 'Pure Veg' : 'Egg / Eggless'}</span>
                    </div>

                    {/* Rating */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-xs font-semibold">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-xs text-[#7E6F65] mb-1">
                      <span className="capitalize">{product.category.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span>From {primarySize}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#241A15] group-hover:text-[#B87B37] transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#6B5A50] mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Footer with Price & Action */}
                <div className="p-5 pt-0 border-t border-[#F4EFE6] mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#7E6F65] uppercase tracking-wider block">
                      Starting at
                    </span>
                    <span className="font-serif font-bold text-lg text-[#241A15]">
                      ₹{minPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectProduct(product)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#241A15] text-[#FAF7F2] hover:bg-[#B87B37] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
