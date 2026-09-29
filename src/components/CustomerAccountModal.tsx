import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  Check,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Clock,
  Cake,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { BakeryOrder, CustomCakeRequest } from '../types';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, login, register, logout, updateProfile } = useAuth();
  const { reorderPastItems, setIsCartOpen } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'custom_cakes' | 'profile'>('orders');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regDietary, setRegDietary] = useState('All Varieties');

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileDietary, setProfileDietary] = useState('');

  // Orders & Requests data
  const [userOrders, setUserOrders] = useState<BakeryOrder[]>([]);
  const [userCustomCakes, setUserCustomCakes] = useState<CustomCakeRequest[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Sync profile fields
  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone);
      setProfileAddress(user.address || '');
      setProfileDietary(user.dietaryPreference || 'All Varieties');
      loadUserData(user.id);
    }
  }, [user]);

  const loadUserData = async (userId: string) => {
    setIsLoadingHistory(true);
    try {
      const [orders, cakes] = await Promise.all([
        api.getOrders(userId),
        api.getCustomCakes(userId),
      ]);
      setUserOrders(orders);
      setUserCustomCakes(cakes);
    } catch (err) {
      console.error('Failed to load user history', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await login(loginEmail, loginPassword);
      setActionSuccess('Welcome back!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        address: regAddress,
        dietaryPreference: regDietary,
      });
      setActionSuccess('Account created successfully!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
    }
  };

  const handleFillDemo = () => {
    setLoginEmail('customer@ammaspastries.com');
    setLoginPassword('password123');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        address: profileAddress,
        dietaryPreference: profileDietary,
      });
      setIsEditingProfile(false);
      setActionSuccess('Profile updated successfully.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to update profile.');
    }
  };

  const handleReorder = (order: BakeryOrder) => {
    reorderPastItems(order.items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-2xl w-full border border-[#EADBCE] shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#EADBCE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#241A15] text-[#D29C5B] flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#B87B37] font-semibold block">
                Amma Pastries Karnataka
              </span>
              <h3 className="font-serif text-xl font-bold text-[#241A15]">
                {user ? user.name : 'Customer Account'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#7E6F65] hover:text-[#241A15] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {actionSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              {actionSuccess}
            </div>
          )}

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
              {authError}
            </div>
          )}

          {!user ? (
            /* Auth Forms: Login / Register */
            <div className="max-w-md mx-auto space-y-6">
              {/* Tab Selector */}
              <div className="flex p-1 bg-white rounded-lg border border-[#EADBCE]">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-[#241A15] text-[#FAF7F2]'
                      : 'text-[#7E6F65] hover:text-[#241A15]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-[#241A15] text-[#FAF7F2]'
                      : 'text-[#7E6F65] hover:text-[#241A15]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authMode === 'login' ? (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. customer@ammaspastries.com"
                      className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-[#241A15] text-[#FAF7F2] hover:bg-[#382B23] font-semibold text-sm transition-all shadow-xs cursor-pointer"
                  >
                    Log In to My Account
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleFillDemo}
                      className="text-xs text-[#B87B37] hover:underline cursor-pointer"
                    >
                      Click here to pre-fill Demo Customer account (Priya Sharma)
                    </button>
                  </div>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full px-3.5 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98450 00000"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3.5 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                      Bengaluru Address / Area
                    </label>
                    <input
                      type="text"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="e.g. Koramangala 4th Block, Bengaluru"
                      className="w-full px-3.5 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7E6F65] block mb-1">
                      Dietary Preference
                    </label>
                    <select
                      value={regDietary}
                      onChange={(e) => setRegDietary(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white rounded-lg border border-[#EADBCE] text-sm text-[#241A15] focus:border-[#B87B37] outline-none"
                    >
                      <option value="All Varieties">All Varieties (Standard + Eggless)</option>
                      <option value="Eggless Only">100% Eggless Only</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-[#241A15] text-[#FAF7F2] hover:bg-[#382B23] font-semibold text-sm transition-all shadow-xs cursor-pointer"
                  >
                    Create Account
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Logged In Dashboard: Order History, Custom Cakes, Saved Details */
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex border-b border-[#EADBCE] gap-6 text-sm font-semibold">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'orders'
                      ? 'border-[#241A15] text-[#241A15]'
                      : 'border-transparent text-[#7E6F65] hover:text-[#241A15]'
                  }`}
                >
                  Order History ({userOrders.length})
                </button>
                <button
                  onClick={() => setActiveTab('custom_cakes')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'custom_cakes'
                      ? 'border-[#241A15] text-[#241A15]'
                      : 'border-transparent text-[#7E6F65] hover:text-[#241A15]'
                  }`}
                >
                  Custom Cake Requests ({userCustomCakes.length})
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'border-[#241A15] text-[#241A15]'
                      : 'border-transparent text-[#7E6F65] hover:text-[#241A15]'
                  }`}
                >
                  Saved Profile Details
                </button>
              </div>

              {/* Tab 1: Orders & 1-Click Reorder */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {userOrders.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl border border-[#EADBCE] p-6">
                      <ShoppingBag className="w-8 h-8 text-[#B87B37] mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-semibold text-[#241A15]">
                        No past orders yet
                      </p>
                      <p className="text-xs text-[#7E6F65] mt-1">
                        When you schedule cake or pastry pickups, they will appear here with instant re-ordering!
                      </p>
                    </div>
                  ) : (
                    userOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl border border-[#EADBCE] p-4 sm:p-5 shadow-xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FAF7F2] pb-3">
                          <div>
                            <span className="font-mono font-bold text-sm text-[#241A15]">
                              {order.id}
                            </span>
                            <span className="text-xs text-[#7E6F65] ml-2">
                              · {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Status Badge */}
                          <div
                            className={`px-2.5 py-1 rounded text-xs font-semibold ${
                              order.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : order.status === 'Preparing'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : order.status === 'Ready for Pickup'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {order.status}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-1.5 text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-[#4A3B32]">
                              <div>
                                <span className="font-medium text-[#241A15]">
                                  {item.quantity}x {item.name}
                                </span>{' '}
                                <span className="text-[#7E6F65]">({item.size})</span>
                                {item.isEggless && (
                                  <span className="text-emerald-700 ml-1 font-semibold">
                                    [Eggless]
                                  </span>
                                )}
                                {item.messageOnCake && (
                                  <div className="text-[11px] text-[#7E6F65] italic">
                                    Piping: "{item.messageOnCake}"
                                  </div>
                                )}
                              </div>
                              <span className="font-semibold text-[#241A15]">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Pickup & Reorder Action */}
                        <div className="pt-3 border-t border-[#FAF7F2] flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="text-[#7E6F65]">
                            Pickup: <strong className="text-[#241A15]">{order.pickupDate}</strong> ({order.pickupTime})
                            <div className="text-[11px]">Total: <strong className="text-[#B87B37]">₹{order.totalAmount}</strong></div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#241A15] text-[#FAF7F2] hover:bg-[#B87B37] font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reorder Items</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: Custom Cake Requests */}
              {activeTab === 'custom_cakes' && (
                <div className="space-y-4">
                  {userCustomCakes.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl border border-[#EADBCE] p-6">
                      <Cake className="w-8 h-8 text-[#B87B37] mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-semibold text-[#241A15]">
                        No custom cake enquiries yet
                      </p>
                      <p className="text-xs text-[#7E6F65] mt-1">
                        Use the Celebration Cake Studio to submit your custom cake designs!
                      </p>
                    </div>
                  ) : (
                    userCustomCakes.map((cake) => (
                      <div
                        key={cake.id}
                        className="bg-white rounded-xl border border-[#EADBCE] p-4 sm:p-5 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-2 text-xs">
                          <div>
                            <span className="font-mono font-bold text-sm text-[#241A15]">
                              {cake.id}
                            </span>
                            <span className="text-[#7E6F65] ml-2">· {cake.celebrationType}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold">
                            {cake.status}
                          </span>
                        </div>

                        <div className="text-xs text-[#4A3B32] space-y-1">
                          <div>
                            <strong className="text-[#241A15]">Flavour:</strong> {cake.cakeFlavour} ({cake.cakeSize})
                          </div>
                          <div>
                            <strong className="text-[#241A15]">Date:</strong> {cake.preferredDate} · {cake.preferredTime}
                          </div>
                          {cake.messageOnCake && (
                            <div>
                              <strong className="text-[#241A15]">Piping:</strong> "{cake.messageOnCake}"
                            </div>
                          )}
                          {cake.quotedPrice && (
                            <div className="text-emerald-700 font-bold text-sm mt-1">
                              Quoted Price: ₹{cake.quotedPrice}
                            </div>
                          )}
                          {cake.bakerNotes && (
                            <div className="p-2 rounded bg-[#FAF7F2] text-[#6B5A50] mt-1 text-[11px]">
                              <strong>Chef Note:</strong> {cake.bakerNotes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Saved Profile Details */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl border border-[#EADBCE] p-5 space-y-4">
                  {!isEditingProfile ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-[#FAF7F2]">
                        <span className="text-xs text-[#7E6F65]">Customer Name:</span>
                        <span className="font-semibold text-[#241A15]">{user.name}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-[#FAF7F2]">
                        <span className="text-xs text-[#7E6F65]">Email Address:</span>
                        <span className="font-semibold text-[#241A15]">{user.email}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-[#FAF7F2]">
                        <span className="text-xs text-[#7E6F65]">Phone Number:</span>
                        <span className="font-semibold text-[#241A15]">{user.phone}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-[#FAF7F2]">
                        <span className="text-xs text-[#7E6F65]">Saved Address:</span>
                        <span className="font-semibold text-[#241A15] text-right max-w-xs">
                          {user.address || 'None saved'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-[#FAF7F2]">
                        <span className="text-xs text-[#7E6F65]">Dietary Preference:</span>
                        <span className="font-semibold text-[#241A15]">
                          {user.dietaryPreference || 'All Varieties'}
                        </span>
                      </div>

                      <div className="pt-3 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(true)}
                          className="px-4 py-2 rounded-lg bg-[#FAF7F2] border border-[#EADBCE] text-xs font-semibold text-[#241A15] hover:bg-[#EADBCE]"
                        >
                          Edit Saved Details
                        </button>
                        <button
                          type="button"
                          onClick={logout}
                          className="flex items-center gap-1.5 text-xs text-red-600 font-semibold hover:underline cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Edit Form */
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-[#7E6F65] block mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#7E6F65] block mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#7E6F65] block mb-1">
                          Bengaluru Address
                        </label>
                        <input
                          type="text"
                          value={profileAddress}
                          onChange={(e) => setProfileAddress(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#7E6F65] block mb-1">
                          Dietary Preference
                        </label>
                        <select
                          value={profileDietary}
                          onChange={(e) => setProfileDietary(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] text-sm text-[#241A15] outline-none"
                        >
                          <option value="All Varieties">All Varieties</option>
                          <option value="Eggless Only">Eggless Only</option>
                        </select>
                      </div>

                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 rounded-lg bg-[#FAF7F2] border border-[#EADBCE] text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-lg bg-[#241A15] text-[#FAF7F2] text-xs font-semibold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
