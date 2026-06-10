import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite or use fallback values provided by the user
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vvybbxwygvtydvhaijqb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2eWJieHd5Z3Z0eWR2aGFpanFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMDU1MDYsImV4cCI6MjA5NTg4MTUwNn0.Id5zh9lsp88YCL-otxfskAh56ucWWIqHQRHIQYmgRVQ';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
