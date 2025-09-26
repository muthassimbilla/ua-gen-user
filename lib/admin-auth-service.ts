import type { Admin, AdminLoginCredentials } from "./admin-types"
import { supabase, isSupabaseAvailable } from "./supabase"
import bcrypt from "bcryptjs"

export class AdminAuthService {
  static async login(credentials: AdminLoginCredentials): Promise<{ admin: Admin; sessionToken: string }> {
    try {
      console.log("[v0] Admin login attempt for:", credentials.username)

      if (!isSupabaseAvailable()) {
        throw new Error("Admin system is not yet set up. Supabase integration and admin table are required.")
      }

      const { data: admin, error } = await supabase
        .from("admins")
        .select("*")
        .eq("username", credentials.username)
        .single()

      if (error || !admin) {
        console.log("[v0] Admin not found:", error?.message)
        throw new Error("Invalid username or password")
      }

      console.log("[v0] Admin found:", admin.username)
      console.log("[v0] Stored password hash:", admin.password_hash)
      console.log("[v0] Input password:", credentials.password)

      let isPasswordValid = false

      // First try bcrypt comparison
      try {
        isPasswordValid = await bcrypt.compare(credentials.password, admin.password_hash)
        console.log("[v0] Bcrypt comparison result:", isPasswordValid)
      } catch (bcryptError) {
        console.log("[v0] Bcrypt comparison failed:", bcryptError)
      }

      // If bcrypt fails, try plain text comparison (for debugging)
      if (!isPasswordValid && admin.password_hash === credentials.password) {
        isPasswordValid = true
        console.log("[v0] Plain text comparison successful")
      }

      if (!isPasswordValid) {
        console.log("[v0] Invalid password for admin:", credentials.username)
        throw new Error("Invalid username or password")
      }

      // Generate session token
      const sessionToken = `admin-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Store session in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_session_token", sessionToken)
        localStorage.setItem("admin_data", JSON.stringify(admin))
      }

      console.log("[v0] Admin login successful for:", admin.username)
      return { admin, sessionToken }
    } catch (error: any) {
      console.log("[v0] Admin login error:", error.message)
      throw new Error(error.message || "Login failed")
    }
  }

  static async logout(sessionToken: string): Promise<void> {
    console.log("[v0] Admin logout")
    // Clear localStorage session
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_session_token")
      localStorage.removeItem("admin_data")
    }
  }

  static async getCurrentAdmin(sessionToken?: string): Promise<Admin | null> {
    console.log("[v0] Getting current admin, token:", sessionToken ? "present" : "missing")

    // Check localStorage for session
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("admin_session_token")
      const storedAdmin = localStorage.getItem("admin_data")

      if (storedToken && storedAdmin && (sessionToken === storedToken || !sessionToken)) {
        try {
          const admin = JSON.parse(storedAdmin)
          console.log("[v0] Found admin in localStorage:", admin.username)
          return admin
        } catch (error) {
          console.log("[v0] Error parsing stored admin data")
          localStorage.removeItem("admin_session_token")
          localStorage.removeItem("admin_data")
        }
      }
    }

    console.log("[v0] No valid admin session found")
    return null
  }
}
