import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

/** GET: List all applications with student info. Admin only. */
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: auth.status === 401 ? "Unauthorized" : "Forbidden" }, { status: auth.status });
  }

  const admin = await createServiceRoleClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const paymentStatus = searchParams.get("payment_status") || undefined;

  let query = admin
    .from("applications")
    .select("id, student_id, target_country, university, program, application_platform, status, payment_status, tracking_number, submission_date, notes, created_at, updated_at")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  if (paymentStatus) query = query.eq("payment_status", paymentStatus);
  const { data: applications, error: appError } = await query;

  if (appError) {
    return NextResponse.json({ message: appError.message }, { status: 500 });
  }

  const studentIds = [...new Set((applications || []).map((a) => a.student_id))];
  const { data: students } = await admin
    .from("students")
    .select("id, user_id, first_name, last_name")
    .in("id", studentIds);

  const userIds = [...new Set((students || []).map((s) => s.user_id))];
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email")
    .in("id", userIds);

  const emailByUserId = Object.fromEntries((profiles || []).map((p) => [p.id, p.email]));
  const studentsById = Object.fromEntries(
    (students || []).map((s) => [
      s.id,
      {
        ...s,
        email: emailByUserId[s.user_id] ?? null,
      },
    ])
  );

  const list = (applications || []).map((app) => ({
    ...app,
    student: studentsById[app.student_id] ?? null,
  }));

  return NextResponse.json(list);
}
