import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** GET: List all study destinations (public). Ordered by sort_order. */
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_destinations")
    .select("id, slug, name, description, image, overview, costs, requirements, living, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const list = (data || []).map((row) => ({
    id: row.slug,
    name: row.name,
    description: row.description,
    image: row.image,
    overview: row.overview ?? { system: "", topUniversities: [], calendar: "" },
    costs: row.costs ?? { tuition: "", living: "", scholarships: "" },
    requirements: row.requirements ?? { visa: "", language: "", documents: "" },
    living: row.living ?? { accommodation: "", lifestyle: "", testimonial: "" },
  }));

  return NextResponse.json(list);
}
