/**
 * Supabase client key for browser/server/middleware.
 * Per https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 * you can use either NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (new) or
 * NEXT_PUBLIC_SUPABASE_ANON_KEY (legacy) from the project's Connect dialog.
 */
export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  return url
}

export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error(
      "Missing Supabase key. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (from project Connect dialog)."
    )
  }
  return key
}
