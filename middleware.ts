import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSupabasePublishableKey, getSupabaseUrl, isSupabasePublicEnvConfigured } from '@/lib/env'

const protectedRoutes = ['/dashboard', '/learn', '/rituals', '/settings']

function getSafeRedirectTarget(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return null
  }

  return value
}

function buildLoginUrl(request: NextRequest, reason?: 'config' | 'auth') {
  const url = new URL('/login', request.url)
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`

  if (nextPath && nextPath !== '/login') {
    url.searchParams.set('redirectTo', nextPath)
  }

  if (reason) {
    url.searchParams.set('error', reason)
  }

  return url
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (!isSupabasePublicEnvConfigured()) {
    if (isProtected) {
      return NextResponse.redirect(buildLoginUrl(request, 'config'))
    }

    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  try {
    const supabase = createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        }
      }
    })

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user && isProtected) {
      return NextResponse.redirect(buildLoginUrl(request))
    }

    if (user && pathname === '/login') {
      const redirectTo = getSafeRedirectTarget(request.nextUrl.searchParams.get('redirectTo'))
      if (redirectTo) {
        return NextResponse.redirect(new URL(redirectTo, request.url))
      }

      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  } catch {
    if (isProtected) {
      return NextResponse.redirect(buildLoginUrl(request, 'auth'))
    }

    return response
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/learn/:path*', '/rituals/:path*', '/settings/:path*', '/login']
}
