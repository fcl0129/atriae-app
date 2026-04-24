'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'
import { AUTH_CONFIGURATION_ERROR, isSupabasePublicEnvConfigured } from '@/lib/env'

function sanitizeRedirectTarget(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard'
  }

  return value
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/dashboard')
  const [contextMessage, setContextMessage] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRedirectTo(sanitizeRedirectTarget(params.get('redirectTo')))
    const errorCode = params.get('error')
    if (errorCode === 'config') {
      setContextMessage('Atriae auth is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, then refresh.')
    } else if (errorCode === 'auth') {
      setContextMessage('Your session could not be refreshed. Please sign in again.')
    } else {
      setContextMessage(null)
    }
  }, [])

  async function handleLogin(e?: FormEvent) {
    e?.preventDefault()

    if (!isSupabasePublicEnvConfigured()) {
      setError(AUTH_CONFIGURATION_ERROR)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const supabase = createBrowserSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          setError('Email or password looks incorrect. Please try again.')
        } else {
          setError(error.message)
        }
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
        {contextMessage && <p className="rounded-xl bg-paper/70 px-3 py-2 text-sm text-muted-foreground">{contextMessage}</p>}
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
