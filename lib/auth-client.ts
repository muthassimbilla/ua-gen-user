import { createBrowserClient } from "@supabase/ssr"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { DeviceFingerprint, IPDetection } from "./device-fingerprint"

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
  expires_at: string
  created_at: string
  last_accessed: string
  ip_address?: string
  user_agent?: string
  device_fingerprint?: string
  is_active?: boolean
  logout_reason?: string
}

export interface UserDevice {
  id: string
  user_id: string
  device_fingerprint: string
  device_name?: string
  browser_info?: string
  os_info?: string
  screen_resolution?: string
  timezone?: string
  language?: string
  first_seen: string
  last_seen: string
  is_trusted: boolean
  is_blocked: boolean
  total_logins: number
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
      const supabase = createBrowserSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required. Please add Supabase integration from project settings.")
      }

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
        throw new Error("This Telegram username is already in use")
      }

      // Hash password
      const passwordHash = await PasswordUtils.hashPassword(signupData.password)

      const { data: user, error } = await supabase
        .from("users")
        .insert({
          full_name: signupData.full_name,
          telegram_username: signupData.telegram_username,
          password_hash: passwordHash,
          is_approved: false, // New users need admin approval
          account_status: "active", // Account is active but not approved
          is_active: true,
        })
        .select("id, full_name, telegram_username, created_at, updated_at, is_approved, account_status, is_active")
        .single()

      if (error) {
        console.error("Signup error:", error)
        throw new Error("Failed to create account")
      }

      return user
    } catch (error: any) {
      console.error("[v0] Signup error:", error)

      if (error.message.includes("Supabase")) {
        throw new Error(error.message)
      }

      if (error.code === "23505") {
        throw new Error("This Telegram username is already in use")
      }

      throw new Error("Failed to create account. Please try again later.")
    }
  }

  static async login(credentials: LoginCredentials): Promise<{ user: User; sessionToken: string }> {
    try {
      const supabase = createBrowserSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required. Please add Supabase integration from project settings.")
      }

      console.log("[v0] Starting login process...")

      let deviceInfo
      let currentIP

      try {
        deviceInfo = await DeviceFingerprint.getDeviceInfo()
        console.log("[v0] Device fingerprint:", deviceInfo.fingerprint.substring(0, 8) + "...")
      } catch (error) {
        console.error("[v0] Device fingerprint error:", error)
        // Fallback device info
        deviceInfo = {
          fingerprint: "fallback-" + Date.now().toString(36),
          name: "Unknown Device",
          browser: "Unknown Browser",
          os: "Unknown OS",
          screenResolution: "1920x1080",
          timezone: "UTC",
          language: "en",
          userAgent: navigator.userAgent || "Unknown",
        }
      }

      try {
        currentIP = await IPDetection.getCurrentIP()
        console.log("[v0] Current IP:", currentIP)
      } catch (error) {
        console.error("[v0] IP detection error:", error)
        currentIP = "127.0.0.1" // Fallback IP
      }

      // Find user by telegram username
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_username", credentials.telegram_username)
        .single()

      if (userError || !user) {
        throw new Error("Invalid Telegram username or password")
      }

      if (!user.is_approved) {
        throw new Error("Your account has not been approved yet. Waiting for admin approval.")
      }

      // Verify password
      const isPasswordValid = await PasswordUtils.verifyPassword(credentials.password, user.password_hash)
      if (!isPasswordValid) {
        throw new Error("Invalid Telegram username or password")
      }

      console.log("[v0] User authenticated, checking device policy...")

      try {
        const { data: deviceAllowed, error: deviceCheckError } = await supabase.rpc("is_device_allowed", {
          p_user_id: user.id,
          p_device_fingerprint: deviceInfo.fingerprint,
        })

        if (deviceCheckError) {
          console.error("[v0] Device check error:", deviceCheckError)
        }

        if (!deviceAllowed) {
          console.log("[v0] Device not allowed, logging out other devices")

          // Logout all active sessions for this user
          const { error: logoutError } = await supabase
            .from("user_sessions")
            .update({
              is_active: false,
              logout_reason: "new_device_login",
            })
            .eq("user_id", user.id)
            .eq("is_active", true)

          if (logoutError) {
            console.error("[v0] Error logging out other devices:", logoutError)
          }
        }
      } catch (error) {
        console.error("[v0] Device policy check failed:", error)
        // Continue with login even if device check fails
      }

      try {
        const { error: deviceTrackError } = await supabase.rpc("track_device_login", {
          p_user_id: user.id,
          p_device_fingerprint: deviceInfo.fingerprint,
          p_device_name: deviceInfo.name,
          p_browser_info: deviceInfo.browser,
          p_os_info: deviceInfo.os,
          p_screen_resolution: deviceInfo.screenResolution,
          p_timezone: deviceInfo.timezone,
          p_language: deviceInfo.language,
        })

        if (deviceTrackError) {
          console.error("[v0] Device tracking error:", deviceTrackError)
        }
      } catch (error) {
        console.error("[v0] Device tracking failed:", error)
        // Continue with login even if device tracking fails
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
        user_agent: deviceInfo.userAgent,
        device_fingerprint: deviceInfo.fingerprint,
        is_active: true,
      })

      if (sessionError) {
        console.error("[v0] Session creation error:", sessionError)
        throw new Error("Failed to create session")
      }

      console.log("[v0] Session created successfully")

      if (currentIP && currentIP !== "127.0.0.1") {
        try {
          const ipInfo = await IPDetection.getIPInfo(currentIP)

          const { error: ipHistoryError } = await supabase.from("user_ip_history").insert({
            user_id: user.id,
            ip_address: currentIP,
            country: ipInfo?.country,
            city: ipInfo?.city,
            isp: ipInfo?.isp,
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
          // Continue even if IP tracking fails
        }
      }

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = user

      console.log("[v0] Login successful for user:", user.telegram_username)

      return {
        user: userWithoutPassword,
        sessionToken,
      }
    } catch (error: any) {
      console.error("[v0] Login error:", error)

      if (
        error.message.includes("Supabase") ||
        error.message.includes("Invalid Telegram") ||
        error.message.includes("approved")
      ) {
        throw error
      }

      throw new Error("Login failed. Please try again later.")
    }
  }

  static async logout(sessionToken: string): Promise<void> {
    try {
      const supabase = createBrowserSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required")
      }

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

      if (!supabase) {
        console.log("[v0] Supabase not configured")
        return null
      }

      const currentIP = await IPDetection.getCurrentIP()

      const { data: session, error: sessionError } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("session_token", sessionToken)
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .single()

      if (sessionError || !session) {
        console.log("[v0] Session not found or expired:", sessionError?.message)
        return null
      }

      if (currentIP && session.ip_address && currentIP !== session.ip_address) {
        // Skip IP change check for localhost/development environment
        const isLocalhost = currentIP === "::1" || currentIP === "127.0.0.1" || currentIP.startsWith("192.168.") || currentIP.startsWith("10.") || currentIP.startsWith("172.")
        const isOldLocalhost = session.ip_address === "::1" || session.ip_address === "127.0.0.1" || session.ip_address.startsWith("192.168.") || session.ip_address.startsWith("10.") || session.ip_address.startsWith("172.")
        
        if (isLocalhost || isOldLocalhost) {
          console.log("[v0] Skipping IP change check for localhost:", session.ip_address, "->", currentIP)
        } else {
          console.log("[v0] IP changed from", session.ip_address, "to", currentIP)

          // Logout due to IP change
          await supabase.rpc("logout_due_to_ip_change", {
            p_user_id: session.user_id,
            p_old_ip: session.ip_address,
            p_new_ip: currentIP,
          })

          console.log("[v0] Auto-logged out due to IP change")
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
      return await IPDetection.getCurrentIP()
    } catch (error) {
      console.error("[v0] Failed to get current IP:", error)
      return null
    }
  }

  static async getUserDevices(sessionToken: string): Promise<UserDevice[]> {
    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) return []

      const currentUser = await this.getCurrentUser(sessionToken)
      if (!currentUser) return []

      const { data: devices, error } = await supabase
        .from("user_devices")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("last_seen", { ascending: false })

      if (error) {
        console.error("Error fetching user devices:", error)
        return []
      }

      return devices || []
    } catch (error) {
      console.error("[v0] Error getting user devices:", error)
      return []
    }
  }

  static async logoutOtherDevices(sessionToken: string): Promise<boolean> {
    try {
      const supabase = createBrowserSupabaseClient()
      if (!supabase) return false

      const { data: session } = await supabase
        .from("user_sessions")
        .select("id, user_id")
        .eq("session_token", sessionToken)
        .eq("is_active", true)
        .single()

      if (!session) return false

      const { error } = await supabase.rpc("logout_other_devices", {
        p_user_id: session.user_id,
        p_current_session_id: session.id,
      })

      return !error
    } catch (error) {
      console.error("[v0] Error logging out other devices:", error)
      return false
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
