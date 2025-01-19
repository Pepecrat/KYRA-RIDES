import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/config/supabase';

if (!SUPABASE_CONFIG.anonKey) {
  throw new Error('Missing Supabase anon key');
}

export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
); 