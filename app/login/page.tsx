'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/dashboard')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const next = params.get('redirectTo')
    if (next && next.startsWith('/')) {
      setRedirectTo(next)
    }
  }, [])

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      setError('Authentication is not configured. Add Supabase env variables in Vercel.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const supabase = createBrowserSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
        return
      }

      window.location.assign(redirectTo)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center space-y-6">
      <h1 className="text-3xl">Sign in</h1>

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-xl px-4 py-3"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-xl px-4 py-3"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-foreground text-background px-4 py-3"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
