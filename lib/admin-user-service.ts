import { createBrowserClient } from "@supabase/ssr"

export interface AdminUser {
  id: string
  full_name: string
  email: string
  telegram_username?: string
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
      console.log("[v0] getAllUsers called")
      const supabase = this.getSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase integration required. Please add Supabase integration from project settings.")
      }

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Supabase error:", error)
        throw new Error(`Failed to load user data: ${error.message}`)
      }

      console.log("[v0] Profiles fetched:", profiles?.length || 0)
      console.log("[v0] Profile data sample:", profiles?.[0]) // Debug log to see what data we're getting

      if (!profiles || profiles.length === 0) {
        console.log("[v0] No profiles found in database")
        return []
      }

      // Get unique IP counts and user agent data
      const usersWithDeviceCount = await Promise.all(
        profiles.map(async (profile) => {
          let uniqueIPCount = 0
          let userAgent = "Unknown"
          let lastLogin = null
          let userEmail = profile.email || "unknown@unknown.com" // Try profile email first
          let telegramUsername = undefined

          try {
            // Try to get email from Supabase Auth
            const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(profile.id)
            if (authError) {
              console.warn("[v0] Auth API error for user:", profile.id, authError.message)
              // Continue with profile email if auth fails
            } else if (authUser?.user?.email) {
              userEmail = authUser.user.email
              console.log("[v0] Email found in auth for user:", profile.id, userEmail)
            } else {
              console.warn("[v0] No email found in auth for user:", profile.id)
            }
            
            if (authUser?.user?.user_metadata?.telegram_username) {
              telegramUsername = authUser.user.user_metadata.telegram_username
            }

            // Count unique IP addresses for this user
            const { data: ipHistory, error: ipError } = await supabase
              .from("user_ip_history")
              .select("ip_address")
              .eq("user_id", profile.id)
              .eq("is_current", true)

            if (!ipError && ipHistory) {
              const uniqueIPs = new Set(ipHistory.map((ip) => ip.ip_address))
              uniqueIPCount = uniqueIPs.size
            }

            // Get latest user agent and last login from active sessions
            const { data: latestSession } = await supabase
              .from("user_sessions")
              .select("user_agent, last_accessed, created_at")
              .eq("user_id", profile.id)
              .eq("is_active", true)
              .gt("expires_at", new Date().toISOString())
              .order("last_accessed", { ascending: false })
              .limit(1)
              .single()

            if (latestSession) {
              userAgent = latestSession.user_agent || "Unknown"
              lastLogin = latestSession.last_accessed || latestSession.created_at
            }
          } catch (error) {
            console.error("[v0] Error getting additional data for user:", profile.id, error)
          }

          return {
            id: profile.id,
            full_name: profile.full_name,
            email: userEmail,
            telegram_username: telegramUsername,
            is_active: profile.is_active ?? true,
            is_approved: profile.is_approved ?? false,
            approved_at: profile.approved_at,
            approved_by: profile.approved_by,
            account_status: profile.account_status || "active",
            expiration_date: profile.expiration_date,
            current_status: this.calculateCurrentStatus(profile),
            created_at: profile.created_at,
            updated_at: profile.updated_at || profile.created_at,
            device_count: uniqueIPCount,
            user_agent: userAgent,
            last_login: lastLogin,
          }
        }),
      )

      console.log("[v0] Returning users:", usersWithDeviceCount.length)
      return usersWithDeviceCount
    } catch (error: any) {
      console.error("[v0] Error getting users:", error)
      throw error
    }
  }

  private static calculateCurrentStatus(user: any): "active" | "suspended" | "expired" | "inactive" | "pending" {
    if (!user.is_approved) return "pending"
    if (user.account_status === "suspended") return "suspended"
    if (user.expiration_date && new Date(user.expiration_date) < new Date()) return "expired"
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
        .from("profiles")
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
        .from("profiles")
        .update({
          is_approved: false,
          is_active: false,
          account_status: "inactive",
          approved_at: null,
          approved_by: null,
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

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_approved", false)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Get pending users error:", error)
        throw new Error("Failed to load pending users")
      }

      const usersWithEmail = await Promise.all(
        (profiles || []).map(async (profile) => {
          let userEmail = profile.email || "unknown@unknown.com" // Try profile email first
          try {
            const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(profile.id)
            if (authError) {
              console.warn("[v0] Auth API error for pending user:", profile.id, authError.message)
              // Continue with profile email if auth fails
            } else if (authUser?.user?.email) {
              userEmail = authUser.user.email
              console.log("[v0] Email found in auth for pending user:", profile.id, userEmail)
            } else {
              console.warn("[v0] No email found in auth for pending user:", profile.id)
            }
          } catch (error) {
            console.error("[v0] Error getting email for user:", profile.id, error)
          }
          
          return {
            id: profile.id,
            full_name: profile.full_name,
            email: userEmail,
            is_active: profile.is_active ?? true,
            is_approved: profile.is_approved ?? false,
            approved_at: profile.approved_at,
            approved_by: profile.approved_by,
            account_status: profile.account_status || "active",
            expiration_date: profile.expiration_date,
            current_status: this.calculateCurrentStatus(profile),
            created_at: profile.created_at,
            updated_at: profile.updated_at || profile.created_at,
          }
        })
      )
      
      return usersWithEmail
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
        .from("profiles")
        .update({
          full_name: userData.full_name,
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

      // Get email from auth
      let userEmail = "unknown@unknown.com"
      try {
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)
        if (authError) {
          console.warn("[v0] Auth API error when updating user:", userId, authError.message)
          // Try to get email from the updated profile data
          if (data.email) {
            userEmail = data.email
          }
        } else if (authUser?.user?.email) {
          userEmail = authUser.user.email
          console.log("[v0] Email found in auth when updating user:", userId, userEmail)
        } else if (data.email) {
          // Fallback to profile email
          userEmail = data.email
          console.warn("[v0] No email found in auth, using profile email for user:", userId)
        }
      } catch (error) {
        console.error("[v0] Error getting email for user:", userId, error)
        // Fallback to profile email if available
        if (data.email) {
          userEmail = data.email
        }
      }

      return {
        id: data.id,
        full_name: data.full_name,
        email: userEmail,
        telegram_username: userData.telegram_username,
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
        .from("profiles")
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
        .from("profiles")
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

      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", userId)
        .single()

      if (checkError) {
        console.error("[v0] Error checking user existence:", checkError)
        throw new Error("User not found")
      }

      console.log("[v0] User found before delete:", existingUser)

      // First delete related sessions
      const { error: sessionError } = await supabase.from("user_sessions").delete().eq("user_id", userId)

      if (sessionError) {
        console.warn("[v0] Warning deleting sessions:", sessionError)
      }

      const { data: deleteData, error } = await supabase.from("profiles").delete().eq("id", userId).select()

      console.log("[v0] Delete operation result:", { deleteData, error })

      if (error) {
        console.error("[v0] Delete user error:", error)
        throw new Error(`Failed to delete user: ${error.message}`)
      }

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

      const { data, error } = await supabase
        .from("profiles")
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
    email: string
    telegram_username?: string
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

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: Math.random().toString(36).slice(-12),
        options: {
          data: {
            full_name: userData.full_name,
            telegram_username: userData.telegram_username,
          },
        },
      })

      if (authError || !authData.user) {
        console.error("[v0] Auth signup error:", authError)
        throw new Error(`Failed to create auth user: ${authError?.message}`)
      }

      // Update the auto-created profile with additional data
      const { data, error } = await supabase
        .from("profiles")
        .update({
          is_active: userData.is_active ?? true,
          is_approved: userData.is_approved ?? true,
          account_status: userData.account_status ?? "active",
          expiration_date: userData.expiration_date,
          updated_at: new Date().toISOString(),
        })
        .eq("id", authData.user.id)
        .select()
        .single()

      if (error) {
        console.error("[v0] Create user error:", error)
        throw new Error(`Failed to create new user: ${error.message}`)
      }

      console.log("[v0] User created successfully:", data)

      return {
        id: data.id,
        full_name: data.full_name,
        email: userData.email,
        telegram_username: userData.telegram_username,
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

      if (data.status) {
        updateData.account_status = data.status
        console.log("[v0] Setting account_status to:", data.status)
      }

      if (data.expirationDate !== undefined) {
        updateData.expiration_date = data.expirationDate
        console.log("[v0] Setting expiration_date to:", data.expirationDate)
      }

      if (data.status === "active" || data.activateAccount) {
        updateData.is_active = true
        console.log("[v0] Setting is_active to true")
      }

      if (data.status === "suspended") {
        updateData.is_active = false
        console.log("[v0] Setting is_active to false due to suspension")
      }

      const { data: result, error } = await supabase
        .from("profiles")
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
