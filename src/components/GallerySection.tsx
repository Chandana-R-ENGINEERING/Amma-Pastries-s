import React, { useState } from 'react';
import { Camera, X, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../types';
import { handleImageError } from '../utils/imageFallback';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

const GALLERY_CATEGORIES = [
  'All',
  'Cakes',
  'Pastries',
  'Custom Cakes',
  'Celebrations',
  'Bakery',
  'Store',
];

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const filteredPhotos =
    selectedCat === 'All'
      ? galleryItems
      : galleryItems.filter(
          (item) => item.category.toLowerCase() === selectedCat.toLowerCase()
        );

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B87B37] mb-2">
            <Camera className="w-4 h-4" />
            <span>Behind The Oven</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241A15] tracking-tight">
            Our Celebration Gallery
          </h2>
          <p className="text-[#6B5A50] mt-3 text-base sm:text-lg font-light leading-relaxed">
            A glimpse into the daily life of Amma Pastries Karnataka — authentic celebration bakes, pastry artistry, and joyous moments from our Bengaluru kitchen.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 mb-10 scrollbar-none">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCat === cat
                  ? 'bg-[#241A15] text-[#FAF7F2] shadow-xs'
                  : 'bg-white text-[#4A3B32] border border-[#EADBCE] hover:bg-[#F4EFE6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Display */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="break-inside-avoid relative rounded-xl overflow-hidden bg-white border border-[#EADBCE] shadow-xs hover:shadow-md transition-all group cursor-pointer"
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D29C5B]">
                  {photo.category}
                </span>
                <h4 className="font-serif text-base font-bold leading-tight mt-0.5">
                  {photo.title}
                </h4>
                <p className="text-xs text-neutral-200 mt-1 line-clamp-2">
                  {photo.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative max-w-3xl w-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#EADBCE] shadow-2xl">
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#241A15] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-16/10 max-h-[70vh] bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="max-h-full max-w-full object-contain"
                  onError={handleImageError}
                />
              </div>

              <div className="p-6 bg-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#B87B37] uppercase tracking-wider mb-1">
                  <span>{activePhoto.category}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#241A15]">
                  {activePhoto.title}
                </h3>
                <p className="text-sm text-[#6B5A50] mt-2 leading-relaxed">
                  {activePhoto.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
