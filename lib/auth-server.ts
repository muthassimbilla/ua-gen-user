import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { User, UserSession } from "./auth-client"

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie setting errors gracefully
            console.warn("Failed to set cookie:", name, error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // Handle cookie removal errors gracefully
            console.warn("Failed to remove cookie:", name, error)
          }
        },
      },
    },
  )
}

// Server-side session validation - only use in server components/actions
export async function validateServerSession(
  sessionToken?: string,
): Promise<{ user: User; session: UserSession } | null> {
  if (!sessionToken) return null

  try {
    const supabase = createServerSupabaseClient()

    const { data: session, error: sessionError } = await supabase
      .from("user_sessions")
      .select(`
        *,
        users (
          id,
          full_name,
          telegram_username,
          created_at,
          updated_at
        )
      `)
      .eq("session_token", sessionToken)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (sessionError || !session) {
      return null
    }

    // Update last accessed time
    await supabase.from("user_sessions").update({ last_accessed: new Date().toISOString() }).eq("id", session.id)

    return {
      user: session.users as User,
      session: session as UserSession,
    }
  } catch (error) {
    console.error("Server session validation error:", error)
    return null
  }
}
