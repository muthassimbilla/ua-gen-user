"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  email: string
  full_name?: string
  telegram_username?: string
  user_agent_limit: number
  subscription_end_date?: string
  status: "pending" | "approved" | "rejected" | "suspended"
  role: "user" | "admin" | "super_admin"
  created_at: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("[v0] Fetching profile for user:", userId)
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error) {
        console.log("[v0] Profile fetch error:", error)
        // If table doesn't exist or no profile found, create one
        if (error.message.includes("table") || error.message.includes("schema") || error.code === "PGRST116") {
          await createUserProfile(userId)
          return
        }
        return
      }

      console.log("[v0] Profile fetched successfully:", data)
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const createUserProfile = async (userId: string) => {
    try {
      console.log("[v0] Creating new profile for user:", userId)
      const basicProfile: UserProfile = {
        id: userId,
        email: user?.email || "",
        full_name: user?.user_metadata?.full_name || "",
        user_agent_limit: 10,
        status: "pending", // All new users start as pending
        role: "user",
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("user_profiles").insert([basicProfile]).select().single()

      if (error) {
        console.log("[v0] Profile creation error:", error)
        // If tables don't exist, use basic profile
        setProfile(basicProfile)
      } else {
        console.log("[v0] Profile created successfully:", data)
        setProfile(data)
      }
    } catch (error) {
      console.error("Error creating profile:", error)
      // Fallback to basic profile
      const basicProfile: UserProfile = {
        id: userId,
        email: user?.email || "",
        full_name: user?.user_metadata?.full_name || "",
        user_agent_limit: 10,
        status: "pending",
        role: "user",
        created_at: new Date().toISOString(),
      }
      setProfile(basicProfile)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
        },
      },
    })

    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/reset-password`,
    })

    return { data, error }
  }

  const signInWithMagicLink = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
      },
    })

    return { data, error }
  }

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    signInWithMagicLink,
    isAuthenticated: !!user,
    isApproved: profile?.status === "approved",
    isPending: profile?.status === "pending",
    isRejected: profile?.status === "rejected",
    isSuspended: profile?.status === "suspended",
    isAdmin: profile?.role === "admin" || profile?.role === "super_admin",
    canUseGenerator: profile?.status === "approved",
    needsApproval: profile?.status === "pending",
  }
}
