import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'dabdmtkappvpbbwsclxg';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_3o9OjXgz9oCw4roZ-C6zmg_lBp7dmMF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseAppointment {
  id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  appointment_date: string;
  appointment_time?: string;
  order_type?: string;
  total_amount?: number;
  status?: string;
  notes?: string;
  items?: any;
  created_at?: string;
}

export async function submitAppointmentToSupabase(data: SupabaseAppointment) {
  try {
    const { data: result, error } = await supabase
      .from('appointments')
      .insert([data])
      .select();
    
    if (error) {
      console.warn('[Supabase Client] appointments table insert error:', error.message);
      // Fallback attempt to bookings
      const fallback = await supabase.from('bookings').insert([data]).select();
      if (!fallback.error) return { success: true, data: fallback.data };
      return { success: false, error: error.message };
    }
    return { success: true, data: result };
  } catch (err: any) {
    console.error('[Supabase Client] Exception:', err);
    return { success: false, error: err.message };
  }
}
