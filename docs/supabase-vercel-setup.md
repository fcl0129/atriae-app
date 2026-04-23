# Supabase + Vercel setup

Add these environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL` (required)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (required, preferred)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional legacy fallback only)
- `SUPABASE_SERVICE_ROLE_KEY` (only required if you run server/admin code paths that need elevated Supabase access)

Where to find values in Supabase:

- Open your Supabase project
- Use the **Connect** dialog or **Project Settings → API Keys**
- Copy the project URL and API keys from there

Where to add them in Vercel:

- **Production**
- **Preview**
- **Development** (optional but recommended for consistent local/preview behavior)

After any environment variable change, trigger a redeploy so the new values are applied.
