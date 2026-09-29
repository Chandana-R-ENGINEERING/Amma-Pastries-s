import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  Cake,
  X,
  FileImage,
} from 'lucide-react';
import { CelebrationType } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CELEBRATION_TYPES: CelebrationType[] = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Engagement',
  'Baby Celebration',
  'Graduation',
  'Corporate',
  'Other',
];

const FLAVOUR_OPTIONS = [
  'Pure Dark Belgian Truffle',
  'Classic Black Forest with Cherries',
  'Butterscotch Praline Crunch',
  'Blueberry Cream Cheese Velvet',
  'Fresh Fruit Forest Vanilla',
  'Royal Red Velvet with Cheese Frosting',
  'White Forest Raspberry Swirl',
  'Rich Almond Hazelnut Ganache',
  'Pineapple Passion Custard',
  'Custom Baker Recommendation',
];

const SIZE_OPTIONS = [
  '0.5 kg (4-5 Servings)',
  '1 kg (8-10 Servings)',
  '1.5 kg (12-15 Servings)',
  '2 kg (18-20 Servings)',
  '3 kg (Double Tier - 25+ Servings)',
  '4 kg (Double Tier - 35+ Servings)',
  '5+ kg (Grand 3-Tier Wedding Cake)',
];

const SHAPE_OPTIONS = ['Classic Round', 'Romantic Heart', 'Modern Square', 'Tiered Architecture'];

