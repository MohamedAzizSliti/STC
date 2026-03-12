import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

/** GET: Check if current user is admin. Returns 200 { ok: true } or 401/403. */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: auth.status === 401 ? "Unauthorized" : "Forbidden" }, { status: auth.status });
  }
  return NextResponse.json({ ok: true });
}
