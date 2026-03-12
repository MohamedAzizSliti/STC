import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

const BUCKET = "documents";
const PREFIX = "study-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/** POST: Upload an image for a study destination. Admin only. Returns { url }. */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { message: auth.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: auth.status }
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json(
      { message: "Expected multipart form data" },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  if (!file || !file.size) {
    return NextResponse.json(
      { message: "file is required" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { message: "File too large (max 5MB)" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { message: "Allowed types: JPEG, PNG, WebP, GIF" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpeg", "jpg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const path = `${PREFIX}/${crypto.randomUUID()}.${safeExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const admin = await createServiceRoleClient();
  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      {
        message: "Upload failed. Ensure the 'documents' bucket exists in Supabase Storage.",
        detail: uploadError.message,
      },
      { status: 500 }
    );
  }

  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: urlData.publicUrl });
}
