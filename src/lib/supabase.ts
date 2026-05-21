/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the client if the variables are defined to prevent startup crashes when keys are missing
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Utility to get the Supabase client safely
 * Throws an error if Supabase is not configured
 */
export const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
  }
  return supabase;
};

// You will need to create the following tables in your Supabase database:
// 1. `users` (id, name, email, avatar_url, preferences, created_at)
// 2. `entries` (id, user_id, title, content, type, data, created_at)
// 3. `user_tables` (id, user_id, name, schema, created_at)
// 4. `table_records` (id, table_id, data, created_at)
