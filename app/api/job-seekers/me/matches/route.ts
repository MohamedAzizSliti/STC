import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** GET: List matches (employer interest) for current job seeker. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: jobSeeker } = await supabase
    .from("job_seekers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!jobSeeker) {
    return NextResponse.json(
      { message: "Job seeker profile not found" },
      { status: 403 }
    );
  }

  const { data: matches, error } = await supabase
    .from("matches")
    .select("id, posting_id, enterprise_id, contact_requested, status, created_at")
    .eq("jobseeker_id", jobSeeker.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const list = matches ?? [];
  if (list.length === 0) {
    return NextResponse.json([]);
  }

  const postingIds = [...new Set(list.map((m) => m.posting_id))];
  const enterpriseIds = [...new Set(list.map((m) => m.enterprise_id))];

  const [postingsRes, enterprisesRes] = await Promise.all([
    supabase.from("job_postings").select("id, title, department, location").in("id", postingIds),
    supabase.from("enterprises").select("id, company_name").in("id", enterpriseIds),
  ]);

  const postingsById = Object.fromEntries(
    (postingsRes.data ?? []).map((p) => [p.id, p])
  );
  const enterprisesById = Object.fromEntries(
    (enterprisesRes.data ?? []).map((e) => [e.id, e])
  );

  const result = list.map((m) => ({
    id: m.id,
    contact_requested: m.contact_requested,
    status: m.status,
    created_at: m.created_at,
    posting: postingsById[m.posting_id]
      ? { id: postingsById[m.posting_id].id, title: postingsById[m.posting_id].title, department: postingsById[m.posting_id].department, location: postingsById[m.posting_id].location }
      : null,
    enterprise: enterprisesById[m.enterprise_id]
      ? { id: enterprisesById[m.enterprise_id].id, company_name: enterprisesById[m.enterprise_id].company_name }
      : null,
  }));

  return NextResponse.json(result);
}
