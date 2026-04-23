import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/digests/types";
import { getServiceRoleKey, getSupabaseUrl } from "@/lib/env";

export function createSupabaseServiceClient() {
  return createClient<Database>(getSupabaseUrl(), getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
