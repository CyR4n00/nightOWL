import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite. For testing purposes, fall back to empty strings if not present.
// Note: In production, failing to provide these env vars will result in auth/db connection failures.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables. Features requiring Supabase will fail to initialize correctly.");
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
