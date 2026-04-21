import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/digests/types";
import { assertSupabaseServiceEnv } from "@/lib/supabase/env";

export function createSupabaseServiceClient() {
  const { supabaseUrl, supabaseServiceRoleKey } = assertSupabaseServiceEnv();

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
