import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Plus,
  Minus,
} from 'lucide-react';
import { OrderType, Product, OrderItem } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { handleImageError } from '../utils/imageFallback';

const ORDER_TYPES: OrderType[] = [
  'Regular Cake Order',
  'Custom Cake',
  'Pastry / Dessert Order',
  'Celebration Order',
  'Bulk / Party Order',
];

const TIME_SLOTS = [
  '09:30 AM – 11:30 AM',
  '11:30 AM – 01:30 PM',
  '01:30 PM – 03:30 PM',
  '03:30 PM – 05:30 PM',
  '05:30 PM – 07:30 PM',
  '07:30 PM – 09:30 PM',
];

interface OrderSchedulerModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export const OrderSchedulerModal: React.FC<OrderSchedulerModalProps> = ({
  products,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const {
    items: cartItems,
    addItem,
    clearCart,
    selectedOrderType,
    setSelectedOrderType,
  } = useCart();

  // Steps: 1 to 7
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Scheduling State
  const [orderType, setOrderType] = useState<OrderType>(selectedOrderType || 'Regular Cake Order');
  const [schedulerItems, setSchedulerItems] = useState<OrderItem[]>([]);
  
  // Customization sub-state for step 3 if user selects from step 2
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [isEggless, setIsEggless] = useState(false);
  const [messageOnCake, setMessageOnCake] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Date & Time (Same-day and advance orders supported)
  const today = new Date().toISOString().split('T')[0];
  const minDate = today;

  const [pickupDate, setPickupDate] = useState(minDate);
  const [pickupTime, setPickupTime] = useState(TIME_SLOTS[2]);

  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Track previous open state to only initialize when the modal freshly opens
  const prevIsOpenRef = useRef(false);

  // Sync state ONLY when transitioning from closed to open
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      if (selectedOrderType) {
        setOrderType(selectedOrderType);
      }
      if (cartItems.length > 0) {
        setSchedulerItems([...cartItems]);
        setCurrentStep(4); // If user already built cart, jump straight to date/time step!
      } else {
        setSchedulerItems([]);
        setCurrentStep(1);
      }
      if (user) {
        setCustomerName(user.name || '');
        setCustomerPhone(user.phone || '');
        setCustomerEmail(user.email || '');
      }
      setConfirmedOrderId(null);
      setErrorMessage(null);
      setIsSubmitting(false);
      setSelectedProduct(null);
      setMessageOnCake('');
      setNotes('');
      setQuantity(1);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setCurrentStep(1);
      setConfirmedOrderId(null);
      setErrorMessage(null);
      setIsSubmitting(false);
      setSchedulerItems([]);
      setSelectedProduct(null);
      setMessageOnCake('');
      setNotes('');
      setQuantity(1);
    }, 200);
  };

  if (!isOpen) return null;

  // Calculate order total
  const orderTotal = schedulerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Add customized item from Step 3
  const handleAddCustomizedItem = () => {
    if (!selectedProduct) return;
    const sizeOpt = selectedProduct.sizes[selectedSizeIndex] || selectedProduct.sizes[0];
    const newItem: OrderItem = {
      productId: selectedProduct.id,
      name: selectedProduct.name,
      size: sizeOpt.size,
      price: sizeOpt.price,
      quantity,
      isEggless,
      messageOnCake: messageOnCake.trim(),
      specialNotes: notes.trim(),
      image: selectedProduct.image,
    };
    setSchedulerItems((prev) => [...prev, newItem]);
    setSelectedProduct(null);
    setMessageOnCake('');
    setNotes('');
    setQuantity(1);
    setCurrentStep(4); // proceed to date & time
  };

  const handleNextStep = () => {
    setErrorMessage(null);

    if (currentStep === 1) {
      if (schedulerItems.length > 0) {
        setCurrentStep(4);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (!selectedProduct && schedulerItems.length === 0) {
        setErrorMessage('Please select a product or proceed with existing items.');
        return;
      }
      if (selectedProduct) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4);
      }
    } else if (currentStep === 3) {
      handleAddCustomizedItem();
    } else if (currentStep === 4) {
      if (!pickupDate || !pickupTime) {
        setErrorMessage('Please select pickup date and time window.');
        return;
      }
      setCurrentStep(5);
    } else if (currentStep === 5) {
      if (!customerName.trim() || !customerPhone.trim()) {
        setErrorMessage('Please provide your name and phone number.');
        return;
      }
      setCurrentStep(6);
    }
  };

  const handleFinalSubmit = async () => {
    if (schedulerItems.length === 0) {
      setErrorMessage('Please add at least one bakery item.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const order = await api.createOrder({
        userId: user?.id || null,
        orderType,
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim(),
          notes: customerNotes.trim(),
        },
        items: schedulerItems,
        pickupDate,
        pickupTime,
        totalAmount: orderTotal,
      });

      setConfirmedOrderId(order.id);
      clearCart();
      setCurrentStep(7);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-2xl w-full border border-[#EADBCE] shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#EADBCE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#241A15] text-[#D29C5B] flex items-center justify-center font-bold">
              {currentStep <= 6 ? `${currentStep}/6` : '✓'}
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#B87B37] font-semibold block">
                Amma Pastries · Order Scheduling
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#241A15]">
                {currentStep === 1 && 'Step 1 — Select Order Type'}
                {currentStep === 2 && 'Step 2 — Select Bakery Product'}
                {currentStep === 3 && 'Step 3 — Customize Product'}
                {currentStep === 4 && 'Step 4 — Select Date & Time'}
                {currentStep === 5 && 'Step 5 — Customer Details'}
                {currentStep === 6 && 'Step 6 — Order Summary'}
                {currentStep === 7 && 'Step 7 — Request Received'}
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#7E6F65] hover:text-[#241A15] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: Select Order Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-[#6B5A50]">
                Choose how you would like to place your celebration order today:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ORDER_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setOrderType(type);
                      setSelectedOrderType(type);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      orderType === type
                        ? 'border-[#241A15] bg-[#241A15] text-[#FAF7F2]'
                        : 'border-[#EADBCE] bg-white text-[#241A15] hover:bg-[#F4EFE6]'
                    }`}
                  >
                    <div className="font-serif font-bold text-base">{type}</div>
                    <div
                      className={`text-xs mt-1 ${
                        orderType === type ? 'text-[#D29C5B]' : 'text-[#7E6F65]'
                      }`}
                    >
                      {type === 'Regular Cake Order' && 'Same day or advance standard menu cakes'}
                      {type === 'Custom Cake' && 'Bespoke tiered or designer celebration cakes'}
                      {type === 'Pastry / Dessert Order' && 'Pastries, macarons, jar cakes & desserts'}
                      {type === 'Celebration Order' && 'Combos with cakes, snacks & party treats'}
                      {type === 'Bulk / Party Order' && 'Large gatherings & office celebration packs'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Product */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-[#6B5A50]">
                Select an item from our Bengaluru bakery catalog:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {products.map((p) => {
                  const minPrice = Math.min(...p.sizes.map((s) => s.price));
                  const isSelected = selectedProduct?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProduct(p);
                        setSelectedSizeIndex(0);
                        setIsEggless(p.isVeg || p.isEgglessAvailable);
                      }}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#241A15] bg-[#FAF7F2] ring-2 ring-[#241A15]'
                          : 'border-[#EADBCE] bg-white hover:bg-[#F4EFE6]'
                      }`}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded-lg shrink-0"
                        onError={handleImageError}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#241A15] truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-[#7E6F65] truncate">
                          From ₹{minPrice} · {p.sizes[0]?.size}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#241A15] text-white' : 'border-neutral-300'
                        }`}
                      >
                        {isSelected && '✓'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Customize Product */}
          {currentStep === 3 && selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-[#EADBCE]">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={handleImageError}
                />
                <div>
                  <h4 className="font-serif font-bold text-base text-[#241A15]">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-xs text-[#7E6F65] line-clamp-1">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>

              {/* Size selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-2">
                  Select Size:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.sizes.map((s, idx) => (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        selectedSizeIndex === idx
                          ? 'border-[#241A15] bg-[#241A15] text-[#FAF7F2]'
                          : 'border-[#EADBCE] bg-white text-[#241A15] hover:bg-[#F4EFE6]'
                      }`}
                    >
                      <div className="text-xs font-semibold">{s.size}</div>
                      <div className="text-xs mt-0.5 text-[#D29C5B]">₹{s.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Eggless */}
              {selectedProduct.isEgglessAvailable && (
                <div className="bg-white p-3 rounded-xl border border-[#EADBCE]">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-medium text-[#241A15]">
                      Bake as 100% Eggless
                    </span>
                    <input
                      type="checkbox"
                      checked={isEggless}
                      onChange={(e) => setIsEggless(e.target.checked)}
                      className="w-4 h-4 accent-[#B87B37] rounded"
                    />
                  </label>
                </div>
              )}

              {/* Message on Cake */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                  Message on Cake:
                </label>
                <input
                  type="text"
                  value={messageOnCake}
                  onChange={(e) => setMessageOnCake(e.target.value)}
                  placeholder="e.g. Happy 30th Birthday Priya!"
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#EADBCE] focus:border-[#B87B37] outline-none"
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#EADBCE]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7E6F65]">
                  Quantity
                </span>
                <div className="flex items-center border border-[#EADBCE] rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 rounded text-[#7E6F65] hover:text-[#241A15]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#241A15]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 rounded text-[#7E6F65] hover:text-[#241A15]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Date & Time */}
          {currentStep === 4 && (
            <div className="space-y-5">
              {/* Items in order check */}
              {schedulerItems.length > 0 && (
                <div className="bg-white p-3 rounded-xl border border-[#EADBCE] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#7E6F65]">
                      Items in Order ({schedulerItems.length})
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-semibold text-[#B87B37] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add more cakes/pastries</span>
                    </button>
                  </div>
                  {schedulerItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-[#FAF7F2] last:border-0"
                    >
                      <div>
                        <span className="font-semibold text-[#241A15]">
                          {item.quantity}x {item.name}
                        </span>{' '}
                        <span className="text-[#7E6F65]">({item.size})</span>
                      </div>
                      <span className="font-bold text-[#241A15]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1.5">
                  Select Pickup Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#7E6F65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    min={minDate}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                  />
                </div>
                <span className="text-[11px] text-[#7E6F65] mt-1 block">
                  Past dates cannot be selected to ensure fresh bake preparation.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-2">
                  Select Preferred Pickup Time Slot *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPickupTime(slot)}
                      className={`p-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        pickupTime === slot
                          ? 'border-[#241A15] bg-[#241A15] text-[#FAF7F2]'
                          : 'border-[#EADBCE] bg-white text-[#241A15] hover:bg-[#F4EFE6]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Customer Details */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-sm text-[#6B5A50]">
                Enter contact information for order confirmation and pickup notification:
              </p>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                  Phone Number (For Pickup SMS/Call) *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98450 12345"
                  className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. priya@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Birthday candles, disposable cutlery, extra packing..."
                  className="w-full px-3.5 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Order Summary */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-[#EADBCE] space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] border-b border-[#FAF7F2] pb-2">
                  Order Breakdown
                </div>
                {schedulerItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs">
                    <div>
                      <div className="font-bold text-[#241A15]">
                        {item.quantity}x {item.name} ({item.size})
                      </div>
                      {item.isEggless && (
                        <div className="text-emerald-700 text-[11px]">Eggless</div>
                      )}
                      {item.messageOnCake && (
                        <div className="text-[#7E6F65] italic text-[11px]">
                          Piping: "{item.messageOnCake}"
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-[#241A15]">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-[#EADBCE] flex justify-between items-center text-sm font-bold text-[#241A15]">
                  <span>Total Amount (Pay at Pickup)</span>
                  <span className="font-serif text-lg text-[#B87B37]">₹{orderTotal}</span>
                </div>
              </div>

              {/* Schedule and Contact Box */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EADBCE] text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#7E6F65]">Pickup Schedule:</span>
                  <span className="font-semibold text-[#241A15]">
                    {pickupDate} · {pickupTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E6F65]">Customer:</span>
                  <span className="font-semibold text-[#241A15]">
                    {customerName} ({customerPhone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E6F65]">Order Category:</span>
                  <span className="font-semibold text-[#241A15]">{orderType}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#7E6F65] leading-relaxed">
                By submitting this request, your schedule slot will be booked. Our bakery staff will verify readiness and send you a confirmation message.
              </div>
            </div>
          )}

          {/* STEP 7: Confirmation */}
          {currentStep === 7 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B87B37]">
                Request Registered
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#241A15]">
                Your Request Has Been Received.
              </h3>

              <div className="bg-white p-5 rounded-xl border border-[#EADBCE] text-left space-y-2 max-w-md mx-auto text-xs">
                <div className="flex justify-between">
                  <span className="text-[#7E6F65]">Order ID:</span>
                  <span className="font-mono font-bold text-sm text-[#241A15]">
                    {confirmedOrderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E6F65]">Pickup Date:</span>
                  <span className="font-semibold text-[#241A15]">{pickupDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E6F65]">Pickup Time:</span>
                  <span className="font-semibold text-[#241A15]">{pickupTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7E6F65]">Status:</span>
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Pending Confirmation
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6B5A50] max-w-md mx-auto leading-relaxed">
                Our Bengaluru team will prepare your order fresh. Please note your order is pending until verified by our staff. You can contact our bakery directly below.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/919880023456?text=${encodeURIComponent(
                    `Hello Amma Pastries! I have submitted order request ${confirmedOrderId} for ${customerName} (${pickupDate} at ${pickupTime}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Bakery Team</span>
                </a>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#241A15] text-[#FAF7F2] hover:bg-[#382B23] font-semibold text-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1 to 6) */}
        {currentStep < 7 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#EADBCE] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 rounded-lg border border-[#EADBCE] text-xs font-semibold text-[#241A15] hover:bg-[#FAF7F2] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-lg bg-[#241A15] text-[#FAF7F2] hover:bg-[#382B23] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D29C5B]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-7 py-2.5 rounded-lg bg-[#241A15] text-[#FAF7F2] hover:bg-[#382B23] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Confirm Request'}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#D29C5B]" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
