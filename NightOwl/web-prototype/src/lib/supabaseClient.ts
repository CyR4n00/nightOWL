import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Ensure you have set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.");
}

// Ensure any trailing API path segments (like /rest/v1 or /rest/v1/) are stripped from the URL
const cleanSupabaseUrl = (supabaseUrl || '').replace(/\/rest\/v1\/?$/, '');

// Create a single supabase client for interacting with your database
// When keys are missing, we fallback to a dummy URL to prevent createClient from throwing 'supabaseUrl is required' before App.tsx can render the UI boundary.
export const supabase = createClient(cleanSupabaseUrl || 'https://dummy.supabase.co', supabaseAnonKey || 'dummy');
