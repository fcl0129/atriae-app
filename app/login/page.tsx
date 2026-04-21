'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      setError('Authentication is not configured. Add Supabase env variables in Vercel.')
      return
    }

    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      return
    }

    router.replace('/dashboard')
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center space-y-6">
      <h1 className="text-3xl">Sign in</h1>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl px-4 py-3" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl px-4 py-3" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button onClick={handleLogin} className="rounded-full bg-foreground text-background px-4 py-3">Sign in</button>
    </div>
  )
}
