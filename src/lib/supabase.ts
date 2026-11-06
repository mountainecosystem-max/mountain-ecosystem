import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/^["']|["']$/g, '')
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim().replace(/^["']|["']$/g, '')

/**
 * Validates whether Supabase environment credentials are present and not default placeholders
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('your-project') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes('placeholder') &&
    !supabaseAnonKey.includes('your-anon-key')
  )
}

/**
 * Checks the active data mode:
 * - 'production': strictly queries live backend database, showing clean empty states when no client data exists
 * - 'preview': displays temporary development preview data for design/staging review
 */
export const getDefaultDataMode = (): 'production' | 'preview' => {
  const envMode = import.meta.env.VITE_DATA_MODE
  if (envMode === 'production') return 'production'
  if (envMode === 'preview') return 'preview'
  // In development, if Supabase is not yet configured, default to preview; once configured, default to production
  return isSupabaseConfigured() ? 'production' : 'preview'
}

/**
 * Supabase client instance
 * Uses dummy values if unconfigured to prevent initialization crash
 */
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
)
