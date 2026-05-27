import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env variables — check your .env file')
}

// Single shared Supabase client for the entire customer app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
