import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

/** GET: List documents for the student who submitted this application. Admin only. */
export async function GET(
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

  const { id: applicationId } = await params;
  const admin = await createServiceRoleClient();

  const { data: application, error: appError } = await admin
    .from("applications")
    .select("student_id")
    .eq("id", applicationId)
    .single();

  if (appError || !application) {
    return NextResponse.json(
      { message: "Application not found" },
      { status: 404 }
    );
  }

  const { data: student, error: studentError } = await admin
    .from("students")
    .select("user_id")
    .eq("id", application.student_id)
    .single();

  if (studentError || !student) {
    return NextResponse.json(
      { message: "Student not found" },
      { status: 404 }
    );
  }

  const { data: documents, error: docError } = await admin
    .from("documents")
    .select("id, document_type, file_name, file_url, file_size, upload_date, verified")
    .eq("user_id", student.user_id)
    .order("upload_date", { ascending: false });

  if (docError) {
    return NextResponse.json(
      { message: docError.message },
      { status: 500 }
    );
  }

  const list = (documents || []).map((d) => ({
    ...d,
    is_payment_proof: d.document_type.startsWith("Payment Proof - "),
  }));

  return NextResponse.json(list);
}
