import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy_anon_key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("Supabase URL or Anon Key is missing. Using dummy placeholders to prevent app crash.");
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
