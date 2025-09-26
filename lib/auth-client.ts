import { createBrowserClient } from "@supabase/ssr"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

// Function to validate environment variables
function validateEnvironment(): { isValid: boolean; error?: string } {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (
    !supabaseUrl ||
    supabaseUrl === "https://your-project.supabase.co" ||
    !supabaseKey ||
    supabaseKey === "your-anon-key"
  ) {
    console.warn("[v0] Supabase not configured, running in demo mode")
    return { isValid: false, error: "Demo mode - Supabase integration required for full functionality" }
  }

  return { isValid: true }
}

let supabaseInstance: any = null

export function createBrowserSupabaseClient() {
  if (typeof window === "undefined") return null // Server-side rendering guard

  if (supabaseInstance) return supabaseInstance

  const validation = validateEnvironment()
  if (!validation.isValid) {
    // Return null for demo purposes
    return null
  }

  supabaseInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  return supabaseInstance
}

// Types for our authentication system
export interface User {
  id: string
  full_name: string
  telegram_username: string
  created_at: string
  updated_at: string
  is_approved: boolean
  account_status: string
  is_active: boolean
}

export interface UserSession {
  id: string
  user_id: string
  session_token: string
  ip_address?: string
  user_agent?: string
  expires_at: string
  created_at: string
  last_accessed?: string
  is_active?: boolean
  logout_reason?: string
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

// Password utilities
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
      errors.push("Password must be at least 8 characters long")
    }

    if (!/[A-Za-z]/.test(password)) {
      errors.push("Password must contain at least one English letter")
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number")
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
      console.log("[v0] Starting signup process...")
      console.log("[v0] Signup data:", {
        full_name: signupData.full_name,
        telegram_username: signupData.telegram_username,
        password_length: signupData.password.length,
      })

      const supabase = createBrowserSupabaseClient()

      if (!supabase) {
        console.error("[v0] Supabase client not available")
        throw new Error("Supabase integration required. Please add Supabase integration from project settings.")
      }

      console.log("[v0] Supabase client created successfully")

      // Check if user already exists
      console.log("[v0] Checking if user already exists...")
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("telegram_username", signupData.telegram_username)
        .single()

      console.log("[v0] User check result:", { existingUser, checkError })

      if (checkError && checkError.code !== "PGRST116") {
        console.error("[v0] User check error:", checkError)
        throw new Error(`Failed to check user existence: ${checkError.message}`)
      }

      if (existingUser) {
        console.log("[v0] User already exists")
        throw new Error("User with this Telegram username already exists")
      }

      // Hash password
      console.log("[v0] Hashing password...")
      const hashedPassword = await PasswordUtils.hashPassword(signupData.password)
      console.log("[v0] Password hashed successfully")

      // Create user
      console.log("[v0] Creating user in database...")
      const userData = {
        full_name: signupData.full_name,
        telegram_username: signupData.telegram_username,
        password_hash: hashedPassword,
        is_approved: false, // Require admin approval
        account_status: "active", // Use existing enum value
        is_active: true,
      }

      console.log("[v0] User data to insert:", { ...userData, password_hash: "[HIDDEN]" })

      const { data: user, error: userError } = await supabase.from("users").insert(userData).select().single()

      console.log("[v0] User creation result:", { user, userError })

      if (userError) {
        console.error("[v0] User creation error:", userError)
        throw new Error(`Database error: ${userError.message} (Code: ${userError.code})`)
      }

      if (!user) {
        console.error("[v0] No user returned from database")
        throw new Error("No user data returned from database")
      }

      console.log("[v0] User created successfully:", user.telegram_username)
      return user
    } catch (error: any) {
      console.error("[v0] Signup error:", error)

      if (error.message.includes("Supabase")) {
        throw new Error(error.message)
      }

      if (error.code === "23505") {
        throw new Error("This Telegram username is already in use")
      }

      if (error.message.includes("Database error")) {
        throw new Error(error.message)
      }

      throw new Error(`Failed to create account: ${error.message}`)
    }
  }

  static async login(credentials: LoginCredentials): Promise<{ user: User; sessionToken: string }> {
    try {
      console.log("[v0] Starting login process...")
      console.log("[v0] Login credentials:", {
        telegram_username: credentials.telegram_username,
        password_length: credentials.password.length,
      })

      const supabase = createBrowserSupabaseClient()

      if (!supabase) {
        console.error("[v0] Supabase client not available")
        throw new Error("Supabase integration required. Please add Supabase integration from project settings.")
      }

      console.log("[v0] Supabase client created successfully")

      // Get user by telegram username
      console.log("[v0] Looking up user by telegram username...")
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, full_name, telegram_username, password_hash, is_approved, account_status, is_active")
        .eq("telegram_username", credentials.telegram_username)
        .single()

      console.log("[v0] User lookup result:", {
        user: user
          ? {
              id: user.id,
              telegram_username: user.telegram_username,
              is_active: user.is_active,
              is_approved: user.is_approved,
            }
          : null,
        userError,
      })

      if (userError) {
        console.error("[v0] User lookup error:", userError)
        if (userError.code === "PGRST116") {
          throw new Error("Invalid Telegram username or password")
        }
        throw new Error(`Database error: ${userError.message}`)
      }

      if (!user) {
        console.error("[v0] No user found")
        throw new Error("Invalid Telegram username or password")
      }

      if (!user.is_active) {
        console.error("[v0] Account is deactivated")
        throw new Error("Account is deactivated")
      }

      if (!user.is_approved) {
        console.error("[v0] Account is not approved")
        throw new Error(
          "Account Pending Approval - Your account has been created successfully but is still waiting for admin approval. You will be able to login once approved. Approval is usually granted within 24 hours. Please be patient.",
        )
      }

      // Verify password
      console.log("[v0] Verifying password...")
      const isPasswordValid = await PasswordUtils.verifyPassword(credentials.password, user.password_hash)
      console.log("[v0] Password verification result:", isPasswordValid)

      if (!isPasswordValid) {
        console.error("[v0] Invalid password")
        throw new Error("Invalid Telegram username or password")
      }

      console.log("[v0] User authenticated, implementing IP-only security...")

      // Get current IP
      let currentIP: string | null = null
      try {
        currentIP = await this.getUserCurrentIP()
        console.log("[v0] Current IP:", currentIP)
      } catch (error) {
        console.error("[v0] IP detection error:", error)
        currentIP = "unknown"
      }

      // IP-based security: logout all other sessions when IP changes
      try {
        if (currentIP) {
          // Check if this IP is different from any active session
          const { data: activeSessions, error: sessionError } = await supabase
            .from("user_sessions")
            .select("ip_address")
            .eq("user_id", user.id)
            .eq("is_active", true)

          if (!sessionError && activeSessions && activeSessions.length > 0) {
            const hasDifferentIP = activeSessions.some(
              (session: any) => session.ip_address && session.ip_address !== currentIP,
            )

            if (hasDifferentIP) {
              console.log("[v0] IP change detected, logging out other sessions")

              // Logout all other sessions (keep only current IP)
              const { error: logoutError } = await supabase
                .from("user_sessions")
                .update({
                  is_active: false,
                  logout_reason: "ip_changed",
                })
                .eq("user_id", user.id)
                .eq("is_active", true)
                .neq("ip_address", currentIP)

              if (logoutError) {
                console.error("[v0] Error logging out other IPs:", logoutError)
              }
            }
          }
        }
      } catch (error) {
        console.error("[v0] IP security check failed:", error)
        // Continue with login even if IP check fails
      }

      // Generate session token
      const sessionToken = uuidv4() + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).substr(2)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      console.log("[v0] Creating session...")

      const { error: sessionError } = await supabase.from("user_sessions").insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        ip_address: currentIP,
        user_agent: navigator.userAgent || "Unknown",
        is_active: true,
      })

      if (sessionError) {
        console.error("[v0] Session creation error:", sessionError)
        throw new Error("Failed to create session")
      }

      console.log("[v0] Session created successfully")

      if (currentIP && currentIP !== "127.0.0.1") {
        try {
          const { error: ipHistoryError } = await supabase.from("user_ip_history").insert({
            user_id: user.id,
            ip_address: currentIP,
            is_current: true,
          })

          if (ipHistoryError) {
            console.error("[v0] IP history tracking error:", ipHistoryError)
          }

          // Mark other IPs as not current
          await supabase
            .from("user_ip_history")
            .update({ is_current: false })
            .eq("user_id", user.id)
            .neq("ip_address", currentIP)
        } catch (error) {
          console.error("[v0] IP tracking failed:", error)
        }
      }

      // Store session token
      localStorage.setItem("session_token", sessionToken)

      console.log("[v0] Login successful for user:", user.telegram_username)

      return { user, sessionToken }
    } catch (error: any) {
      console.error("[v0] Login error:", error)

      // Pass through specific error messages
      if (
        error.message.includes("Supabase") ||
        error.message.includes("Invalid Telegram") ||
        error.message.includes("approved") ||
        error.message.includes("Pending Approval") ||
        error.message.includes("deactivated") ||
        error.message.includes("Database error")
      ) {
        throw error
      }

      // Generic fallback error
      throw new Error("Login failed. Please try again later.")
    }
  }

  static async logout(sessionToken?: string): Promise<void> {
    try {
      const token = sessionToken || localStorage.getItem("session_token")
      if (!token) return

      const supabase = createBrowserSupabaseClient()

      if (!supabase) {
        console.warn("[v0] Supabase not available for logout")
        return
      }

      // Deactivate session
      const { error } = await supabase
        .from("user_sessions")
        .update({ is_active: false, logout_reason: "user_logout" })
        .eq("session_token", token)

      if (error) {
        console.error("[v0] Logout error:", error)
      }

      // Remove from localStorage
      localStorage.removeItem("session_token")
      console.log("[v0] Logout successful")
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  static async getCurrentUser(sessionToken?: string): Promise<User | null> {
    try {
      const token = sessionToken || localStorage.getItem("session_token")
      if (!token) {
        console.log("[v0] No session token found")
        return null
      }

      const supabase = createBrowserSupabaseClient()

      if (!supabase) {
        console.log("[v0] Supabase not configured")
        return null
      }

      // Get session
      const { data: session, error: sessionError } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("session_token", token)
        .eq("is_active", true)
        .single()

      if (sessionError || !session) {
        console.log("[v0] Session not found or invalid")
        return null
      }

      // Check if session is expired
      if (new Date(session.expires_at) < new Date()) {
        console.log("[v0] Session expired")
        await this.logout(token)
        return null
      }

      const currentIP = await this.getUserCurrentIP()

      if (currentIP && session.ip_address && currentIP !== session.ip_address) {
        // Skip IP change check for localhost/development environment
        const isLocalhost =
          currentIP === "::1" ||
          currentIP === "127.0.0.1" ||
          currentIP.startsWith("192.168.") ||
          currentIP.startsWith("10.") ||
          currentIP.startsWith("172.")
        const isOldLocalhost =
          session.ip_address === "::1" ||
          session.ip_address === "127.0.0.1" ||
          session.ip_address.startsWith("192.168.") ||
          session.ip_address.startsWith("10.") ||
          session.ip_address.startsWith("172.")

        if (isLocalhost || isOldLocalhost) {
          console.log("[v0] Skipping IP change check for localhost:", session.ip_address, "->", currentIP)
        } else {
          console.log("[v0] IP address changed from", session.ip_address, "to", currentIP)

          // Logout due to IP change - this is the correct behavior
          await supabase.rpc("logout_due_to_ip_change", {
            p_user_id: session.user_id,
            p_old_ip: session.ip_address,
            p_new_ip: currentIP,
          })

          console.log("[v0] Session expired due to IP address change")
          return null
        }
      }

      console.log("[v0] Session found, fetching user:", session.user_id)

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, full_name, telegram_username, created_at, updated_at, is_approved, account_status, is_active")
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

  static async getUserCurrentIP(): Promise<string | null> {
    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error("[v0] IP detection error:", error)
      return null
    }
  }
}

// Validation utilities
export class ValidationUtils {
  static validateTelegramUsername(username: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!username || username.trim().length === 0) {
      errors.push("Telegram username is required")
      return { isValid: false, errors }
    }

    const trimmedUsername = username.trim()

    if (trimmedUsername.length < 3) {
      errors.push("Telegram username must be at least 3 characters long")
    }

    if (trimmedUsername.length > 32) {
      errors.push("Telegram username can be at most 32 characters long")
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      errors.push("Telegram username can only contain English letters, numbers and underscores (_)")
    }

    if (trimmedUsername.startsWith("_") || trimmedUsername.endsWith("_")) {
      errors.push("Telegram username cannot start or end with underscore (_)")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateFullName(name: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!name || name.trim().length === 0) {
      errors.push("Full name is required")
      return { isValid: false, errors }
    }

    const trimmedName = name.trim()

    if (trimmedName.length < 2) {
      errors.push("Full name must be at least 2 characters long")
    }

    if (trimmedName.length > 100) {
      errors.push("Full name can be at most 100 characters long")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
