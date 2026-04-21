import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const protectedRoutes = ['/dashboard', '/learn', '/rituals', '/settings']

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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtected) {
      return NextResponse.redirect(buildLoginUrl(request, 'config'))
    }

    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
      const redirectTo = request.nextUrl.searchParams.get('redirectTo')
      if (redirectTo && redirectTo.startsWith('/')) {
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
