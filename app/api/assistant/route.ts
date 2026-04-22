import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "This endpoint has been replaced. Use /api/intelligence instead."
    },
    { status: 410 }
  );
}
