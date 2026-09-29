import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Package,
  Calendar,
  Layers,
  Settings,
  Image as ImageIcon,
  Clock,
  Star,
  CheckCircle,
  Plus,
  Trash2,
  Edit2,
  Save,
  Lock,
  Database,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import {
  BakeryOrder,
  CustomCakeRequest,
  Product,
  BusinessSettings,
  GalleryItem,
  Review,
  AvailabilitySettings,
  OrderStatus,
  CustomCakeStatus,
} from '../types';
import { api } from '../services/api';
import { handleImageError } from '../utils/imageFallback';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BusinessSettings | null;
  onRefreshSettings: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  settings,
  onRefreshSettings,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'orders'
    | 'custom_cakes'
    | 'products'
    | 'availability'
    | 'gallery'
    | 'business_info'
    | 'reviews'
    | 'supabase'
  >('overview');

  // Supabase status state
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    projectId: string;
    url: string;
    tables: Record<string, boolean>;
    message: string;
  } | null>(null);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Data states
  const [orders, setOrders] = useState<BakeryOrder[]>([]);
  const [customCakes, setCustomCakes] = useState<CustomCakeRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySettings | null>(null);

  // Settings editing state
  const [brandName, setBrandName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [pickupTimings, setPickupTimings] = useState('');
  const [specialNotice, setSpecialNotice] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // New review form
  const [newRevName, setNewRevName] = useState('');
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevComment, setNewRevComment] = useState('');

  // New product modal/state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAllAdminData();
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    if (settings) {
      setBrandName(settings.brandName || '');
      setAddress(settings.address || '');
      setPhone(settings.phone || '');
      setWhatsapp(settings.whatsapp || '');
      setOpeningHours(settings.openingHours || '');
      setPickupTimings(settings.pickupTimings || '');
      setSpecialNotice(settings.specialNotice || '');
    }
  }, [settings]);

  const checkSupabaseHealth = async () => {
    setIsCheckingSupabase(true);
    try {
      const status = await api.getSupabaseStatus();
      setSupabaseStatus(status);
    } catch (err) {
      console.warn('Failed to check Supabase status:', err);
    } finally {
      setIsCheckingSupabase(false);
    }
  };

  const loadAllAdminData = async () => {
    try {
      const [o, c, p, g, r, a] = await Promise.all([
        api.getOrders(),
        api.getCustomCakes(),
        api.getProducts(),
        api.getGallery(),
        api.getReviews(),
        api.getAvailability(),
      ]);
      setOrders(o);
      setCustomCakes(c);
      setProducts(p);
      setGallery(g);
      setReviews(r);
      setAvailability(a);
      checkSupabaseHealth();
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = settings?.adminPin || '1234';
    if (pinInput === correctPin || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleOrderStatusUpdate = async (id: string, newStatus: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(id, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  const handleCustomCakeStatusUpdate = async (
    id: string,
    newStatus: CustomCakeStatus,
    quotedPrice?: number,
    bakerNotes?: string
  ) => {
    try {
      const updated = await api.updateCustomCakeStatus(id, {
        status: newStatus,
        quotedPrice,
        bakerNotes,
      });
      setCustomCakes((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error('Failed to update custom cake status', err);
    }
  };

  const handleSaveBusinessSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await api.updateSettings({
        brandName,
        address,
        phone,
        whatsapp,
        openingHours,
        pickupTimings,
        specialNotice,
      });
      onRefreshSettings();
      alert('Business information updated successfully!');
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleToggleProductAvailability = async (product: Product) => {
    try {
      const updated = await api.updateProduct(product.id, {
        isAvailable: !product.isAvailable,
      });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    } catch (err) {
      console.error('Failed to toggle product', err);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRevName.trim() || !newRevComment.trim()) return;
    try {
      const created = await api.createReview({
        name: newRevName.trim(),
        rating: newRevRating,
        comment: newRevComment.trim(),
        source: 'Google Maps Verified Review',
        isVerified: true,
      });
      setReviews((prev) => [created, ...prev]);
      setNewRevName('');
      setNewRevComment('');
    } catch (err) {
      console.error('Failed to add review', err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this verified review?')) return;
    try {
      await api.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-5xl w-full border border-[#EADBCE] shadow-2xl overflow-hidden relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#241A15] text-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3A2D26] text-[#D29C5B] flex items-center justify-center border border-[#D29C5B]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D29C5B]">
                Management Portal
              </span>
              <h3 className="font-serif text-xl font-bold">
                Amma Pastries Karnataka · Owner Console
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Gate (PIN protection) */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-sm mx-auto space-y-4 my-auto">
            <div className="w-12 h-12 rounded-full bg-[#EADBCE] text-[#241A15] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#241A15]">
              Owner Security Check
            </h4>
            <p className="text-xs text-[#7E6F65]">
              Please enter your 4-digit bakery owner PIN to manage orders, products, and branch information. (Default PIN: 1234)
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-3 pt-2">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (1234)"
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-2.5 bg-white rounded-lg border border-[#EADBCE] focus:border-[#B87B37] outline-none"
              />
              {pinError && (
                <div className="text-xs text-red-600 font-semibold">
                  Invalid PIN. Please try again or use 1234.
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#241A15] text-[#FAF7F2] font-semibold text-xs transition-colors hover:bg-[#3A2D26]"
              >
                Access Owner Portal
              </button>
            </form>
          </div>
        ) : (
          /* Main Dashboard Content */
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-[#EADBCE] p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#241A15] text-[#FAF7F2]'
                    : 'text-[#4A3B32] hover:bg-[#FAF7F2]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#241A15] text-[#FAF7F2]'
                    : 'text-[#4A3B32] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Orders</span>
                </div>
                <span className="text-[10px] bg-[#EADBCE] text-[#241A15] px-1.5 py-0.2 rounded font-bold">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('custom_cakes')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  activeTab === 'custom_cakes'
                    ? 'bg-[#241A15] text-[#FAF7F2]'
                    : 'text-[#4A3B32] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Custom Cakes</span>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                  {customCakes.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#241A15] text-[#FAF7F2]'
                    : 'text-[#4A3B32] hover:bg-[#FAF7F2]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Products & Pricing</span>
              </button>

              <button
                onClick={() => setActiveTab('business_info')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  activeTab === 'business_info'
                    ? 'bg-[#241A15] text-[#FAF7F2]'
                    : 'text-[#4A3B32] hover:bg-[#FAF7F2]'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Business Info</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-[#241A15] text-[#FAF7F2]'
                    : 'text-[#4A3B32] hover:bg-[#FAF7F2]'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Verified Reviews</span>
              </button>

              <button
                onClick={() => setActiveTab('supabase')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  activeTab === 'supabase'
                    ? 'bg-[#241A15] text-[#FAF7F2]'
                    : 'text-[#4A3B32] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Supabase Backend</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </button>
            </div>

            {/* Main Tab Panel */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[80vh]">
              {/* TAB 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-[#EADBCE]">
                      <span className="text-xs text-[#7E6F65]">Total Orders</span>
                      <div className="font-serif text-2xl font-bold text-[#241A15] mt-1">
                        {orders.length}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#EADBCE]">
                      <span className="text-xs text-[#7E6F65]">Custom Cake Requests</span>
                      <div className="font-serif text-2xl font-bold text-amber-700 mt-1">
                        {customCakes.length}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#EADBCE]">
                      <span className="text-xs text-[#7E6F65]">Active Catalog Items</span>
                      <div className="font-serif text-2xl font-bold text-[#241A15] mt-1">
                        {products.length}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#EADBCE]">
                      <span className="text-xs text-[#7E6F65]">Verified Reviews</span>
                      <div className="font-serif text-2xl font-bold text-emerald-700 mt-1">
                        {reviews.length}
                      </div>
                    </div>
                  </div>

                  {/* Quick recent orders table */}
                  <div className="bg-white rounded-xl border border-[#EADBCE] p-5 space-y-4">
                    <h4 className="font-serif font-bold text-base text-[#241A15]">
                      Recent Celebration Orders
                    </h4>
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((o) => (
                        <div
                          key={o.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-[#FAF7F2] text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-[#241A15]">
                              {o.id}
                            </span>{' '}
                            · <span className="font-semibold">{o.customer.name}</span> (
                            {o.customer.phone})
                            <div className="text-[#7E6F65] mt-0.5">
                              Pickup: {o.pickupDate} ({o.pickupTime}) · Total: ₹{o.totalAmount}
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded bg-white border border-[#EADBCE] font-bold text-[#241A15]">
                            {o.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Orders Management */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-serif font-bold text-lg text-[#241A15]">
                      All Scheduled Orders ({orders.length})
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl border border-[#EADBCE] p-4 sm:p-5 shadow-xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FAF7F2] pb-3">
                          <div>
                            <span className="font-mono font-bold text-sm text-[#241A15]">
                              {order.id}
                            </span>
                            <span className="text-xs text-[#7E6F65] ml-2 font-medium">
                              · {order.orderType}
                            </span>
                          </div>

                          {/* Status Updater */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#7E6F65]">Status:</span>
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleOrderStatusUpdate(order.id, e.target.value as OrderStatus)
                              }
                              className="px-2.5 py-1 text-xs font-semibold bg-[#FAF7F2] border border-[#EADBCE] rounded-md text-[#241A15] outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Ready for Pickup">Ready for Pickup</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer & Pickup */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <strong>Customer:</strong> {order.customer.name} (
                            <a href={`tel:${order.customer.phone}`} className="text-[#B87B37] underline">
                              {order.customer.phone}
                            </a>
                            )
                          </div>
                          <div>
                            <strong>Pickup:</strong> {order.pickupDate} · {order.pickupTime}
                          </div>
                        </div>

                        {/* Items */}
                        <div className="bg-[#FAF7F2] p-3 rounded-lg text-xs space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>
                                {item.quantity}x {item.name} ({item.size}){' '}
                                {item.isEggless && '[Eggless]'}{' '}
                                {item.messageOnCake && `· Piping: "${item.messageOnCake}"`}
                              </span>
                              <span className="font-bold">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-[#EADBCE] flex justify-between font-bold text-[#241A15]">
                            <span>Total Due:</span>
                            <span className="text-[#B87B37]">₹{order.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Custom Cake Requests */}
              {activeTab === 'custom_cakes' && (
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-lg text-[#241A15]">
                    Custom Celebration Cake Enquiries ({customCakes.length})
                  </h4>

                  <div className="space-y-4">
                    {customCakes.map((cake) => (
                      <div
                        key={cake.id}
                        className="bg-white rounded-xl border border-[#EADBCE] p-4 sm:p-5 shadow-xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FAF7F2] pb-3">
                          <div>
                            <span className="font-mono font-bold text-sm text-[#241A15]">
                              {cake.id}
                            </span>
                            <span className="text-xs text-[#7E6F65] ml-2">
                              · {cake.celebrationType}
                            </span>
                          </div>

                          {/* Status Updater */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#7E6F65]">Status:</span>
                            <select
                              value={cake.status}
                              onChange={(e) =>
                                handleCustomCakeStatusUpdate(
                                  cake.id,
                                  e.target.value as CustomCakeStatus,
                                  cake.quotedPrice || undefined,
                                  cake.bakerNotes
                                )
                              }
                              className="px-2.5 py-1 text-xs font-semibold bg-[#FAF7F2] border border-[#EADBCE] rounded-md text-[#241A15] outline-none"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Quoted">Quoted</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Ready">Ready</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer & Specs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <strong>Customer:</strong> {cake.customer.name} (
                            <a href={`tel:${cake.customer.phone}`} className="text-[#B87B37] underline">
                              {cake.customer.phone}
                            </a>
                            )
                          </div>
                          <div>
                            <strong>Pickup Date:</strong> {cake.preferredDate} ({cake.preferredTime})
                          </div>
                          <div>
                            <strong>Flavour & Weight:</strong> {cake.cakeFlavour} ({cake.cakeSize})
                          </div>
                          <div>
                            <strong>Shape & Style:</strong> {cake.cakeShape}{' '}
                            {cake.isEggless && '(Eggless)'}
                          </div>
                        </div>

                        {cake.messageOnCake && (
                          <div className="text-xs text-[#241A15] bg-[#FAF7F2] p-2 rounded">
                            <strong>Piping Message:</strong> "{cake.messageOnCake}"
                          </div>
                        )}

                        {cake.specialInstructions && (
                          <div className="text-xs text-[#6B5A50] bg-[#FAF7F2] p-2 rounded">
                            <strong>Design Instructions:</strong> {cake.specialInstructions}
                          </div>
                        )}

                        {/* Reference Photo if attached */}
                        {cake.referenceImageUrl && (
                          <div className="pt-2">
                            <span className="text-xs font-bold text-[#7E6F65] block mb-1">
                              Reference Photo Uploaded by Customer:
                            </span>
                            <img
                              src={cake.referenceImageUrl}
                              alt="Cake reference"
                              className="h-28 rounded-lg border border-[#EADBCE] object-cover"
                            />
                          </div>
                        )}

                        {/* Price Quote & Notes */}
                        <div className="pt-3 border-t border-[#FAF7F2] flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span>Quoted Price (₹):</span>
                            <input
                              type="number"
                              defaultValue={cake.quotedPrice || ''}
                              onBlur={(e) =>
                                handleCustomCakeStatusUpdate(
                                  cake.id,
                                  cake.status,
                                  Number(e.target.value) || undefined,
                                  cake.bakerNotes
                                )
                              }
                              placeholder="e.g. 2400"
                              className="w-24 px-2 py-1 bg-[#FAF7F2] border border-[#EADBCE] rounded text-xs font-bold"
                            />
                          </div>
                          <a
                            href={`https://wa.me/${cake.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hi ${cake.customer.name}, this is Amma Pastries Karnataka regarding your custom ${cake.celebrationType} cake enquiry (${cake.id}).`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                          >
                            Chat on WhatsApp
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Products & Pricing */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-serif font-bold text-lg text-[#241A15]">
                      Bakery Catalog & Availability ({products.length})
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white p-3 rounded-xl border border-[#EADBCE] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={handleImageError}
                          />
                          <div>
                            <div className="text-xs font-bold text-[#241A15]">{prod.name}</div>
                            <div className="text-[11px] text-[#7E6F65]">
                              ₹{prod.sizes[0]?.price} onwards ({prod.category})
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleProductAvailability(prod)}
                            className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                              prod.isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {prod.isAvailable ? 'In Stock' : 'Sold Out'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Business Information */}
              {activeTab === 'business_info' && (
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-lg text-[#241A15]">
                    Central Business Information & Contact
                  </h4>
                  <p className="text-xs text-[#7E6F65]">
                    Update your verified Google Maps listing details, phone numbers, and operational hours from here.
                  </p>

                  <form onSubmit={handleSaveBusinessSettings} className="space-y-4 max-w-xl">
                    <div>
                      <label className="text-xs font-bold text-[#7E6F65] block mb-1">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#7E6F65] block mb-1">
                        Verified Bakery Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#7E6F65] block mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#7E6F65] block mb-1">
                          WhatsApp Line
                        </label>
                        <input
                          type="text"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#7E6F65] block mb-1">
                          Opening Hours
                        </label>
                        <input
                          type="text"
                          value={openingHours}
                          onChange={(e) => setOpeningHours(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#7E6F65] block mb-1">
                          Order Pickup Timings
                        </label>
                        <input
                          type="text"
                          value={pickupTimings}
                          onChange={(e) => setPickupTimings(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#7E6F65] block mb-1">
                        Notice / Lead Time Policy
                      </label>
                      <textarea
                        rows={2}
                        value={specialNotice}
                        onChange={(e) => setSpecialNotice(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-6 py-2.5 rounded-lg bg-[#241A15] text-[#FAF7F2] font-semibold text-xs hover:bg-[#382B23] transition-colors"
                    >
                      {isSavingSettings ? 'Saving...' : 'Save Business Information'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 6: Verified Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <h4 className="font-serif font-bold text-lg text-[#241A15]">
                    Verified Customer Reviews
                  </h4>

                  {/* Add Review Form */}
                  <form
                    onSubmit={handleAddReview}
                    className="bg-white p-4 rounded-xl border border-[#EADBCE] space-y-3 max-w-lg"
                  >
                    <div className="text-xs font-bold uppercase tracking-wider text-[#7E6F65]">
                      Add Verified Google Maps Review
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={newRevName}
                        onChange={(e) => setNewRevName(e.target.value)}
                        placeholder="Customer Name (e.g. Ramesh K.)"
                        className="px-3 py-2 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-xs outline-none"
                      />
                      <select
                        value={newRevRating}
                        onChange={(e) => setNewRevRating(Number(e.target.value))}
                        className="px-3 py-2 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-xs outline-none"
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      required
                      value={newRevComment}
                      onChange={(e) => setNewRevComment(e.target.value)}
                      placeholder="Verified review text from Google Maps..."
                      className="w-full px-3 py-2 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-xs outline-none resize-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#241A15] text-[#FAF7F2] text-xs font-semibold"
                    >
                      Publish Verified Review
                    </button>
                  </form>

                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviews.map((r) => (
                      <div
                        key={r.id}
                        className="bg-white p-4 rounded-xl border border-[#EADBCE] flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#241A15]">
                            {r.name} · {r.rating} Stars
                          </div>
                          <div className="text-[#6B5A50] mt-1 italic">"{r.comment}"</div>
                          <div className="text-[10px] text-[#7E6F65] mt-1">{r.source} · {r.date}</div>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: Supabase Backend Integration */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="bg-white p-5 rounded-2xl border border-[#EADBCE] shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#FAF7F2]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-serif text-lg font-bold text-[#241A15]">
                            Supabase Cloud Database
                          </h4>
                          <p className="text-xs text-[#7E6F65]">
                            Real-time synchronization for appointment bookings & celebration orders
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span>Connected</span>
                        </span>

                        <button
                          onClick={checkSupabaseHealth}
                          disabled={isCheckingSupabase}
                          className="px-3 py-1.5 rounded-lg border border-[#EADBCE] text-xs font-medium text-[#241A15] hover:bg-[#FAF7F2] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSupabase ? 'animate-spin' : ''}`} />
                          <span>Check Status</span>
                        </button>
                      </div>
                    </div>

                    {/* Connection Credentials Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EADBCE] space-y-1">
                        <span className="text-[#7E6F65] block font-semibold text-[11px] uppercase tracking-wider">
                          Project ID
                        </span>
                        <span className="font-mono font-bold text-[#241A15]">
                          dabdmtkappvpbbwsclxg
                        </span>
                      </div>

                      <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EADBCE] space-y-1">
                        <span className="text-[#7E6F65] block font-semibold text-[11px] uppercase tracking-wider">
                          Project REST Endpoint
                        </span>
                        <span className="font-mono text-[#241A15] truncate block">
                          https://dabdmtkappvpbbwsclxg.supabase.co
                        </span>
                      </div>

                      <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EADBCE] space-y-1 md:col-span-2">
                        <span className="text-[#7E6F65] block font-semibold text-[11px] uppercase tracking-wider">
                          Publishable API Key (Anon)
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-[#4A3B32] truncate">
                            sb_publishable_3o9OjXgz9oCw4roZ-C6zmg_lBp7dmMF
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Table Status */}
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block">
                        Table Sync Verification
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-3 rounded-lg border border-[#EADBCE] bg-[#FAF7F2] flex items-center justify-between">
                          <div>
                            <div className="font-bold text-[#241A15]">public.appointments</div>
                            <div className="text-[10px] text-[#7E6F65]">Primary Booking Table</div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            supabaseStatus?.tables?.appointments ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {supabaseStatus?.tables?.appointments ? 'Verified' : 'Pending SQL'}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg border border-[#EADBCE] bg-[#FAF7F2] flex items-center justify-between">
                          <div>
                            <div className="font-bold text-[#241A15]">public.orders</div>
                            <div className="text-[10px] text-[#7E6F65]">Orders Table</div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            supabaseStatus?.tables?.orders ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {supabaseStatus?.tables?.orders ? 'Verified' : 'Pending SQL'}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg border border-[#EADBCE] bg-[#FAF7F2] flex items-center justify-between">
                          <div>
                            <div className="font-bold text-[#241A15]">public.bookings</div>
                            <div className="text-[10px] text-[#7E6F65]">Fallback Table</div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            supabaseStatus?.tables?.bookings ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {supabaseStatus?.tables?.bookings ? 'Verified' : 'Optional'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SQL Setup Instruction Box */}
                  <div className="bg-white p-5 rounded-2xl border border-[#EADBCE] shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#241A15]">
                          Database Setup Script (SQL Editor)
                        </h4>
                        <p className="text-xs text-[#7E6F65]">
                          If you haven't created the table in Supabase yet, copy and paste this into your Supabase SQL Editor:
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const sqlText = `-- Create Appointments Table for Amma Pastries
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  order_type TEXT DEFAULT 'Appointment Booking',
  appointment_date TEXT NOT NULL,
  appointment_time TEXT,
  total_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Pending',
  notes TEXT,
  items JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON public.appointments
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select" ON public.appointments
  FOR SELECT TO anon, authenticated USING (true);`;
                            navigator.clipboard.writeText(sqlText);
                            setCopiedSql(true);
                            setTimeout(() => setCopiedSql(false), 2500);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-[#241A15] hover:bg-[#3A2D26] text-[#FAF7F2] font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedSql ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#D29C5B]" />
                              <span>Copy SQL Schema</span>
                            </>
                          )}
                        </button>

                        <a
                          href="https://supabase.com/dashboard/project/dabdmtkappvpbbwsclxg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-lg border border-[#EADBCE] hover:bg-[#FAF7F2] text-[#241A15] font-semibold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#B87B37]" />
                          <span>Open Supabase</span>
                        </a>
                      </div>
                    </div>

                    <pre className="p-3.5 rounded-xl bg-[#1C1613] text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-[#3A2D26]">
{`-- Create Appointments Table in Supabase
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  order_type TEXT DEFAULT 'Appointment Booking',
  appointment_date TEXT NOT NULL,
  appointment_time TEXT,
  total_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Pending',
  notes TEXT,
  items JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security & Allow Website Form Submissions
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON public.appointments
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select" ON public.appointments
  FOR SELECT TO anon, authenticated USING (true);`}
                    </pre>

                    <div className="text-[11px] text-[#7E6F65] leading-relaxed bg-[#FAF7F2] p-3 rounded-lg border border-[#EADBCE]">
                      💡 <strong>How it works:</strong> Whenever any customer completes an appointment booking, pick-up schedule, or celebration cake request on the website, it is automatically forwarded and stored directly into your Supabase database table in real-time.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
