import React from 'react';
import { Star, CheckCircle, MessageSquareQuote, Plus } from 'lucide-react';
import { Review } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
  onOpenAdmin: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onOpenAdmin }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B87B37] mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241A15] tracking-tight">
            Celebrated by Bengaluru
          </h2>
          <p className="text-[#6B5A50] mt-3 text-base sm:text-lg font-light leading-relaxed">
            Real experiences from families and celebration hosts across Karnataka.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="max-w-lg mx-auto p-8 rounded-2xl bg-white border border-[#EADBCE] text-center space-y-3">
            <MessageSquareQuote className="w-10 h-10 text-[#B87B37] mx-auto opacity-60" />
            <h3 className="font-serif text-xl font-bold text-[#241A15]">
              Verified Reviews Portal
            </h3>
            <p className="text-xs text-[#7E6F65]">
              Only genuine, verified customer reviews are published here. The business owner can sync or add verified Google Maps reviews from the portal.
            </p>
            <button
              onClick={onOpenAdmin}
              className="mt-2 px-4 py-2 rounded-lg bg-[#241A15] text-[#FAF7F2] text-xs font-semibold"
            >
              Add Verified Review (Owner Portal)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EADBCE] shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars & Verified tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-[#4A3B32] font-light leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Reviewer Details */}
                <div className="pt-4 border-t border-[#F4EFE6] mt-6 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-serif font-bold text-[#241A15] text-sm">
                      {rev.name}
                    </div>
                    <div className="text-[11px] text-[#7E6F65] mt-0.5">
                      {rev.source} · {rev.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
