import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

/** GET: List all study destinations. Admin only. */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: auth.status }
    );
  }
  const admin = await createServiceRoleClient();
  const { data, error } = await admin
    .from("study_destinations")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

/** POST: Create a study destination. Admin only. */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: auth.status }
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  const slug =
    typeof (body as Record<string, unknown>).slug === "string"
      ? (body as Record<string, unknown>).slug as string
      : "";
  const name =
    typeof (body as Record<string, unknown>).name === "string"
      ? (body as Record<string, unknown>).name as string
      : "";
  if (!slug.trim() || !name.trim()) {
    return NextResponse.json(
      { message: "slug and name are required" },
      { status: 400 }
    );
  }
  const row = {
    slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
    name: name.trim(),
    description: typeof (body as Record<string, unknown>).description === "string" ? (body as Record<string, unknown>).description as string : "",
    image: typeof (body as Record<string, unknown>).image === "string" ? (body as Record<string, unknown>).image as string : "",
    overview:
      (body as Record<string, unknown>).overview != null &&
      typeof (body as Record<string, unknown>).overview === "object"
        ? (body as Record<string, unknown>).overview as Record<string, unknown>
        : { system: "", topUniversities: [], calendar: "" },
    costs:
      (body as Record<string, unknown>).costs != null &&
      typeof (body as Record<string, unknown>).costs === "object"
        ? (body as Record<string, unknown>).costs as Record<string, unknown>
        : { tuition: "", living: "", scholarships: "" },
    requirements:
      (body as Record<string, unknown>).requirements != null &&
      typeof (body as Record<string, unknown>).requirements === "object"
        ? (body as Record<string, unknown>).requirements as Record<string, unknown>
        : { visa: "", language: "", documents: "" },
    living:
      (body as Record<string, unknown>).living != null &&
      typeof (body as Record<string, unknown>).living === "object"
        ? (body as Record<string, unknown>).living as Record<string, unknown>
        : { accommodation: "", lifestyle: "", testimonial: "" },
    sort_order:
      typeof (body as Record<string, unknown>).sort_order === "number"
        ? (body as Record<string, unknown>).sort_order as number
        : 0,
  };

  const admin = await createServiceRoleClient();
  const { data, error } = await admin.from("study_destinations").insert(row).select("id, slug, name").single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "A study with this slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
