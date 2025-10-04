"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useTransition } from "react"
import type { User } from "./auth-client"
import { AuthService } from "./auth-client"
import { useStatusMiddleware } from "./status-middleware"
import { useStatusNotification } from "@/components/status-notification-provider"
import type { UserStatus } from "./user-status-service"
import { StatusChecker } from "./status-checker"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  userStatus: UserStatus | null
  checkUserStatus: () => Promise<UserStatus | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null)
  const [isLoginInProgress, setIsLoginInProgress] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [initialCheckComplete, setInitialCheckComplete] = useState(false)

  const { showNotification } = useStatusNotification()

  const checkAuth = async () => {
    if (isLoginInProgress) {
      console.log("[v0] Login in progress, skipping auth check")
      return
    }

    try {
      console.log("[v0] Starting auth check...")
      setLoading(true)

      const currentUser = await AuthService.getCurrentUser()
      if (currentUser) {
        console.log("[v0] User authenticated:", currentUser.email)
        setUser(currentUser)
      } else {
        console.log("[v0] No authenticated user")
        setUser(null)
      }
    } catch (error) {
      console.error("[v0] Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
      setInitialCheckComplete(true)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log("[v0] Starting login for:", email)

      setIsLoginInProgress(true)
      setLoading(true)

      const { user: loggedInUser, userStatus } = await AuthService.login({
        email,
        password,
      })

      console.log("[v0] Login successful with status:", userStatus)

      startTransition(() => {
        setUser(loggedInUser)
        setUserStatus(userStatus)
      })

      console.log("[v0] User set successfully")
    } catch (error) {
      console.error("[v0] Login failed:", error)
      throw error
    } finally {
      setLoading(false)
      setIsLoginInProgress(false)
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()

      setUser(null)
      setUserStatus(null)

      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("[v0] Logout failed:", error)
      setUser(null)
      setUserStatus(null)

      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  const handleStatusInvalid = async (status: UserStatus) => {
    console.log("[v0] User status invalid:", status.message)
    setUserStatus(status)

    showNotification(status)

    if (
      status.status === "suspended" ||
      status.status === "expired" ||
      status.status === "inactive" ||
      status.status === "deactivated"
    ) {
      console.log("[v0] Account deactivated/suspended/expired, logging out")
      setTimeout(async () => {
        await logout()
      }, 2000)
    } else {
      console.log("[v0] Network/temporary issue, not logging out")
    }
  }

  const { checkStatus } = useStatusMiddleware(user?.id || null, handleStatusInvalid)

  const checkUserStatus = async (): Promise<UserStatus | null> => {
    const status = await checkStatus()
    if (status) {
      setUserStatus(status)

      if (!status.is_valid) {
        showNotification(status)
      }
    }
    return status
  }

  useEffect(() => {
    if (typeof window !== "undefined" && !initialCheckComplete) {
      try {
        checkAuth()
      } catch (error) {
        console.warn("[v0] Error in auth useEffect:", error)
      }
    }
  }, [initialCheckComplete])

  useEffect(() => {
    if (user && !loading) {
      console.log("[v0] Starting status checking for user:", user.id)
      const statusChecker = StatusChecker.getInstance()
      statusChecker.startChecking(30000) // Check every 30 seconds

      return () => {
        console.log("[v0] Stopping status checking")
        statusChecker.stopChecking()
      }
    }
  }, [user, loading])

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    userStatus,
    checkUserStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
