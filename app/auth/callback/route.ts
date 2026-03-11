import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSupabaseUrl, getSupabaseAnonKey } from "@/lib/supabase/env";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);

    // Create profile + role row if coming from email confirmation (metadata set at signup)
    if (user) {
      const userType = (user.user_metadata?.user_type as string) || "student";
      const fullName = user.user_metadata?.full_name as string | undefined;
      if (["student", "jobseeker", "enterprise"].includes(userType)) {
        const admin = await createServiceRoleClient();
        await admin.from("profiles").upsert(
          {
            id: user.id,
            email: user.email!,
            user_type: userType,
            full_name: fullName ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
        if (userType === "student") {
          await admin.from("students").upsert(
            { user_id: user.id, updated_at: new Date().toISOString() },
            { onConflict: "user_id" }
          );
        } else if (userType === "jobseeker") {
          await admin.from("job_seekers").upsert(
            { user_id: user.id, updated_at: new Date().toISOString() },
            { onConflict: "user_id" }
          );
        } else {
          await admin.from("enterprises").upsert(
            { user_id: user.id, updated_at: new Date().toISOString() },
            { onConflict: "user_id" }
          );
        }
      }
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
