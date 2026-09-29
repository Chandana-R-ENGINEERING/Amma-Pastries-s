import {
  Product,
  Category,
  BakeryOrder,
  CustomCakeRequest,
  BusinessSettings,
  Review,
  GalleryItem,
  AvailabilitySettings,
  User,
} from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Business Settings
  async getSettings(): Promise<BusinessSettings> {
    return fetchJson<BusinessSettings>(`${API_BASE}/business-settings`);
  },
  async updateSettings(settings: Partial<BusinessSettings>): Promise<{ success: boolean; settings: BusinessSettings }> {
    return fetchJson(`${API_BASE}/business-settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return fetchJson<Category[]>(`${API_BASE}/categories`);
  },

  // Products
  async getProducts(): Promise<Product[]> {
    return fetchJson<Product[]>(`${API_BASE}/products`);
  },
  async createProduct(product: Partial<Product>): Promise<Product> {
    return fetchJson<Product>(`${API_BASE}/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return fetchJson<Product>(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return fetchJson<{ success: boolean }>(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Orders
  async getOrders(userId?: string): Promise<BakeryOrder[]> {
    const url = userId ? `${API_BASE}/orders?userId=${encodeURIComponent(userId)}` : `${API_BASE}/orders`;
    return fetchJson<BakeryOrder[]>(url);
  },
  async createOrder(order: Partial<BakeryOrder>): Promise<BakeryOrder> {
    return fetchJson<BakeryOrder>(`${API_BASE}/orders`, {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },
  async updateOrderStatus(id: string, status: string, adminNotes?: string): Promise<BakeryOrder> {
    return fetchJson<BakeryOrder>(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    });
  },

  // Custom Cakes
  async getCustomCakes(userId?: string): Promise<CustomCakeRequest[]> {
    const url = userId ? `${API_BASE}/custom-cakes?userId=${encodeURIComponent(userId)}` : `${API_BASE}/custom-cakes`;
    return fetchJson<CustomCakeRequest[]>(url);
  },
  async createCustomCake(request: Partial<CustomCakeRequest>): Promise<CustomCakeRequest> {
    return fetchJson<CustomCakeRequest>(`${API_BASE}/custom-cakes`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
  async updateCustomCakeStatus(id: string, updates: { status?: string; quotedPrice?: number; bakerNotes?: string }): Promise<CustomCakeRequest> {
    return fetchJson<CustomCakeRequest>(`${API_BASE}/custom-cakes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return fetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  async register(data: { name: string; email: string; phone: string; password: string; address?: string; dietaryPreference?: string }): Promise<{ user: User; token: string }> {
    return fetchJson(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateProfile(data: { id: string; name?: string; phone?: string; address?: string; dietaryPreference?: string }): Promise<{ user: User }> {
    return fetchJson(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    return fetchJson<GalleryItem[]>(`${API_BASE}/gallery`);
  },
  async createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
    return fetchJson<GalleryItem>(`${API_BASE}/gallery`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },
  async deleteGalleryItem(id: string): Promise<{ success: boolean }> {
    return fetchJson<{ success: boolean }>(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
    });
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    return fetchJson<Review[]>(`${API_BASE}/reviews`);
  },
  async createReview(review: Partial<Review>): Promise<Review> {
    return fetchJson<Review>(`${API_BASE}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },
  async deleteReview(id: string): Promise<{ success: boolean }> {
    return fetchJson<{ success: boolean }>(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  // Availability
  async getAvailability(): Promise<AvailabilitySettings> {
    return fetchJson<AvailabilitySettings>(`${API_BASE}/availability`);
  },
  async updateAvailability(settings: Partial<AvailabilitySettings>): Promise<AvailabilitySettings> {
    return fetchJson<AvailabilitySettings>(`${API_BASE}/availability`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Supabase
  async getSupabaseStatus(): Promise<{
    connected: boolean;
    projectId: string;
    url: string;
    tables: Record<string, boolean>;
    message: string;
  }> {
    return fetchJson(`${API_BASE}/supabase/status`);
  },
  async bookAppointment(appointmentData: any): Promise<{ success: boolean; table?: string; error?: string }> {
    return fetchJson(`${API_BASE}/appointments`, {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },
};
