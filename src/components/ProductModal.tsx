import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { Product, SizeOption } from '../types';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [isEggless, setIsEggless] = useState(false);
  const [messageOnCake, setMessageOnCake] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || null);
      setIsEggless(product.isVeg || product.isEgglessAvailable);
      setMessageOnCake('');
      setSpecialNotes('');
      setQuantity(1);
    }
  }, [product]);

  if (!product || !selectedSize) return null;

  const currentPrice = selectedSize.price * quantity;
  const isCakeCategory = product.category === 'cakes' || product.category === 'special_cakes';

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      size: selectedSize.size,
      price: selectedSize.price,
      quantity,
      isEggless,
      messageOnCake: messageOnCake.trim(),
      specialNotes: specialNotes.trim(),
      image: product.image,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-3xl w-full border border-[#EADBCE] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-[#241A15] shadow-md transition-colors cursor-pointer border border-[#EADBCE]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[88vh] overflow-y-auto">
          {/* Product Image Column: constrained so it doesn't overpower the customization controls */}
          <div className="md:col-span-5 bg-white relative border-b md:border-b-0 md:border-r border-[#EADBCE] flex flex-col justify-center items-center p-4 md:p-6">
            <div className="w-full max-w-[260px] md:max-w-full aspect-square rounded-xl overflow-hidden shadow-inner bg-[#FAF7F2] relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-[#241A15] shadow-xs">
                <span className="capitalize">{product.category.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Quick dietary info under photo on desktop */}
            <div className="mt-3 hidden md:flex items-center gap-2 text-xs text-[#7E6F65]">
              <span className={`w-2 h-2 rounded-full ${product.isVeg ? 'bg-emerald-500' : 'bg-amber-600'}`} />
              <span>
                {product.isVeg ? '100% Pure Vegetarian' : product.isEgglessAvailable ? 'Eggless Option Available' : 'Contains Egg'}
              </span>
            </div>
          </div>

          {/* Details & Customization Column */}
          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-5 bg-[#FAF7F2]">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#7E6F65] mb-1">
                  <span className="capitalize font-semibold text-[#B87B37]">{product.category.replace('_', ' ')}</span>
                  <span>·</span>
                  <span>Amma Pastries Signature</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#241A15] leading-tight">
                  {product.name}
                </h3>
                <p className="text-xs text-[#6B5A50] mt-1.5 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* 1. Size Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-2">
                  Select Size / Portion:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        selectedSize.size === s.size
                          ? 'border-[#241A15] bg-[#241A15] text-[#FAF7F2] shadow-sm'
                          : 'border-[#EADBCE] bg-white text-[#241A15] hover:bg-[#F4EFE6]'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.size}</div>
                      <div
                        className={`text-xs mt-0.5 font-semibold ${
                          selectedSize.size === s.size ? 'text-[#D29C5B]' : 'text-[#7E6F65]'
                        }`}
                      >
                        ₹{s.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Eggless Preference */}
              {product.isEgglessAvailable && (
                <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-[#EADBCE]">
                  <label className="flex items-center justify-between cursor-pointer select-none">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded border border-emerald-600 p-0.5 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      </div>
                      <span className="text-xs font-semibold text-[#241A15]">
                        Bake as 100% Eggless
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isEggless}
                      onChange={(e) => setIsEggless(e.target.checked)}
                      className="w-4 h-4 accent-[#B87B37] rounded cursor-pointer"
                    />
                  </label>
                </div>
              )}

              {/* 3. Message on Cake (if cake category) */}
              {isCakeCategory && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                    Message on Cake (Complimentary Piping):
                  </label>
                  <input
                    type="text"
                    value={messageOnCake}
                    onChange={(e) => setMessageOnCake(e.target.value)}
                    maxLength={40}
                    placeholder="e.g. Happy Birthday Arjun! (Max 40 chars)"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#EADBCE] focus:border-[#B87B37] outline-none text-[#241A15]"
                  />
                </div>
              )}

              {/* 4. Special Instructions */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                  Special Notes:
                </label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Less sugar, birthday candles, cut into 12 slices..."
                  className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-[#EADBCE] focus:border-[#B87B37] outline-none text-[#241A15]"
                />
              </div>
            </div>

            {/* Bottom: Quantity Stepper & Add Button */}
            <div className="pt-4 border-t border-[#EADBCE] flex items-center justify-between gap-3 sm:gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-[#EADBCE] bg-white rounded-lg p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 rounded text-[#7E6F65] hover:text-[#241A15] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center text-sm font-semibold text-[#241A15]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 rounded text-[#7E6F65] hover:text-[#241A15] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 sm:px-5 rounded-lg bg-[#241A15] text-[#FAF7F2] hover:bg-[#382B23] font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-between cursor-pointer"
              >
                <span>Add to Order</span>
                <span className="font-serif text-sm sm:text-base text-[#D29C5B]">
                  ₹{currentPrice}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
