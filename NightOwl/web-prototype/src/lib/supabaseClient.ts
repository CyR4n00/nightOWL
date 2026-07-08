import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Ensure you have set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.");
} else {
  // Strip trailing '/rest/v1/' or '/rest/v1' if present
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '');
}

// Use a dummy URL and key as fallback to prevent module-level evaluation crashes
// A UI boundary should handle the actual error display
const fallbackUrl = 'https://dummy.supabase.co';
const fallbackKey = 'dummy-key-to-prevent-crash';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl || fallbackUrl, supabaseAnonKey || fallbackKey);
