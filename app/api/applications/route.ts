import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** GET: List applications for the current student. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!student) {
    return NextResponse.json(
      { message: "Student profile not found" },
      { status: 403 }
    );
  }

  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .eq("student_id", student.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json(applications ?? []);
}

/** POST: Create a new application (draft or submitted). */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!student) {
    return NextResponse.json(
      { message: "Student profile not found" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const target_country = body.target_country as string | undefined;
  if (!target_country) {
    return NextResponse.json(
      { message: "target_country is required" },
      { status: 400 }
    );
  }

  const application = {
    student_id: student.id,
    target_country,
    university: body.university ?? null,
    program: body.program ?? null,
    application_platform: body.application_platform ?? null,
    status: (body.submit ? "submitted" : "draft") as string,
    payment_status: body.submit ? "pending" : "pending",
    tracking_number: body.submit
      ? `STC-${Date.now().toString(36).toUpperCase()}`
      : null,
    submission_date: body.submit ? new Date().toISOString() : null,
    notes: body.notes ?? null,
  };

  const { data, error } = await supabase
    .from("applications")
    .insert(application)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}
