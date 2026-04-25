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
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/dashboard')
  const [contextMessage, setContextMessage] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRedirectTo(sanitizeRedirectTarget(params.get('redirectTo')))
    const errorCode = params.get('error')
    if (errorCode === 'config') {
      setContextMessage('Atriae auth is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then refresh.')
    } else if (errorCode === 'auth') {
      setContextMessage('Your session could not be refreshed. Please sign in again.')
    } else {
      setContextMessage(null)
    }
  }, [])

  function requireAuthEnvironment() {
    if (!isSupabasePublicEnvConfigured()) {
      setError(AUTH_CONFIGURATION_ERROR)
      setSuccess(null)
      return false
    }

    return true
  }

  function buildEmailRedirectTo() {
    const callbackUrl = new URL('/auth/confirm', window.location.origin)
    callbackUrl.searchParams.set('next', redirectTo)
    return callbackUrl.toString()
  }

  function validateCredentials(requirePassword: boolean) {
    if (!email.trim()) {
      setError('Please enter your email address.')
      setSuccess(null)
      return false
    }

    if (requirePassword && !password) {
      setError('Please enter your password.')
      setSuccess(null)
      return false
    }

    return true
  }

  async function handleLogin(e?: FormEvent) {
    e?.preventDefault()

    if (!requireAuthEnvironment()) {
      return
    }
    if (!validateCredentials(true)) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

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
      setError('Something went wrong while signing you in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateAccount() {
    if (!requireAuthEnvironment()) {
      return
    }
    if (!validateCredentials(true)) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const supabase = createBrowserSupabaseClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: buildEmailRedirectTo(),
        },
      })

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          setError('That email already has an Atriae account. Try signing in instead.')
        } else {
          setError(`We couldn’t create your Atriae account: ${error.message}`)
        }
        return
      }

      if (data.session) {
        setSuccess('Welcome to Atriae! Your account is ready.')
        window.location.assign(redirectTo)
        return
      }

      setSuccess('Check your email to confirm your new Atriae account, then sign in.')
    } catch {
      setError('Something went wrong while creating your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink() {
    if (!requireAuthEnvironment()) {
      return
    }
    if (!validateCredentials(false)) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const supabase = createBrowserSupabaseClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: buildEmailRedirectTo(),
        },
      })

      if (error) {
        setError(`We couldn’t send your Atriae magic link: ${error.message}`)
        return
      }

      setSuccess('Magic link sent. Check your inbox to finish signing in.')
    } catch {
      setError('Something went wrong while sending your magic link. Please try again.')
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
        {success && <p className="text-sm text-emerald-600">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-foreground text-background px-4 py-3"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <button
          type="button"
          onClick={handleCreateAccount}
          disabled={loading}
          className="w-full rounded-full border border-foreground px-4 py-3"
        >
          {loading ? 'Please wait…' : 'Create account'}
        </button>

        <button
          type="button"
          onClick={handleMagicLink}
          disabled={loading}
          className="w-full rounded-full px-4 py-3 text-sm text-muted-foreground"
        >
          {loading ? 'Please wait…' : 'Send magic link instead'}
        </button>

        <p className="text-sm text-muted-foreground">New here? Create your Atriae account.</p>
      </form>
    </div>
  )
}
