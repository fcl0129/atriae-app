import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const protectedRoutes = ['/dashboard', '/learn', '/rituals', '/settings']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtected) {
      const url = new URL('/login', request.url)
      url.searchParams.set('error', 'config')
      return NextResponse.redirect(url)
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
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        }
      }
    })

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user && isProtected) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  } catch {
    if (isProtected) {
      const url = new URL('/login', request.url)
      url.searchParams.set('error', 'auth')
      return NextResponse.redirect(url)
    }

    return response
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/learn/:path*', '/rituals/:path*', '/settings/:path*', '/login']
}
