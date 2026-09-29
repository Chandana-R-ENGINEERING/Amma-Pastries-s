export type CategoryId = 'cakes' | 'pastries' | 'special_cakes' | 'desserts' | 'snacks' | 'baked_goods';

export interface SizeOption {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  image: string;
  sizes: SizeOption[];
  isVeg: boolean;
  isEgglessAvailable: boolean;
  isAvailable: boolean;
  featured?: boolean;
  rating: number;
  reviewCount: number;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';

export type OrderType =
  | 'Regular Cake Order'
  | 'Custom Cake'
  | 'Pastry / Dessert Order'
  | 'Celebration Order'
  | 'Bulk / Party Order';

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  isEggless: boolean;
  messageOnCake?: string;
  specialNotes?: string;
  image?: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface BakeryOrder {
  id: string;
  userId?: string | null;
  orderType: OrderType;
  customer: CustomerDetails;
  items: OrderItem[];
  pickupDate: string;
  pickupTime: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  adminNotes?: string;
}

export type CustomCakeStatus =
  | 'New'
  | 'Contacted'
  | 'Quoted'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Completed'
  | 'Cancelled';

export type CelebrationType =
  | 'Birthday'
  | 'Anniversary'
  | 'Wedding'
  | 'Engagement'
  | 'Baby Celebration'
  | 'Graduation'
  | 'Corporate'
  | 'Other';

export interface CustomCakeRequest {
  id: string;
  userId?: string | null;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  celebrationType: CelebrationType;
  cakeFlavour: string;
  cakeSize: string;
  cakeShape: string;
  isEggless: boolean;
  preferredDate: string;
  preferredTime: string;
  messageOnCake: string;
  specialInstructions: string;
  referenceImageUrl?: string;
  status: CustomCakeStatus;
  quotedPrice?: number | null;
  bakerNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  dietaryPreference?: string;
  createdAt: string;
}

export interface BusinessSettings {
  brandName: string;
  tagline: string;
  trustStatement: string;
  category: string;
  address: string;
  locality: string;
  state: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  pickupTimings: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  specialNotice: string;
  adminPin: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  source: string;
  comment: string;
  isVerified: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Cakes' | 'Pastries' | 'Custom Cakes' | 'Celebrations' | 'Bakery' | 'Store' | string;
  image: string;
  description: string;
}

export interface AvailabilitySettings {
  timeSlots: string[];
  blockedDates: string[];
  sameDayCutoffHour: number;
  minCustomCakeLeadHours: number;
  maxDailyOrders: number;
}
