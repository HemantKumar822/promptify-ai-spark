import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
    env: import.meta.env
  })
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  api_key_encrypted: string | null
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserPrompt {
  id: string
  user_id: string
  input_prompt: string
  enhanced_prompt: string
  is_image_prompt: boolean
  enhancement_mode: string
  is_saved: boolean
  created_at: string
}

export interface UserSettings {
  user_id: string
  theme: 'light' | 'dark'
  default_enhancement_mode: string
  auto_save_history: boolean
  settings: Record<string, any>
  updated_at: string
}