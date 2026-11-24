import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://phdwhcoyzrmucklysqzv.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_rB0KeruABhwbSXpnglEhww_Lte2BL6J';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
