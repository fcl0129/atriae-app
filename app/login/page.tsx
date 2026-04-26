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
  const [action, setAction] = useState<'signin' | 'signup' | null>(null)
  const [redirectTo, setRedirectTo] = useState('/dashboard')
  const [contextMessage, setContextMessage] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRedirectTo(sanitizeRedirectTarget(params.get('redirectTo')))
    const errorCode = params.get('error')
    if (errorCode === 'config') {
      setContextMessage('Atriae auth is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as fallback), then refresh.')
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

  function validateCredentials() {
    if (!email.trim()) {
      setError('Please enter your email address.')
      setSuccess(null)
      return false
    }

    if (!password) {
      setError('Please enter your password.')
      setSuccess(null)
      return false
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setSuccess(null)
      return false
    }

    return true
  }

  function logDevelopmentAuthError(prefix: string, error: { code?: string; status?: number; message: string }) {
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    console.error(prefix, {
      code: error.code ?? null,
      status: error.status ?? null,
      message: error.message,
    })
  }

  async function handleSignIn() {
    if (!requireAuthEnvironment()) {
      return
    }
    if (!validateCredentials()) {
      return
    }

    try {
      setAction('signin')
      setError(null)
      setSuccess(null)

      const supabase = createBrowserSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        logDevelopmentAuthError('Sign-in failed', error)
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
      setAction(null)
    }
  }

  function mapSignUpError(message: string) {
    const normalized = message.toLowerCase()

    if (normalized.includes('signups not allowed') || normalized.includes('signup is disabled')) {
      return 'Signups are currently disabled in Supabase. Turn on "Allow new users to sign up".'
    }

    if (normalized.includes('already registered') || normalized.includes('already been registered')) {
      return 'That email is already registered. Try signing in instead.'
    }

    if (normalized.includes('password should be at least') || normalized.includes('password is too short')) {
      return 'Password must be at least 6 characters.'
    }

    if (normalized.includes('invalid email')) {
      return 'Please enter a valid email address.'
    }

    return message
  }

  async function handleSignUp() {
    if (!requireAuthEnvironment()) {
      return
    }
    if (!validateCredentials()) {
      return
    }

    try {
      setAction('signup')
      setError(null)
      setSuccess(null)

      const supabase = createBrowserSupabaseClient()
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) {
        logDevelopmentAuthError('Sign-up failed', error)
        setError(mapSignUpError(error.message))
        return
      }

      if (data.session) {
        window.location.assign(redirectTo)
        return
      }

      if (data.user && !data.session) {
        setSuccess('Your account was created, but Supabase requires email confirmation. Turn off Confirm email in Supabase for immediate login.')
        return
      }

      setSuccess('Your account was created. Please sign in.')
    } catch {
      setError('Something went wrong while creating your account. Please try again.')
    } finally {
      setAction(null)
    }
  }

  async function handleAuthSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    const intent = submitter?.value

    if (intent === 'signup') {
      await handleSignUp()
      return
    }

    await handleSignIn()
  }


  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center space-y-6">
      <h1 className="text-3xl">Sign in</h1>

      <form onSubmit={handleAuthSubmit} className="space-y-3">
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
          name="intent"
          value="signin"
          disabled={action !== null}
          className="w-full rounded-full bg-foreground text-background px-4 py-3"
        >
          {action === 'signin' ? 'Signing in…' : 'Sign in'}
        </button>

        <button
          type="submit"
          name="intent"
          value="signup"
          disabled={action !== null}
          className="w-full rounded-full border border-foreground px-4 py-3"
        >
          {action === 'signup' ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-sm text-muted-foreground">Use your email and password to sign in or create a new Atriae account.</p>
      </form>
    </div>
  )
}
