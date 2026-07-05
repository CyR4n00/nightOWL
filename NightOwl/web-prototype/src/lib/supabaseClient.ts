import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file. The application will not function properly without them.");
  // Provide a dummy URL specifically for local UI prototyping without a backend.
  // DO NOT mask this by ignoring the error, just pass placeholders to prevent Vite fast-refresh crashes on load.
}

// Clean the URL to remove any trailing paths like /rest/v1/ or /rest/v1
const cleanSupabaseUrl = supabaseUrl
  ? supabaseUrl.replace(/\/rest\/v1\/?$/, '')
  : 'https://dummy.supabase.co';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  cleanSupabaseUrl,
  supabaseAnonKey || 'dummy_anon_key'
);
