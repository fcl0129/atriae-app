import { createBrowserSupabaseClient, createOptionalBrowserSupabaseClient } from "@/lib/supabase/browser";

/**
 * @deprecated Use createBrowserSupabaseClient from '@/lib/supabase/browser'.
 */
export function createSupabaseClient() {
  return createBrowserSupabaseClient();
}

/**
 * @deprecated Use createOptionalBrowserSupabaseClient from '@/lib/supabase/browser'.
 */
export function createOptionalSupabaseClient() {
  return createOptionalBrowserSupabaseClient();
}
