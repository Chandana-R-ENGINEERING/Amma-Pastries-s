import React from 'react';

// Reliable, high-resolution Unsplash food photography fallbacks
export const DEFAULT_CAKE_IMAGE =
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80';

export const DEFAULT_PASTRY_IMAGE =
  'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80';

export const DEFAULT_SNACK_IMAGE =
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80';

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback = DEFAULT_CAKE_IMAGE
) => {
  const target = e.currentTarget;
  if (target.src !== fallback) {
    target.onerror = null; // prevents infinite loop if fallback fails
    target.src = fallback;
  }
};
