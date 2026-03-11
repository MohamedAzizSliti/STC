import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const userType = body.userType as string | undefined;
  const fullName = body.fullName as string | undefined;

  if (!userType || !["student", "jobseeker", "enterprise"].includes(userType)) {
    return NextResponse.json(
      { message: "Invalid user type" },
      { status: 400 }
    );
  }

  const admin = await createServiceRoleClient();

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: user.id,
      email: user.email!,
      user_type: userType,
      full_name: fullName ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (profileError) {
    return NextResponse.json(
      { message: profileError.message },
      { status: 500 }
    );
  }

  if (userType === "student") {
    const { error: studentError } = await admin.from("students").upsert(
      { user_id: user.id, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    if (studentError) {
      return NextResponse.json(
        { message: studentError.message },
        { status: 500 }
      );
    }
  } else if (userType === "jobseeker") {
    const { error: jobSeekerError } = await admin.from("job_seekers").upsert(
      { user_id: user.id, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    if (jobSeekerError) {
      return NextResponse.json(
        { message: jobSeekerError.message },
        { status: 500 }
      );
    }
  } else if (userType === "enterprise") {
    const { error: enterpriseError } = await admin.from("enterprises").upsert(
      { user_id: user.id, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    if (enterpriseError) {
      return NextResponse.json(
        { message: enterpriseError.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
