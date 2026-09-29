import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Star, Check, Sparkles } from 'lucide-react';
import { Product, Category, CategoryId } from '../types';
import { handleImageError } from '../utils/imageFallback';

interface MenuSectionProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  products,
  categories,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [egglessOnly, setEgglessOnly] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category check
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Eggless / Veg check
      if (egglessOnly && !p.isVeg && !p.isEgglessAvailable) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [products, selectedCategory, egglessOnly, searchQuery]);

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B87B37] mb-2">
            <span>Fresh Bengaluru Bakery</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241A15] tracking-tight">
            Our Bakery Menu
          </h2>
          <p className="text-[#6B5A50] mt-3 text-base sm:text-lg font-light leading-relaxed">
            Every cake and pastry is crafted fresh each morning using premium dairy, natural extracts, and handcrafted fillings.
          </p>
        </div>

        {/* Filter Controls: Tabs + Search + Eggless Toggle */}
        <div className="space-y-6 mb-12">
          {/* Category Filter Tabs (Clean segmented buttons, NO decorative pills) */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-none gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#241A15] text-[#FAF7F2] shadow-xs'
                  : 'bg-white text-[#4A3B32] border border-[#EADBCE] hover:bg-[#F4EFE6]'
              }`}
            >
              All Items ({products.length})
            </button>

            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.id).length;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#241A15] text-[#FAF7F2] shadow-xs'
                      : 'bg-white text-[#4A3B32] border border-[#EADBCE] hover:bg-[#F4EFE6]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-xs opacity-75 ${
                      isActive ? 'text-[#D29C5B]' : 'text-[#7E6F65]'
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar & Eggless toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto bg-white p-3 rounded-xl border border-[#EADBCE] shadow-xs">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-[#7E6F65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Black Forest, Bento Cakes, Veg Puff, Truffle..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-transparent rounded-lg border-0 focus:ring-2 focus:ring-[#B87B37]/30 text-[#241A15] placeholder-[#A8988B] outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7E6F65] hover:text-[#241A15]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Eggless / Veg Filter Toggle */}
            <div className="flex items-center justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[#EADBCE] sm:pl-4">
              <label
                htmlFor="eggless-filter"
                className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#241A15] cursor-pointer select-none"
              >
                <div className="w-4 h-4 rounded border border-emerald-600 p-0.5 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                </div>
                <span>Eggless / Pure Veg Only</span>
                <input
                  id="eggless-filter"
                  type="checkbox"
                  checked={egglessOnly}
                  onChange={(e) => setEgglessOnly(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    egglessOnly ? 'bg-emerald-600' : 'bg-neutral-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      egglessOnly ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-[#EADBCE] max-w-lg mx-auto p-8">
            <Sparkles className="w-10 h-10 text-[#B87B37] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-[#241A15]">
              No treats matched your filter
            </h3>
            <p className="text-sm text-[#7E6F65] mt-1">
              Try adjusting your search keyword or clearing the eggless-only filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setEgglessOnly(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-[#241A15] text-[#FAF7F2]"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const minPrice = Math.min(...product.sizes.map((s) => s.price));
            const sizesString = product.sizes.map((s) => s.size).join(', ');

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-[#EADBCE] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#FAF7F2]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={handleImageError}
                    />

                    {/* Dietary indicator */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/95 backdrop-blur-xs text-[11px] font-medium text-[#241A15] shadow-xs">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          product.isVeg ? 'bg-emerald-500' : 'bg-amber-600'
                        }`}
                      />
                      <span>
                        {product.isVeg
                          ? 'Pure Veg'
                          : product.isEgglessAvailable
                          ? 'Eggless Option'
                          : 'Standard'}
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-xs font-semibold">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-[10px] text-neutral-300">
                        ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-[11px] text-[#7E6F65] uppercase tracking-wider mb-1">
                      <span>{product.category.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate max-w-[140px]">{sizesString}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#241A15] group-hover:text-[#B87B37] transition-colors leading-snug">
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#6B5A50] mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Price and Action Button */}
                <div className="p-5 pt-0 border-t border-[#F4EFE6] mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#7E6F65] uppercase tracking-wider block">
                      Price
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif font-bold text-lg text-[#241A15]">
                        ₹{minPrice}
                      </span>
                      {product.sizes.length > 1 && (
                        <span className="text-[11px] text-[#7E6F65]">onwards</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectProduct(product)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#241A15] text-[#FAF7F2] hover:bg-[#B87B37] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Customize & Add</span>
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
