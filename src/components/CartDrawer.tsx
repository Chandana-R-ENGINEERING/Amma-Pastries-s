import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    totalAmount,
    totalItemCount,
    openOrderScheduler,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-[#FAF7F2] w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#EADBCE] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 bg-white border-b border-[#EADBCE] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#241A15] text-[#D29C5B] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#241A15]">
                Your Bakery Basket
              </h3>
              <span className="text-xs text-[#7E6F65]">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#7E6F65] hover:text-[#241A15] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-[#7E6F65] space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-[#D8CCC0]" />
              <p className="text-base font-serif font-bold text-[#241A15]">
                Your basket is empty
              </p>
              <p className="text-xs max-w-xs mx-auto">
                Explore our fresh cakes, pastries, bento boxes and snacks to begin your celebration order.
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-[#EADBCE] shadow-xs space-y-3"
              >
                <div className="flex gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg shrink-0"
                      onError={handleImageError}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif text-sm font-bold text-[#241A15] truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-[#7E6F65] hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-[#7E6F65] mt-0.5">
                      Size: <strong className="text-[#241A15]">{item.size}</strong>
                      {item.isEggless && (
                        <span className="text-emerald-700 ml-2 font-medium">· Eggless</span>
                      )}
                    </div>

                    {item.messageOnCake && (
                      <div className="text-[11px] text-[#7E6F65] italic mt-1 line-clamp-1">
                        Piping: "{item.messageOnCake}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#FAF7F2] flex items-center justify-between">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#EADBCE] rounded-lg p-0.5 bg-[#FAF7F2]">
                    <button
                      onClick={() => updateQuantity(idx, item.quantity - 1)}
                      className="p-1 rounded text-[#7E6F65] hover:text-[#241A15]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#241A15]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(idx, item.quantity + 1)}
                      className="p-1 rounded text-[#7E6F65] hover:text-[#241A15]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-serif font-bold text-sm text-[#241A15]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-[#EADBCE] space-y-4">
            <div className="space-y-1.5 text-xs text-[#7E6F65]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#241A15]">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Bakery Packaging & Box:</span>
                <span className="text-emerald-700 font-medium">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#241A15] pt-2 border-t border-[#FAF7F2]">
                <span>Total Amount:</span>
                <span className="font-serif text-lg text-[#B87B37]">₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                openOrderScheduler('Regular Cake Order');
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#241A15] text-[#FAF7F2] hover:bg-[#382B23] font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Schedule Pickup & Place Order</span>
              <ArrowRight className="w-4 h-4 text-[#D29C5B]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
