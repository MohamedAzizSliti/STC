import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

/** GET: List all users (profiles) with optional role info. Admin only. */
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: auth.status === 401 ? "Unauthorized" : "Forbidden" }, { status: auth.status });
  }

  const admin = await createServiceRoleClient();
  const { searchParams } = new URL(request.url);
  const userType = searchParams.get("type") || undefined;

  let query = admin
    .from("profiles")
    .select("id, email, user_type, full_name, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (userType && ["student", "jobseeker", "enterprise", "admin"].includes(userType)) {
    query = query.eq("user_type", userType);
  }

  const { data: profiles, error } = await query;

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const ids = (profiles || []).map((p) => p.id);
  const [students, jobSeekers, enterprises] = await Promise.all([
    ids.length ? admin.from("students").select("user_id, first_name, last_name, profile_completed").in("user_id", ids) : { data: [] },
    ids.length ? admin.from("job_seekers").select("user_id, first_name, last_name, profile_visible").in("user_id", ids) : { data: [] },
    ids.length ? admin.from("enterprises").select("user_id, company_name, verified").in("user_id", ids) : { data: [] },
  ]);

  const studentsByUserId = Object.fromEntries((students.data || []).map((s) => [s.user_id, s]));
  const jobSeekersByUserId = Object.fromEntries((jobSeekers.data || []).map((j) => [j.user_id, j]));
  const enterprisesByUserId = Object.fromEntries((enterprises.data || []).map((e) => [e.user_id, e]));

  const users = (profiles || []).map((p) => ({
    ...p,
    student: studentsByUserId[p.id] ?? null,
    job_seeker: jobSeekersByUserId[p.id] ?? null,
    enterprise: enterprisesByUserId[p.id] ?? null,
  }));

  return NextResponse.json(users);
}
