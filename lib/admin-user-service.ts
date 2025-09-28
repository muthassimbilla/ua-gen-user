import { createBrowserClient } from "@supabase/ssr"

export interface AdminUser {
  id: string
  full_name: string
  telegram_username: string
  is_active: boolean
  is_approved: boolean
  approved_at?: string | null
  approved_by?: string | null
  account_status: "active" | "suspended" | "expired"
  expiration_date?: string | null
  current_status: "active" | "suspended" | "expired" | "inactive" | "pending"
  created_at: string
  updated_at: string
  device_count?: number
  user_agent?: string
  last_login?: string
}

export class AdminUserService {
  static async getAllUsers(): Promise<AdminUser[]> {
    try {
      const supabase = this.getSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required. Please add Supabase integration from project settings.")
      }

      // Get users from Supabase
      const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Supabase error:", error)
        throw new Error("Failed to load user data")
      }

      // Get unique IP counts and user agent data
      const usersWithDeviceCount = await Promise.all(
        users.map(async (user) => {
          let uniqueIPCount = 0
          let userAgent = "Unknown"
          let lastLogin = null

          try {
            // Count unique IP addresses for this user
            const { data: ipHistory, error: ipError } = await supabase
              .from("user_ip_history")
              .select("ip_address")
              .eq("user_id", user.id)
              .eq("is_current", true)

            if (!ipError && ipHistory) {
              // Count unique IP addresses
              const uniqueIPs = new Set(ipHistory.map(ip => ip.ip_address))
              uniqueIPCount = uniqueIPs.size
            }

            // Get latest user agent and last login from active sessions
            const { data: latestSession, error: sessionError } = await supabase
              .from("user_sessions")
              .select("user_agent, last_accessed, created_at")
              .eq("user_id", user.id)
              .eq("is_active", true)
              .gt("expires_at", new Date().toISOString())
              .order("last_accessed", { ascending: false })
              .limit(1)
              .single()

            if (!sessionError && latestSession) {
              userAgent = latestSession.user_agent || "Unknown"
              lastLogin = latestSession.last_accessed || latestSession.created_at
            }
          } catch (error) {
            console.error("[v0] Error getting additional data for user:", user.id, error)
          }

          return {
            id: user.id,
            full_name: user.full_name,
            telegram_username: user.telegram_username,
            is_active: user.is_active || true,
            is_approved: user.is_approved || false,
            approved_at: user.approved_at,
            approved_by: user.approved_by,
            account_status: user.account_status || "active",
            expiration_date: user.expiration_date,
            current_status: this.calculateCurrentStatus(user),
            created_at: user.created_at,
            updated_at: user.updated_at || user.created_at,
            device_count: uniqueIPCount,
            user_agent: userAgent,
            last_login: lastLogin,
          }
        }),
      )

