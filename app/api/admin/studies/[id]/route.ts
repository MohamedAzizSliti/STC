import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

/** PATCH: Update a study destination. Admin only. id = UUID. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: auth.status }
    );
  }
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const updates: Record<string, unknown> = {};
  if (typeof b.slug === "string" && b.slug.trim()) updates.slug = b.slug.trim().toLowerCase().replace(/\s+/g, "-");
  if (typeof b.name === "string" && b.name.trim()) updates.name = b.name.trim();
  if (typeof b.description === "string") updates.description = b.description;
  if (typeof b.image === "string") updates.image = b.image;
  if (b.overview != null && typeof b.overview === "object") updates.overview = b.overview;
  if (b.costs != null && typeof b.costs === "object") updates.costs = b.costs;
  if (b.requirements != null && typeof b.requirements === "object") updates.requirements = b.requirements;
  if (b.living != null && typeof b.living === "object") updates.living = b.living;
  if (typeof b.sort_order === "number") updates.sort_order = b.sort_order;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ message: "No fields to update" }, { status: 400 });
  }

  const admin = await createServiceRoleClient();
  const { data, error } = await admin
    .from("study_destinations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "A study with this slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

/** DELETE: Remove a study destination. Admin only. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: auth.status }
    );
  }
  const { id } = await params;
  const admin = await createServiceRoleClient();
  const { error } = await admin.from("study_destinations").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
