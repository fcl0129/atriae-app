import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseEnv } from './config'

export function createBrowserSupabaseClient() {
  const env = getSupabaseEnv()
  if (!env) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  return createBrowserClient(
    env.url,
    env.anonKey
  )
}
