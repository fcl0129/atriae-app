export const SUPABASE_PUBLIC_ENV_ERROR = "Supabase public environment variables are missing";
export const SUPABASE_SERVICE_ROLE_ENV_ERROR = "SUPABASE_SERVICE_ROLE_KEY is missing";
export const AUTH_CONFIGURATION_ERROR = "Authentication is not configured. Add Supabase env variables in Vercel.";

function readEnv(name: keyof NodeJS.ProcessEnv) {
  const value = process.env[name];
  return value?.trim() ? value : undefined;
}

export function getSupabaseUrl(): string {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  if (!url) {
    throw new Error(SUPABASE_PUBLIC_ENV_ERROR);
  }

  return url;
}

export function getOptionalLegacyAnonKey(): string | undefined {
  return readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getSupabasePublishableKey(): string {
  const publishableKey = readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  if (publishableKey) {
    return publishableKey;
  }

  const legacyAnonKey = getOptionalLegacyAnonKey();
  if (legacyAnonKey) {
    return legacyAnonKey;
  }

  throw new Error(SUPABASE_PUBLIC_ENV_ERROR);
}

export function getServiceRoleKey(): string {
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRoleKey) {
    throw new Error(SUPABASE_SERVICE_ROLE_ENV_ERROR);
  }

  return serviceRoleKey;
}

export function getSupabasePublicEnvOrNull(): { url: string; publishableKey: string } | null {
  try {
    return {
      url: getSupabaseUrl(),
      publishableKey: getSupabasePublishableKey(),
    };
  } catch {
    return null;
  }
}

export function isSupabasePublicEnvConfigured(): boolean {
  return getSupabasePublicEnvOrNull() !== null;
}
