import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const ALLOWED_FIELDS = [
  "first_name",
  "last_name",
  "phone",
  "location",
  "nationality",
  "professional_summary",
  "years_experience",
  "education_level",
  "skills",
  "languages",
  "industry_primary",
  "industry_secondary",
  "job_preferences",
  "profile_visible",
  "cv_url",
];

/** GET: Current user's job seeker profile. Creates row if missing (user_type jobseeker). */
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

  if (profile?.user_type !== "jobseeker") {
    return NextResponse.json(
      { message: "Not a job seeker account" },
      { status: 403 }
    );
  }

  let { data: jobSeeker, error } = await supabase
    .from("job_seekers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .single();

  if (error && error.code === "PGRST116") {
    const admin = await createServiceRoleClient();
    const { data: inserted, error: insertErr } = await admin
      .from("job_seekers")
      .insert({ user_id: user.id })
      .select()
      .single();
    if (insertErr) {
      return NextResponse.json(
        { message: insertErr.message },
        { status: 500 }
      );
    }
    jobSeeker = inserted;
  } else if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ...jobSeeker,
    email: profileRow?.email ?? user.email ?? null,
  });
}

/** PATCH: Update current user's job seeker profile. */
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

  if (profile?.user_type !== "jobseeker") {
    return NextResponse.json(
      { message: "Not a job seeker account" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const updates: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] === undefined) continue;
    if (key === "skills" || key === "languages") {
      updates[key] = Array.isArray(body[key]) ? body[key] : [];
    } else if (key === "job_preferences") {
      updates[key] = body[key] && typeof body[key] === "object" ? body[key] : {};
    } else if (key === "profile_visible") {
      updates[key] = !!body[key];
    } else {
      updates[key] = body[key];
    }
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("job_seekers")
    .update(updates)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
