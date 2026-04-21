import { NextResponse } from "next/server";

import { DigestRepository } from "@/lib/digests/repository";
import { getUpcomingSends } from "@/lib/digests/scheduling";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createSupabaseServiceClient();
  const auth = await db.auth.getUser(token);
  if (auth.error || !auth.data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repository = new DigestRepository(db);
  const profile = await repository.getProfileById(id);

  if (!profile || profile.user_id !== auth.data.user.id) {
    return NextResponse.json({ error: "Digest not found." }, { status: 404 });
  }

  const upcoming = getUpcomingSends(profile.scheduling_config, 5).map((date) => date.toISOString());
  return NextResponse.json({ upcoming });
}
