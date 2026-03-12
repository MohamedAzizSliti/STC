import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** GET: Search job seekers visible to enterprises. Enterprise auth required. */
export async function GET(request: Request) {
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

  if (profile?.user_type !== "enterprise") {
    return NextResponse.json(
      { message: "Enterprise account required" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const industry = searchParams.get("industry") || undefined;
  const skills = searchParams.get("skills"); // comma-separated
  const experience = searchParams.get("experience") || undefined;
  const education = searchParams.get("education") || undefined;
  const q = searchParams.get("q") || "";

  let query = supabase
    .from("job_seekers")
    .select("id, first_name, last_name, professional_summary, years_experience, education_level, skills, languages, industry_primary, industry_secondary, location, nationality, cv_url, created_at")
    .eq("profile_visible", true)
    .order("created_at", { ascending: false });

  if (industry) {
    query = query.or(`industry_primary.eq.${industry},industry_secondary.eq.${industry}`);
  }
  if (experience) {
    query = query.eq("years_experience", experience);
  }
  if (education) {
    query = query.eq("education_level", education);
  }

  const { data: list, error } = await query;

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  let results = list ?? [];
  if (skills?.trim()) {
    const skillSet = new Set(skills.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
    if (skillSet.size > 0) {
      results = results.filter((j) => {
        const arr = (j.skills as string[]) ?? [];
        return arr.some((s) => skillSet.has(String(s).toLowerCase()));
      });
    }
  }
  if (q.trim()) {
    const lower = q.toLowerCase();
    results = results.filter((j) => {
      const name = [j.first_name, j.last_name].filter(Boolean).join(" ").toLowerCase();
      const summary = (j.professional_summary ?? "").toLowerCase();
      const skillsStr = ((j.skills as string[]) ?? []).join(" ").toLowerCase();
      return name.includes(lower) || summary.includes(lower) || skillsStr.includes(lower);
    });
  }

  return NextResponse.json(
    results.map((j) => ({
      id: j.id,
      first_name: j.first_name,
      last_name: j.last_name,
      name: [j.first_name, j.last_name].filter(Boolean).join(" ") || "Candidate",
      professional_summary: j.professional_summary,
      years_experience: j.years_experience,
      education_level: j.education_level,
      skills: j.skills ?? [],
      languages: j.languages ?? [],
      industry_primary: j.industry_primary,
      industry_secondary: j.industry_secondary,
      location: j.location,
      nationality: j.nationality,
      cv_url: j.cv_url,
    }))
  );
}