export const CustomCakeBuilder: React.FC = () => {
  const { user } = useAuth();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [celebrationType, setCelebrationType] = useState<CelebrationType>('Birthday');
  const [cakeFlavour, setCakeFlavour] = useState(FLAVOUR_OPTIONS[0]);
  const [cakeSize, setCakeSize] = useState(SIZE_OPTIONS[1]);
  const [cakeShape, setCakeShape] = useState(SHAPE_OPTIONS[0]);
  const [isEggless, setIsEggless] = useState(true);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('04:00 PM – 06:00 PM');
  const [messageOnCake, setMessageOnCake] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-fill if user logged in
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!phone) setPhone(user.phone);
      if (!email) setEmail(user.email);
      if (user.dietaryPreference?.toLowerCase().includes('eggless')) {
        setIsEggless(true);
      }
    }
  }, [user]);

  // Set default min date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setReferenceImageUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !phone.trim() || !preferredDate) {
      setErrorMessage('Please fill in your name, contact phone, and celebration date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.createCustomCake({
        userId: user?.id || null,
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
        },
        celebrationType,
        cakeFlavour,
        cakeSize,
        cakeShape,
        isEggless,
        preferredDate,
        preferredTime,
        messageOnCake: messageOnCake.trim(),
        specialInstructions: specialInstructions.trim(),
        referenceImageUrl: referenceImageUrl || undefined,
      });

      setSubmittedId(res.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit custom cake enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedId(null);
    setMessageOnCake('');
    setSpecialInstructions('');
    setImagePreview(null);
    setReferenceImageUrl('');
  };

  return (
    <section id="custom-cakes" className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#EADBCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B87B37] mb-2">
            <Cake className="w-4 h-4" />
            <span>Bespoke Celebration Studio</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241A15] tracking-tight">
            Create Your Celebration Cake
          </h2>
          <p className="text-[#6B5A50] mt-3 text-base sm:text-lg font-light leading-relaxed">
            From two-tier floral engagement cakes to character birthday themes and intimate anniversaries. Share your vision and our master confectioners will bring it to life.
          </p>
        </div>

        {/* Confirmation Screen on Success */}
        {submittedId ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 sm:p-10 border border-[#EADBCE] shadow-sm text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B87B37] mb-1">
              Enquiry Received
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#241A15]">
              Thank You, {name}!
            </h3>

            <div className="my-6 p-4 rounded-xl bg-[#FAF7F2] border border-[#EADBCE] text-left space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#7E6F65]">Enquiry Reference:</span>
                <span className="font-mono font-bold text-base text-[#241A15]">
                  {submittedId}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#7E6F65]">Celebration:</span>
                <span className="font-semibold text-[#241A15]">{celebrationType}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#7E6F65]">Flavour & Size:</span>
                <span className="font-semibold text-[#241A15]">
                  {cakeFlavour} ({cakeSize})
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#7E6F65]">Pickup Schedule:</span>
                <span className="font-semibold text-[#241A15]">
                  {preferredDate} · {preferredTime}
                </span>
              </div>
            </div>

            <div className="text-sm text-[#6B5A50] leading-relaxed mb-8">
              <p>
                Our head pastry chef at Amma Pastries Bengaluru is reviewing your requirements. We will contact you at{' '}
                <strong className="text-[#241A15]">{phone}</strong> within 2 hours to confirm your custom design and quote.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/919880023456?text=${encodeURIComponent(
                  `Hi Amma Pastries! I just submitted custom cake enquiry ${submittedId} for ${name} (${celebrationType} on ${preferredDate}). Looking forward to your quote!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Update</span>
              </a>

              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#FAF7F2] hover:bg-[#EADBCE] text-[#241A15] font-semibold text-sm transition-colors border border-[#EADBCE]"
              >
                Submit Another Cake Idea
              </button>
            </div>
          </div>
        ) : (
          /* Custom Cake Interactive Form */
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-[#EADBCE] shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Step 1: Celebration & Style */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#241A15] text-[#FAF7F2] text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#241A15]">
                    Celebration & Cake Style
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {CELEBRATION_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCelebrationType(type)}
                      className={`p-3 rounded-xl border text-sm font-semibold text-center transition-all cursor-pointer ${
                        celebrationType === type
                          ? 'border-[#241A15] bg-[#241A15] text-[#FAF7F2]'
                          : 'border-[#EADBCE] bg-[#FAF7F2] text-[#4A3B32] hover:bg-[#F0E8DC]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Flavour */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1.5">
                      Flavour
                    </label>
                    <select
                      value={cakeFlavour}
                      onChange={(e) => setCakeFlavour(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    >
                      {FLAVOUR_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1.5">
                      Estimated Weight / Size
                    </label>
                    <select
                      value={cakeSize}
                      onChange={(e) => setCakeSize(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    >
                      {SIZE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Shape */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1.5">
                      Cake Shape
                    </label>
                    <select
                      value={cakeShape}
                      onChange={(e) => setCakeShape(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    >
                      {SHAPE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Eggless Preference Checkbox */}
                <div className="mt-4 p-3 rounded-lg bg-[#FAF7F2] border border-[#EADBCE]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEggless}
                      onChange={(e) => setIsEggless(e.target.checked)}
                      className="w-4 h-4 accent-[#B87B37] rounded"
                    />
                    <div className="text-xs text-[#241A15] font-medium flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded border border-emerald-600 p-0.5 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      </div>
                      <span>Please bake as 100% Eggless Pure Vegetarian</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 2: Date & Pickup Schedule */}
              <div className="pt-6 border-t border-[#EADBCE]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#241A15] text-[#FAF7F2] text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#241A15]">
                    Pickup Date & Timing
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1.5">
                      Preferred Date (Min 24 Hours Notice) *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#7E6F65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        min={minDate}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1.5">
                      Preferred Pickup Time Window *
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-[#7E6F65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                      >
                        <option value="10:00 AM – 12:00 PM">10:00 AM – 12:00 PM</option>
                        <option value="12:00 PM – 02:00 PM">12:00 PM – 02:00 PM</option>
                        <option value="02:00 PM – 04:00 PM">02:00 PM – 04:00 PM</option>
                        <option value="04:00 PM – 06:00 PM">04:00 PM – 06:00 PM</option>
                        <option value="06:00 PM – 08:00 PM">06:00 PM – 08:00 PM</option>
                        <option value="08:00 PM – 09:30 PM">08:00 PM – 09:30 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Customization Details & Reference Photo */}
              <div className="pt-6 border-t border-[#EADBCE]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#241A15] text-[#FAF7F2] text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#241A15]">
                    Piping Text & Reference Photo
                  </h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1.5">
                      Message / Name to Pipe on Cake
                    </label>
                    <input
                      type="text"
                      value={messageOnCake}
                      onChange={(e) => setMessageOnCake(e.target.value)}
                      placeholder="e.g. Happy 1st Birthday Samarth!"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1.5">
                      Design Notes & Special Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Describe preferred colors, themes (e.g. superhero, pastel floral, gold foil, vintage piping), allergy warnings..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none resize-none"
                    />
                  </div>

                  {/* Reference Image Upload */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1.5">
                      Reference Photo (Optional)
                    </label>
                    {imagePreview ? (
                      <div className="relative inline-block border border-[#EADBCE] rounded-xl overflow-hidden bg-white p-2">
                        <img
                          src={imagePreview}
                          alt="Cake reference preview"
                          className="h-32 w-auto object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setReferenceImageUrl('');
                          }}
                          className="absolute top-3 right-3 p-1 rounded-full bg-red-600 text-white shadow-xs hover:bg-red-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#D8CCC0] rounded-xl bg-[#FAF7F2] hover:bg-[#F0E8DC] transition-colors cursor-pointer text-center">
                        <Upload className="w-7 h-7 text-[#B87B37] mb-2" />
                        <span className="text-sm font-semibold text-[#241A15]">
                          Click to upload inspiration image
                        </span>
                        <span className="text-xs text-[#7E6F65] mt-0.5">
                          PNG, JPG or WEBP (Max 8MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 4: Contact Information */}
              <div className="pt-6 border-t border-[#EADBCE]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#241A15] text-[#FAF7F2] text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#241A15]">
                    Your Contact Details
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1.5">
                      Phone Number (For WhatsApp Quote) *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="e.g. +91 98450 12345"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. priya@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-6 border-t border-[#EADBCE] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#7E6F65] text-left">
                  <span>No upfront payment required for custom inquiry. We quote after reviewing design.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#241A15] text-[#FAF7F2] hover:bg-[#382B23] font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#D29C5B]" />
                  <span>{isSubmitting ? 'Submitting Design...' : 'Request Custom Cake'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
