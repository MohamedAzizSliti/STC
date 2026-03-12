import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_FIELDS = [
  "company_name",
  "registration_number",
  "industry",
  "company_size",
  "headquarters_location",
  "website",
  "description",
  "logo_url",
  "contact_person",
  "contact_email",
  "contact_phone",
];

/** GET: Current user's enterprise profile. */
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

  if (profile?.user_type !== "enterprise") {
    return NextResponse.json(
      { message: "Not an enterprise account" },
      { status: 403 }
    );
  }

  const { data: enterprise, error } = await supabase
    .from("enterprises")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ message: "Enterprise profile not found" }, { status: 404 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(enterprise);
}

/** PATCH: Update current user's enterprise profile. */
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

  if (profile?.user_type !== "enterprise") {
    return NextResponse.json(
      { message: "Not an enterprise account" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const updates: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("enterprises")
    .update(updates)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
