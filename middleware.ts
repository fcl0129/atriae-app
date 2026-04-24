import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isSupabasePublicEnvConfigured } from "@/lib/env";
import { createMiddlewareSupabaseClient } from "@/lib/supabase/middleware";

const protectedRoutes = ["/dashboard", "/learn", "/rituals", "/settings"];

function getSafeRedirectTarget(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

function buildLoginUrl(request: NextRequest, reason?: "config" | "auth") {
  const url = new URL("/login", request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (nextPath && nextPath !== "/login") {
    url.searchParams.set("redirectTo", nextPath);
  }

  if (reason) {
    url.searchParams.set("error", reason);
  }

  return url;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isSupabasePublicEnvConfigured()) {
    if (isProtected) {
      return NextResponse.redirect(buildLoginUrl(request, "config"));
    }

    return NextResponse.next({ request });
  }

  const middlewareClient = createMiddlewareSupabaseClient(request);
  if (!middlewareClient) {
    if (isProtected) {
      return NextResponse.redirect(buildLoginUrl(request, "config"));
    }

    return NextResponse.next({ request });
  }

  const { supabase } = middlewareClient;

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user && isProtected) {
      return NextResponse.redirect(buildLoginUrl(request, "auth"));
    }

    if (user && pathname === "/login") {
      const redirectTo = getSafeRedirectTarget(request.nextUrl.searchParams.get("redirectTo"));
      if (redirectTo) {
        return NextResponse.redirect(new URL(redirectTo, request.url));
      }

      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return middlewareClient.response;
  } catch {
    if (isProtected) {
      return NextResponse.redirect(buildLoginUrl(request, "auth"));
    }

    return middlewareClient.response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/learn/:path*", "/rituals/:path*", "/settings/:path*", "/login"]
};
