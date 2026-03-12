import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** PATCH: Update a job posting (must belong to current enterprise). */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const allowed = [
    "title", "department", "location", "positions_available",
    "employment_type", "experience_required", "education_required",
    "skills_required", "languages_required", "salary_range",
    "description", "expiry_date", "status",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] === undefined) continue;
    if (key === "positions_available") {
      const n = Number(body[key]);
      if (n >= 1 && n <= 5) updates[key] = n;
    } else if (key === "status" && (body[key] === "draft" || body[key] === "published")) {
      updates[key] = body[key];
    } else if (key === "skills_required" || key === "languages_required") {
      updates[key] = Array.isArray(body[key]) ? body[key] : [];
    } else if (typeof body[key] === "string" || typeof body[key] === "number" || body[key] === null) {
      updates[key] = body[key];
    }
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("job_postings")
    .update(updates)
    .eq("id", id)
    .eq("enterprise_id", enterprise.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ message: "Posting not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

/** DELETE: Remove a job posting. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;
  const { error } = await supabase
    .from("job_postings")
    .delete()
    .eq("id", id)
    .eq("enterprise_id", enterprise.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