      return usersWithDeviceCount
    } catch (error: any) {
      console.error("[v0] Error getting users:", error)
      throw error
    }
  }

  private static calculateCurrentStatus(user: any): "active" | "suspended" | "expired" | "inactive" | "pending" {
    console.log("[v0] Calculating status for user:", user.id, {
      is_approved: user.is_approved,
      account_status: user.account_status,
      is_active: user.is_active,
      expiration_date: user.expiration_date,
    })

    if (!user.is_approved) return "pending"
    if (user.account_status === "suspended") return "suspended"
    if (user.expiration_date && new Date(user.expiration_date) < new Date()) return "expired"
    // Fixed: Check is_active first, then account_status
    if (!user.is_active) return "inactive"
    if (user.account_status === "active") return "active"
    return "inactive"
  }

  static async approveUser(userId: string, adminUserId?: string): Promise<void> {
    try {
      const supabase = this.getSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required")
      }

      const { error } = await supabase
        .from("users")
        .update({
          is_approved: true,
          is_active: true,
          account_status: "active",
          approved_at: new Date().toISOString(),
          approved_by: adminUserId || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("[v0] Approve user error:", error)
        throw new Error("Failed to approve user")
      }

      console.log("[v0] User approved successfully:", userId)
    } catch (error: any) {
      console.error("[v0] Error approving user:", error)
      throw error
    }
  }

  static async rejectUser(userId: string, adminUserId?: string): Promise<void> {
    try {
      const supabase = this.getSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required")
      }

      const { error } = await supabase
        .from("users")
        .update({
          is_approved: false,
          is_active: false,
          account_status: "inactive",
          approved_at: null,
          approved_by: null,
          rejected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("[v0] Reject user error:", error)
        throw new Error("Failed to reject user")
      }

      console.log("[v0] User approval revoked successfully:", userId)
    } catch (error: any) {
      console.error("[v0] Error rejecting user:", error)
      throw error
    }
  }

  static async getPendingUsers(): Promise<AdminUser[]> {
    try {
      const supabase = this.getSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required")
      }

      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("is_approved", false)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Get pending users error:", error)
        throw new Error("Failed to load pending users")
      }

      return users.map((user) => ({
        id: user.id,
        full_name: user.full_name,
        telegram_username: user.telegram_username,
        is_active: user.is_active || true,
        is_approved: user.is_approved || false,
        approved_at: user.approved_at,
        approved_by: user.approved_by,
        account_status: user.account_status || "active",
        expiration_date: user.expiration_date,
        current_status: this.calculateCurrentStatus(user),
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
      }))
    } catch (error: any) {
      console.error("[v0] Error getting pending users:", error)
      throw error
    }
  }

  static async updateUser(userId: string, userData: Partial<AdminUser>): Promise<AdminUser> {
    console.log("[v0] Updating user:", userId, userData)

    const supabase = this.getSupabaseClient()

    if (!supabase) {
      throw new Error("Supabase integration required")
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          full_name: userData.full_name,
          telegram_username: userData.telegram_username,
          is_active: userData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single()

      if (error) {
        console.error("[v0] Update user error:", error)
        throw new Error("Failed to update user")
      }

      return {
        id: data.id,
        full_name: data.full_name,
        telegram_username: data.telegram_username,
        is_active: data.is_active,
        is_approved: data.is_approved || false,
        approved_at: data.approved_at,
        approved_by: data.approved_by,
        account_status: data.account_status || "active",
        expiration_date: data.expiration_date,
        current_status: this.calculateCurrentStatus(data),
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error: any) {
      console.error("[v0] Update user failed:", error)
      throw error
    }
  }

  static async updateUserExpiration(userId: string, expirationDate: string | null): Promise<void> {
    try {
      const supabase = this.getSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required")
      }

      const { error } = await supabase
        .from("users")
        .update({
          expiration_date: expirationDate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("[v0] Update expiration error:", error)
        throw new Error("Failed to update user expiration")
      }

      console.log("[v0] User expiration updated successfully:", userId, expirationDate)
    } catch (error: any) {
      console.error("[v0] Error updating user expiration:", error)
      throw error
    }
  }

  static async updateUserStatus(userId: string, status: "active" | "suspended"): Promise<void> {
    try {
      const supabase = this.getSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required")
      }

      const { error } = await supabase
        .from("users")
        .update({
          account_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("[v0] Update status error:", error)
        throw new Error("Failed to update user status")
      }

      console.log("[v0] User status updated successfully:", userId, status)
    } catch (error: any) {
      console.error("[v0] Error updating user status:", error)
      throw error
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      console.log("[v0] Starting delete operation for user:", userId)

      const supabase = this.getSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required")
      }

      // First check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("id", userId)
        .single()

      if (checkError) {
        console.error("[v0] Error checking user existence:", checkError)
        throw new Error("User not found")
      }

      console.log("[v0] User found before delete:", existingUser)

      // First delete related sessions to avoid foreign key constraints
      const { error: sessionError } = await supabase.from("sessions").delete().eq("user_id", userId)

      if (sessionError) {
        console.warn("[v0] Warning deleting sessions:", sessionError)
        // Continue with user deletion even if session deletion fails
      }

      // Then delete the user
      const { data: deleteData, error } = await supabase.from("users").delete().eq("id", userId).select()

      console.log("[v0] Delete operation result:", { deleteData, error })

      if (error) {
        console.error("[v0] Delete user error:", error)
        throw new Error(`Failed to delete user: ${error.message}`)
      }

      // Check if any rows were actually deleted
      if (!deleteData || deleteData.length === 0) {
        console.error("[v0] No rows were deleted")
        throw new Error("No user was deleted. This might be due to RLS policy or permission issues.")
      }

      console.log("[v0] User successfully deleted:", userId, "Deleted rows:", deleteData.length)
    } catch (error: any) {
      console.error("[v0] Delete user failed:", error)
      throw error
    }
  }

  static async toggleUserStatus(userId: string, isActive: boolean): Promise<void> {
    try {
      console.log("[v0] AdminUserService.toggleUserStatus called with:", { userId, isActive })

      const supabase = this.getSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required")
      }

      // Update user active status and account status in database
      const { data, error } = await supabase
        .from("users")
        .update({
          is_active: isActive,
          account_status: isActive ? "active" : "inactive",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select("id, is_active, full_name, account_status")

      if (error) {
        console.error("[v0] Toggle user status error:", error)
        throw new Error(`Failed to change user status: ${error.message}`)
      }

      console.log("[v0] Database update result:", data)

      if (!data || data.length === 0) {
        throw new Error("No user was updated. User may not exist.")
      }

      const updatedUser = data[0]
      console.log("[v0] User status successfully toggled:", {
        userId,
        newIsActive: updatedUser.is_active,
        accountStatus: updatedUser.account_status,
        fullName: updatedUser.full_name,
      })

      // Verify the update was successful
      if (updatedUser.is_active !== isActive) {
        throw new Error("Database update failed - status not changed")
      }
    } catch (error: any) {
      console.error("[v0] Toggle user status failed:", error)
      throw error
    }
  }

  static async createUser(userData: {
    full_name: string
    telegram_username: string
    is_active?: boolean
    is_approved?: boolean
    account_status?: "active" | "suspended"
    expiration_date?: string | null
  }): Promise<AdminUser> {
    try {
      console.log("[v0] Creating new user:", userData)

      const supabase = this.getSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required")
      }

      // Check if telegram username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("telegram_username")
        .eq("telegram_username", userData.telegram_username)
        .single()

      if (existingUser) {
        throw new Error("This Telegram username is already in use")
      }

      const defaultPassword = "defaultpass123" // This should be changed by user later
      const passwordHash = await this.hashPassword(defaultPassword)

      // Create new user
      const newUserData = {
        full_name: userData.full_name,
        telegram_username: userData.telegram_username,
        password_hash: passwordHash, // Added required password_hash field
        is_active: userData.is_active ?? true,
        is_approved: userData.is_approved ?? true, // Admin created users are auto-approved
        account_status: userData.account_status ?? "active",
        expiration_date: userData.expiration_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("users").insert(newUserData).select().single()

      if (error) {
        console.error("[v0] Create user error:", error)
        throw new Error(`Failed to create new user: ${error.message}`)
      }

      console.log("[v0] User created successfully:", data)

      return {
        id: data.id,
        full_name: data.full_name,
        telegram_username: data.telegram_username,
        is_active: data.is_active,
        is_approved: data.is_approved || false,
        approved_at: data.approved_at,
        approved_by: data.approved_by,
        account_status: data.account_status || "active",
        expiration_date: data.expiration_date,
        current_status: this.calculateCurrentStatus(data),
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error: any) {
      console.error("[v0] Create user failed:", error)
      throw error
    }
  }

  private static async hashPassword(password: string): Promise<string> {
    // Simple hash using Web Crypto API (for demo purposes)
    // In production, use a proper password hashing library like bcrypt
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  private static getSupabaseClient() {
    if (typeof window === "undefined") return null

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      return createBrowserClient(supabaseUrl, supabaseAnonKey)
    }

    return null
  }

  static async handleSecurityUpdate(
    userId: string,
    data: {
      status?: "active" | "suspended"
      expirationDate?: string | null
      activateAccount?: boolean
    },
  ): Promise<void> {
    try {
      console.log("[v0] AdminUserService.handleSecurityUpdate called with:", { userId, data })

      const supabase = this.getSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required")
      }

      const updateData: any = {
        updated_at: new Date().toISOString(),
      }

      // Update account status
      if (data.status) {
        updateData.account_status = data.status
        console.log("[v0] Setting account_status to:", data.status)
      }

      // Update expiration date
      if (data.expirationDate !== undefined) {
        updateData.expiration_date = data.expirationDate
        console.log("[v0] Setting expiration_date to:", data.expirationDate)
      }

      // If activating account, ensure is_active is true
      if (data.status === "active" || data.activateAccount) {
        updateData.is_active = true
        console.log("[v0] Setting is_active to true")
      }

      // If suspending account, set is_active to false
      if (data.status === "suspended") {
        updateData.is_active = false
        console.log("[v0] Setting is_active to false due to suspension")
      }

      const { data: result, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId)
        .select("id, is_active, account_status, expiration_date, full_name")

      if (error) {
        console.error("[v0] Security update error:", error)
        throw new Error(`Failed to update security settings: ${error.message}`)
      }

      console.log("[v0] Security update successful:", result)

      if (!result || result.length === 0) {
        throw new Error("No user was updated. User may not exist.")
      }

      const updatedUser = result[0]
      console.log("[v0] User security settings successfully updated:", {
        userId,
        newAccountStatus: updatedUser.account_status,
        newIsActive: updatedUser.is_active,
        newExpirationDate: updatedUser.expiration_date,
        fullName: updatedUser.full_name,
      })
    } catch (error: any) {
      console.error("[v0] Security update failed:", error)
      throw error
    }
  }
}
