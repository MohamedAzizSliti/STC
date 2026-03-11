import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseUrl, getSupabaseAnonKey } from './env'

/**
 * Server Supabase client (cookie-based session). Create a new client per request;
 * do not cache in a global variable.
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component; ignore (middleware refreshes session).
          }
        },
      },
    }
  )
}

/** Server-only client with service role for admin operations (e.g. create profile on signup). */
export async function createServiceRoleClient() {
  const { createClient } = await import('@supabase/supabase-js')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY (server-only, from Settings > API Keys).')
  return createClient(
    getSupabaseUrl(),
    serviceKey,
    { auth: { persistSession: false } }
  )
}
