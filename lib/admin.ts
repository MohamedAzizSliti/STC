import { createClient } from "@/lib/supabase/server";

/** Returns true if the current user has profile.user_type === 'admin'. */
export async function requireAdmin(): Promise<{ ok: true; userId: string } | { ok: false; status: 401 | 403 }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401 };

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (profile?.user_type !== "admin") return { ok: false, status: 403 };
  return { ok: true, userId: user.id };
}
