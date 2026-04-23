import { createClient } from "@supabase/supabase-js";

import { getSupabasePublicEnvOrNull, getSupabasePublishableKey, getSupabaseUrl } from "@/lib/env";

export function createSupabaseClient() {
  return createClient(getSupabaseUrl(), getSupabasePublishableKey());
}

export function createOptionalSupabaseClient() {
  const env = getSupabasePublicEnvOrNull();
  if (!env) {
    return null;
  }

  return createClient(env.url, env.publishableKey);
}
