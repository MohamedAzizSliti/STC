import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** GET: List current enterprise's job postings. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: enterprise } = await supabase
    .from("enterprises")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!enterprise) {
    return NextResponse.json(
      { message: "Enterprise profile not found" },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("job_postings")
    .select("*")
    .eq("enterprise_id", enterprise.id)
    .order("posted_date", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

/** POST: Create a job posting. */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: enterprise } = await supabase
    .from("enterprises")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!enterprise) {
    return NextResponse.json(
      { message: "Enterprise profile not found" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ message: "title is required" }, { status: 400 });
  }

  const row = {
    enterprise_id: enterprise.id,
    title,
    department: typeof body.department === "string" ? body.department.trim() || null : null,
    location: typeof body.location === "string" ? body.location.trim() || null : null,
    positions_available: typeof body.positions_available === "number" && body.positions_available >= 1 && body.positions_available <= 5
      ? body.positions_available
      : 1,
    employment_type: typeof body.employment_type === "string" ? body.employment_type.trim() || null : null,
    experience_required: typeof body.experience_required === "string" ? body.experience_required.trim() || null : null,
    education_required: typeof body.education_required === "string" ? body.education_required.trim() || null : null,
    skills_required: Array.isArray(body.skills_required) ? body.skills_required : (typeof body.skills_required === "string" ? [] : []),
    languages_required: Array.isArray(body.languages_required) ? body.languages_required : (typeof body.languages_required === "string" ? [] : []),
    salary_range: typeof body.salary_range === "string" ? body.salary_range.trim() || null : null,
    description: typeof body.description === "string" ? body.description.trim() || null : null,
    expiry_date: body.expiry_date && typeof body.expiry_date === "string" ? body.expiry_date : null,
    status: body.status === "published" ? "published" : "draft",
  };

  const { data, error } = await supabase
    .from("job_postings")
    .insert(row)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
