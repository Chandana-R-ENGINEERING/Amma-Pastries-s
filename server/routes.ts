import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveAppointmentToSupabase, checkSupabaseStatus } from './supabase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, 'data');

// Helper to read JSON safely
function readData<T>(fileName: string, fallback: T): T {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
    return fallback;
  }
}

// Helper to write JSON safely
function writeData<T>(fileName: string, data: T): boolean {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err);
    return false;
  }
}

export function registerApiRoutes(app: express.Express) {
  const router = express.Router();

  // 1. Business Settings
  router.get('/business-settings', (_req: Request, res: Response) => {
    const settings = readData('business_settings.json', {});
    res.json(settings);
  });

  router.put('/business-settings', (req: Request, res: Response) => {
    const current = readData('business_settings.json', {});
    const updated = { ...current, ...req.body };
    writeData('business_settings.json', updated);
    res.json({ success: true, settings: updated });
  });

  // 2. Categories
  router.get('/categories', (_req: Request, res: Response) => {
    const categories = readData('categories.json', []);
    res.json(categories);
  });

  // 3. Products
  router.get('/products', (_req: Request, res: Response) => {
    const products = readData('products.json', []);
    res.json(products);
  });

  router.post('/products', (req: Request, res: Response) => {
    const products: any[] = readData('products.json', []);
    const newProduct = {
      id: `prod-${Date.now()}`,
      rating: 4.8,
      reviewCount: 1,
      isAvailable: true,
      ...req.body,
    };
    products.unshift(newProduct);
    writeData('products.json', products);
    res.status(201).json(newProduct);
  });

  router.put('/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const products: any[] = readData('products.json', []);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    products[index] = { ...products[index], ...req.body };
    writeData('products.json', products);
    res.json(products[index]);
  });

  router.delete('/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    let products: any[] = readData('products.json', []);
    products = products.filter((p) => p.id !== id);
    writeData('products.json', products);
    res.json({ success: true });
  });

  // 4. Orders
  router.get('/orders', (req: Request, res: Response) => {
    const { userId } = req.query;
    const orders: any[] = readData('orders.json', []);
    if (userId) {
      const userOrders = orders.filter((o) => o.userId === userId);
      return res.json(userOrders);
    }
    res.json(orders);
  });

  router.post('/orders', async (req: Request, res: Response) => {
    const orders: any[] = readData('orders.json', []);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: `APK-ORD-${randomSuffix}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      adminNotes: '',
      ...req.body,
    };
    orders.unshift(newOrder);
    writeData('orders.json', orders);

    // Automatically sync appointment booking to Supabase database
    try {
      await saveAppointmentToSupabase(newOrder);
    } catch (err: any) {
      console.warn('[Supabase Sync Warning]:', err.message);
    }

    res.status(201).json(newOrder);
  });

  router.patch('/orders/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const orders: any[] = readData('orders.json', []);
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (status) orders[index].status = status;
    if (adminNotes !== undefined) orders[index].adminNotes = adminNotes;
    orders[index].updatedAt = new Date().toISOString();
    writeData('orders.json', orders);
    res.json(orders[index]);
  });

  // 5. Custom Cake Requests
  router.get('/custom-cakes', (req: Request, res: Response) => {
    const { userId } = req.query;
    const requests: any[] = readData('custom_cake_requests.json', []);
    if (userId) {
      const userRequests = requests.filter((r) => r.userId === userId);
      return res.json(userRequests);
    }
    res.json(requests);
  });

  router.post('/custom-cakes', async (req: Request, res: Response) => {
    const requests: any[] = readData('custom_cake_requests.json', []);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRequest = {
      id: `APK-CC-${randomSuffix}`,
      status: 'New',
      quotedPrice: null,
      bakerNotes: 'Request received. Chef reviewing design details.',
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    requests.unshift(newRequest);
    writeData('custom_cake_requests.json', requests);

    // Automatically sync appointment booking to Supabase database
    try {
      await saveAppointmentToSupabase({
        ...newRequest,
        customerName: newRequest.name || newRequest.customerName,
        customerPhone: newRequest.phone || newRequest.customerPhone,
        customerEmail: newRequest.email || newRequest.customerEmail,
        orderType: `Custom Cake: ${newRequest.occasion || 'Consultation'}`,
        pickupDate: newRequest.eventDate,
      });
    } catch (err: any) {
      console.warn('[Supabase Sync Warning]:', err.message);
    }

    res.status(201).json(newRequest);
  });

  router.patch('/custom-cakes/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, quotedPrice, bakerNotes } = req.body;
    const requests: any[] = readData('custom_cake_requests.json', []);
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }
    if (status) requests[index].status = status;
    if (quotedPrice !== undefined) requests[index].quotedPrice = quotedPrice;
    if (bakerNotes !== undefined) requests[index].bakerNotes = bakerNotes;
    requests[index].updatedAt = new Date().toISOString();
    writeData('custom_cake_requests.json', requests);
    res.json(requests[index]);
  });

  // 6. Customer Auth & Accounts
  router.post('/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, password, address, dietaryPreference } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Please provide name, email, phone and password.' });
    }
    const users: any[] = readData('users.json', []);
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone,
      password,
      address: address || '',
      dietaryPreference: dietaryPreference || 'All Varieties',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeData('users.json', users);

    // Return user without password
    const { password: _, ...userSafe } = newUser;
    res.status(201).json({ user: userSafe, token: `token-${userSafe.id}` });
  });

  router.post('/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const users: any[] = readData('users.json', []);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const { password: _, ...userSafe } = user;
    res.json({ user: userSafe, token: `token-${userSafe.id}` });
  });

  router.put('/auth/profile', (req: Request, res: Response) => {
    const { id, name, phone, address, dietaryPreference } = req.body;
    const users: any[] = readData('users.json', []);
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (name) users[index].name = name;
    if (phone) users[index].phone = phone;
    if (address !== undefined) users[index].address = address;
    if (dietaryPreference !== undefined) users[index].dietaryPreference = dietaryPreference;
    writeData('users.json', users);
    const { password: _, ...userSafe } = users[index];
    res.json({ user: userSafe });
  });

  // 7. Gallery
  router.get('/gallery', (_req: Request, res: Response) => {
    const gallery = readData('gallery.json', []);
    res.json(gallery);
  });

  router.post('/gallery', (req: Request, res: Response) => {
    const gallery: any[] = readData('gallery.json', []);
    const newItem = {
      id: `gal-${Date.now()}`,
      ...req.body,
    };
    gallery.unshift(newItem);
    writeData('gallery.json', gallery);
    res.status(201).json(newItem);
  });

  router.delete('/gallery/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    let gallery: any[] = readData('gallery.json', []);
    gallery = gallery.filter((g) => g.id !== id);
    writeData('gallery.json', gallery);
    res.json({ success: true });
  });

  // 8. Reviews
  router.get('/reviews', (_req: Request, res: Response) => {
    const reviews = readData('reviews.json', []);
    res.json(reviews);
  });

  router.post('/reviews', (req: Request, res: Response) => {
    const reviews: any[] = readData('reviews.json', []);
    const newRev = {
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      source: 'Google Maps Verified Review',
      isVerified: true,
      ...req.body,
    };
    reviews.unshift(newRev);
    writeData('reviews.json', reviews);
    res.status(201).json(newRev);
  });

  router.delete('/reviews/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    let reviews: any[] = readData('reviews.json', []);
    reviews = reviews.filter((r) => r.id !== id);
    writeData('reviews.json', reviews);
    res.json({ success: true });
  });

  // 9. Availability
  router.get('/availability', (_req: Request, res: Response) => {
    const avail = readData('availability.json', {});
    res.json(avail);
  });

  router.put('/availability', (req: Request, res: Response) => {
    const current = readData('availability.json', {});
    const updated = { ...current, ...req.body };
    writeData('availability.json', updated);
    res.json(updated);
  });

  // 10. Supabase Integration
  router.get('/supabase/status', async (_req: Request, res: Response) => {
    try {
      const status = await checkSupabaseStatus();
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Direct Appointment Booking Endpoint (for generic appointment forms)
  router.post('/appointments', async (req: Request, res: Response) => {
    try {
      const result = await saveAppointmentToSupabase(req.body);
      res.status(result.success ? 201 : 200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mount API router
  app.use('/api', router);
}
