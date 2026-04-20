import { createClient } from "@supabase/supabase-js";

import { assertSupabaseEnv, getSupabaseEnv } from "@/lib/supabase/env";

export function createSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = assertSupabaseEnv();

  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = (() => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
})();
