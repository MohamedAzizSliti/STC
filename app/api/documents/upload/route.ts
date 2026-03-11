import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "documents";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json(
      { message: "Expected multipart form data" },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  const documentType = formData.get("document_type") as string | null;

  if (!file || !documentType?.trim()) {
    return NextResponse.json(
      { message: "file and document_type are required" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { message: "File too large (max 10MB)" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "File type not allowed (PDF, DOCX, JPG, PNG, WebP)" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() || "bin";
  const safeName = `${crypto.randomUUID()}.${ext}`;
  const path = `${user.id}/${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { message: uploadError.message },
      { status: 500 }
    );
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const fileUrl = urlData.publicUrl;

  const { data: doc, error: insertError } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      document_type: documentType.trim(),
      file_name: file.name,
      file_url: fileUrl,
      file_size: file.size,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { message: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(doc);
}
