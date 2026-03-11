import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/** GET: Fetch current user's student profile. Ensures student row exists if user_type is student. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (profile?.user_type !== "student") {
    return NextResponse.json(
      { message: "Not a student account" },
      { status: 403 }
    );
  }

  let { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code === "PGRST116") {
    const admin = await createServiceRoleClient();
    const { data: inserted, error: insertErr } = await admin
      .from("students")
      .insert({ user_id: user.id })
      .select()
      .single();
    if (insertErr) {
      return NextResponse.json(
        { message: insertErr.message },
        { status: 500 }
      );
    }
    student = inserted;
  } else if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(student);
}

/** PATCH: Update current user's student profile. */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (profile?.user_type !== "student") {
    return NextResponse.json(
      { message: "Not a student account" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const allowed = [
    "first_name",
    "last_name",
    "date_of_birth",
    "nationality",
    "passport_number",
    "phone",
    "address",
    "education_level",
    "target_country",
    "application_platform",
    "profile_completed",
    "documents_complete",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("students")
    .update(updates)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
