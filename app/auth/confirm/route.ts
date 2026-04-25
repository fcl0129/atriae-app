import { NextResponse, type NextRequest } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

function getSafeRedirectTarget(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeRedirectTarget(requestUrl.searchParams.get("next"));

  if (!code) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "auth");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "config");
    return NextResponse.redirect(loginUrl);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/confirm] Failed to exchange auth code for session", {
      code: error.code,
      status: error.status,
    });

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "auth");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, request.url));
}
