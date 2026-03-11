import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** GET: List current user's documents. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("documents")
    .select("id, document_type, file_name, file_url, file_size, upload_date, verified")
    .eq("user_id", user.id)
    .order("upload_date", { ascending: false });

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json(data ?? []);
}
