import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** POST: Express interest in a candidate (create match / contact request). Body: { posting_id }. */
export async function POST(
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

  const jobseekerId = (await params).id;
  const body = await request.json().catch(() => ({}));
  const postingId = typeof body.posting_id === "string" ? body.posting_id.trim() : null;
  if (!postingId) {
    return NextResponse.json({ message: "posting_id is required" }, { status: 400 });
  }

  const { data: posting } = await supabase
    .from("job_postings")
    .select("id")
    .eq("id", postingId)
    .eq("enterprise_id", enterprise.id)
    .single();

  if (!posting) {
    return NextResponse.json({ message: "Posting not found" }, { status: 404 });
  }

  const { data: existing } = await supabase
    .from("matches")
    .select("id")
    .eq("jobseeker_id", jobseekerId)
    .eq("posting_id", postingId)
    .eq("enterprise_id", enterprise.id)
    .maybeSingle();

  if (existing) {
    const { data: updated } = await supabase
      .from("matches")
      .update({ contact_requested: true, viewed_by_enterprise: true })
      .eq("id", existing.id)
      .select()
      .single();
    return NextResponse.json(updated ?? existing);
  }

  const { data: match, error } = await supabase
    .from("matches")
    .insert({
      jobseeker_id: jobseekerId,
      posting_id: postingId,
      enterprise_id: enterprise.id,
      contact_requested: true,
      viewed_by_enterprise: true,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(match);
}
