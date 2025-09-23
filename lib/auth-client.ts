import { createBrowserClient } from "@supabase/ssr"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

// Types for our authentication system
export interface User {
  id: string
  full_name: string
  telegram_username: string
  created_at: string
  updated_at: string
}

export interface UserSession {
  id: string
  user_id: string
  session_token: string
  expires_at: string
  created_at: string
  last_accessed: string
  ip_address?: string
  user_agent?: string
}

export interface LoginCredentials {
  telegram_username: string
  password: string
}

export interface SignupData {
  full_name: string
  telegram_username: string
  password: string
}

// Function to validate environment variables
function validateEnvironment(): { isValid: boolean; error?: string } {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || supabaseUrl === "https://your-project.supabase.co") {
    return {
      isValid: false,
      error: "Supabase URL কনফিগার করা হয়নি। প্রজেক্ট সেটিংস থেকে Supabase integration যোগ করুন।",
    }
  }

  if (!supabaseKey || supabaseKey === "your-anon-key") {
    return {
      isValid: false,
      error: "Supabase API Key কনফিগার করা হয়নি। প্রজেক্ট সেটিংস থেকে Supabase integration যোগ করুন।",
    }
  }

  return { isValid: true }
}

// Create browser client for client-side operations
export function createBrowserSupabaseClient() {
  const validation = validateEnvironment()
  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Password hashing utilities
export class PasswordUtils {
  private static readonly SALT_ROUNDS = 12

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS)
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে")
    }

    if (!/[A-Za-z]/.test(password)) {
      errors.push("পাসওয়ার্ডে কমপক্ষে একটি ইংরেজি অক্ষর থাকতে হবে")
    }

    if (!/[0-9]/.test(password)) {
      errors.push("পাসওয়ার্ডে কমপক্ষে একটি সংখ্যা থাকতে হবে")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

// Client-side authentication service
export class AuthService {
  static async signup(signupData: SignupData): Promise<User> {
    try {
      const supabase = createBrowserSupabaseClient()

      // Validate password
      const passwordValidation = PasswordUtils.validatePassword(signupData.password)
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(", "))
      }

      // Check if telegram username already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("telegram_username")
        .eq("telegram_username", signupData.telegram_username)
        .single()

      if (existingUser) {
        throw new Error("এই টেলিগ্রাম ইউজারনেম ইতিমধ্যে ব্যবহৃত হয়েছে")
      }

      // Hash password
      const passwordHash = await PasswordUtils.hashPassword(signupData.password)

      // Create user
      const { data: user, error } = await supabase
        .from("users")
        .insert({
          full_name: signupData.full_name,
          telegram_username: signupData.telegram_username,
          password_hash: passwordHash,
        })
        .select("id, full_name, telegram_username, created_at, updated_at")
        .single()

      if (error) {
        console.error("Signup error:", error)
        throw new Error("অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে")
      }

      return user
    } catch (error: any) {
      console.error("[v0] Signup error:", error)

      if (error.message.includes("Supabase")) {
        throw new Error(error.message)
      }

      if (error.code === "23505") {
        throw new Error("এই টেলিগ্রাম ইউজারনেম ইতিমধ্যে ব্যবহৃত হয়েছে")
      }

      throw new Error("অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।")
    }
  }

  static async login(credentials: LoginCredentials): Promise<{ user: User; sessionToken: string }> {
    try {
      const supabase = createBrowserSupabaseClient()

      // Find user by telegram username
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_username", credentials.telegram_username)
        .single()

      if (userError || !user) {
        throw new Error("ভুল টেলিগ্রাম ইউজারনেম অথবা পাসওয়ার্ড")
      }

      // Verify password
      const isPasswordValid = await PasswordUtils.verifyPassword(credentials.password, user.password_hash)
      if (!isPasswordValid) {
        throw new Error("ভুল টেলিগ্রাম ইউজারনেম অথবা পাসওয়ার্ড")
      }

      // Generate session token
      const sessionToken = uuidv4() + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).substr(2)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      // Create session
      const { error: sessionError } = await supabase.from("user_sessions").insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      })

      if (sessionError) {
        console.error("Session creation error:", sessionError)
        throw new Error("সেশন তৈরি করতে সমস্যা হয়েছে")
      }

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = user

      return {
        user: userWithoutPassword,
        sessionToken,
      }
    } catch (error: any) {
      console.error("[v0] Login error:", error)

      if (error.message.includes("Supabase")) {
        throw new Error(error.message)
      }

      throw new Error("লগইন করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।")
    }
  }

  static async logout(sessionToken: string): Promise<void> {
    try {
      const supabase = createBrowserSupabaseClient()

      const { error } = await supabase.from("user_sessions").delete().eq("session_token", sessionToken)

      if (error) {
        console.error("Logout error:", error)
      }
    } catch (error: any) {
      console.error("[v0] Logout error:", error)
      // Don't throw error for logout, just log it
    }
  }

  static async getCurrentUser(sessionToken?: string): Promise<User | null> {
    if (!sessionToken) {
      console.log("[v0] No session token provided")
      return null
    }

    try {
      console.log("[v0] Checking session for token:", sessionToken.substring(0, 10) + "...")
      const supabase = createBrowserSupabaseClient()

      const { data: session, error: sessionError } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("session_token", sessionToken)
        .gt("expires_at", new Date().toISOString())
        .single()

      if (sessionError || !session) {
        console.log("[v0] Session not found or expired:", sessionError?.message)
        return null
      }

      console.log("[v0] Session found, fetching user:", session.user_id)

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, full_name, telegram_username, created_at, updated_at")
        .eq("id", session.user_id)
        .single()

      if (userError || !user) {
        console.log("[v0] User not found:", userError?.message)
        return null
      }

      console.log("[v0] User found:", user.telegram_username)

      // Update last accessed time
      await supabase.from("user_sessions").update({ last_accessed: new Date().toISOString() }).eq("id", session.id)

      return user
    } catch (error: any) {
      console.error("[v0] Get current user error:", error)
      return null
    }
  }
}

// Validation utilities
export class ValidationUtils {
  static validateTelegramUsername(username: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!username || username.trim().length === 0) {
      errors.push("টেলিগ্রাম ইউজারনেম প্রয়োজন")
      return { isValid: false, errors }
    }

    const trimmedUsername = username.trim()

    if (trimmedUsername.length < 3) {
      errors.push("টেলিগ্রাম ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে")
    }

    if (trimmedUsername.length > 32) {
      errors.push("টেলিগ্রাম ইউজারনেম সর্বোচ্চ ৩২ অক্ষরের হতে পারে")
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      errors.push("টেলিগ্রাম ইউজারনেমে শুধুমাত্র ইংরেজি অক্ষর, সংখ্যা এবং আন্ডারস্কোর (_) ব্যবহার করা যাবে")
    }

    if (trimmedUsername.startsWith("_") || trimmedUsername.endsWith("_")) {
      errors.push("টেলিগ্রাম ইউজারনেম আন্ডারস্কোর (_) দিয়ে শুরু বা শেষ হতে পারে না")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateFullName(name: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!name || name.trim().length === 0) {
      errors.push("পূর্ণ নাম প্রয়োজন")
      return { isValid: false, errors }
    }

    const trimmedName = name.trim()

    if (trimmedName.length < 2) {
      errors.push("পূর্ণ নাম কমপক্ষে ২ অক্ষরের হতে হবে")
    }

    if (trimmedName.length > 100) {
      errors.push("পূর্ণ নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারে")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
