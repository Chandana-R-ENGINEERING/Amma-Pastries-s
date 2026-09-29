import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dabdmtkappvpbbwsclxg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_3o9OjXgz9oCw4roZ-C6zmg_lBp7dmMF';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_KEY');
    return null;
  }
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: false,
        },
      });
      console.log(`[Supabase] Initialized client for project ${SUPABASE_URL}`);
    } catch (e: any) {
      console.error('[Supabase] Failed to initialize client:', e.message);
      return null;
    }
  }
  return supabaseClient;
}

export interface SaveBookingResult {
  success: boolean;
  table?: string;
  error?: string;
  details?: any;
}

/**
 * Saves an appointment booking or celebration order to Supabase database.
 * Supports multiple candidate tables (appointments, orders, bookings) and flexible schemas.
 */
export async function saveAppointmentToSupabase(bookingData: any): Promise<SaveBookingResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }

  const customerName = bookingData.customer?.name || bookingData.customerName || bookingData.name || '';
  const customerPhone = bookingData.customer?.phone || bookingData.customerPhone || bookingData.phone || '';
  const customerEmail = bookingData.customer?.email || bookingData.customerEmail || bookingData.email || '';
  const notes = bookingData.customer?.notes || bookingData.notes || '';
  const appointmentDate = bookingData.pickupDate || bookingData.eventDate || bookingData.appointmentDate || bookingData.date || '';
  const appointmentTime = bookingData.pickupTime || bookingData.appointmentTime || bookingData.time || '';
  const orderType = bookingData.orderType || bookingData.occasion || 'Appointment Booking';
  const totalAmount = bookingData.totalAmount || bookingData.quotedPrice || 0;
  const status = bookingData.status || 'Pending';
  const id = bookingData.id || `APT-${Date.now()}`;
  const createdAt = bookingData.createdAt || new Date().toISOString();

  // Primary payload with comprehensive naming
  const fullPayload: Record<string, any> = {
    id,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    order_type: orderType,
    status,
    total_amount: totalAmount,
    notes,
    items: bookingData.items || null,
    created_at: createdAt,
  };

  // Simplified payload with standard short names
  const shortPayload: Record<string, any> = {
    id,
    name: customerName,
    phone: customerPhone,
    email: customerEmail,
    date: appointmentDate,
    time: appointmentTime,
    service: orderType,
    status,
    notes,
    created_at: createdAt,
  };

  // Candidate tables in priority order
  const tables = ['appointments', 'bookings', 'orders', 'appointment_bookings'];
  let lastError: string = '';

  for (const tableName of tables) {
    try {
      // 1. Try full payload
      const { data, error } = await supabase.from(tableName).insert([fullPayload]).select();
      if (!error) {
        console.log(`[Supabase] Successfully saved booking to table "${tableName}" (${id})`);
        return { success: true, table: tableName, details: data };
      }

      lastError = error.message;

      // 2. If column mismatch error, try short payload
      if (error.message.includes('column') || error.code === '42703') {
        const { data: shortData, error: shortErr } = await supabase.from(tableName).insert([shortPayload]).select();
        if (!shortErr) {
          console.log(`[Supabase] Successfully saved simplified booking to table "${tableName}" (${id})`);
          return { success: true, table: tableName, details: shortData };
        }
        lastError = shortErr.message;
      }
    } catch (err: any) {
      lastError = err.message;
      console.warn(`[Supabase] Write to table "${tableName}" failed:`, err.message);
    }
  }

  console.warn(`[Supabase] Could not save to any table. Last error: ${lastError}`);
  return {
    success: false,
    error: lastError || 'Table not found in Supabase schema cache. Please create the "appointments" table in Supabase.',
  };
}

/**
 * Checks connection health and retrieves status of Supabase integration.
 */
export async function checkSupabaseStatus(): Promise<{
  connected: boolean;
  projectId: string;
  url: string;
  tables: Record<string, boolean>;
  message: string;
}> {
  const supabase = getSupabase();
  const projectId = 'dabdmtkappvpbbwsclxg';
  const url = SUPABASE_URL;

  if (!supabase) {
    return {
      connected: false,
      projectId,
      url,
      tables: {},
      message: 'Supabase client not initialized.',
    };
  }

  const tablesToCheck = ['appointments', 'bookings', 'orders'];
  const tableStatus: Record<string, boolean> = {};
  let anyTableFound = false;

  for (const t of tablesToCheck) {
    try {
      const { error } = await supabase.from(t).select('id').limit(1);
      if (!error) {
        tableStatus[t] = true;
        anyTableFound = true;
      } else {
        tableStatus[t] = false;
      }
    } catch {
      tableStatus[t] = false;
    }
  }

  return {
    connected: true,
    projectId,
    url,
    tables: tableStatus,
    message: anyTableFound
      ? 'Connected and active tables verified in Supabase!'
      : 'Connected to Supabase project. Awaiting creation of "appointments" table.',
  };
}
