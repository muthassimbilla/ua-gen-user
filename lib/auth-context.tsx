"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "./auth-client"
import { AuthService } from "./auth-client"
import { useStatusMiddleware } from "./status-middleware"
import type { UserStatus } from "./user-status-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (telegram_username: string, password: string) => Promise<void>
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


  const getSessionToken = (): string | null => {
    if (typeof window === "undefined") return null
    try {
      return localStorage.getItem("session_token")
    } catch (error) {
      console.warn("[v0] Error accessing localStorage:", error)
      return null
    }
  }

  const setSessionToken = (token: string | null) => {
    if (typeof window === "undefined") return

    try {
      if (token) {
        localStorage.setItem("session_token", token)

        // Set cookie with proper domain and security settings for multi-tab support
        const domain = window.location.hostname === 'localhost' ? 'localhost' : `.${window.location.hostname}`
        const cookieValue = `session_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax; domain=${domain}`
        document.cookie = cookieValue

        console.log("[v0] Session token set:", token.substring(0, 10) + "...")

        // Notify other tabs about session change
        window.dispatchEvent(new CustomEvent('sessionUpdated', { detail: { token } }))
      } else {
        localStorage.removeItem("session_token")
        const domain = window.location.hostname === 'localhost' ? 'localhost' : `.${window.location.hostname}`
        document.cookie = `session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain}`
        console.log("[v0] Session token cleared")

        // Notify other tabs about session clear
        window.dispatchEvent(new CustomEvent('sessionUpdated', { detail: { token: null } }))
      }
    } catch (error) {
      console.warn("[v0] Error setting session token:", error)
    }
  }

  const checkAuth = async () => {
    // Don't check auth if login is in progress
    if (isLoginInProgress) {
      console.log("[v0] Login in progress, skipping auth check")
      return
    }

    try {
      console.log("[v0] Starting auth check...")
      setLoading(true)

      const sessionToken = getSessionToken()
      if (!sessionToken) {
        console.log("[v0] No session token found")
        setUser(null)
        setLoading(false)
        return
      }

      console.log("[v0] Session token found, checking user...")
      const currentUser = await AuthService.getCurrentUser(sessionToken)
      if (currentUser) {
        console.log("[v0] User authenticated:", currentUser.telegram_username)
        setUser(currentUser)
      } else {
        console.log("[v0] Session invalid, clearing...")
        setUser(null)
        setSessionToken(null)
        // Clear any cached session data (Vercel optimized)
        if (typeof window !== "undefined") {
          localStorage.removeItem("session_token")
          localStorage.removeItem("current_user")
          document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=" + window.location.hostname
          document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        }
      }
    } catch (error) {
      console.error("[v0] Auth check failed:", error)
      setUser(null)
      setSessionToken(null)
      // Clear any cached session data on error (Vercel optimized)
      if (typeof window !== "undefined") {
        localStorage.removeItem("session_token")
        localStorage.removeItem("current_user")
        document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=" + window.location.hostname
        document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (telegram_username: string, password: string) => {
    try {
      console.log("[v0] Starting login for:", telegram_username)
      
      // Immediate UI feedback - no freeze
      setIsLoginInProgress(true)
      setLoading(true)

      // Use requestAnimationFrame to ensure UI updates before heavy operations
      return new Promise<void>((resolve, reject) => {
        requestAnimationFrame(async () => {
          try {
            // Add timeout to prevent infinite loading (reduced for faster feedback)
            const loginTimeout = setTimeout(() => {
              console.error("[v0] Login timeout - taking too long")
              setLoading(false)
              setIsLoginInProgress(false)
              reject(new Error("Login is taking longer than expected. Please try again."))
            }, 10000) // 10 second timeout

            try {
              const { user: loggedInUser, sessionToken } = await AuthService.login({
                telegram_username,
                password,
              })

              clearTimeout(loginTimeout)
              console.log("[v0] Login successful, setting user and token")

              setSessionToken(sessionToken)
              setUser(loggedInUser)

              // Remove unnecessary delay for faster login
              console.log("[v0] User and session set successfully")
              resolve()
            } catch (loginError) {
              clearTimeout(loginTimeout)
              reject(loginError)
            }
          } catch (error) {
            console.error("[v0] Login failed:", error)
            reject(error)
          } finally {
            setLoading(false)
            setIsLoginInProgress(false)
          }
        })
      })
    } catch (error) {
      console.error("[v0] Login failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const sessionToken = getSessionToken()
      if (sessionToken) {
        await AuthService.logout(sessionToken)
      }

      setUser(null)
      setUserStatus(null)
      setSessionToken(null)

      // Notify all tabs about logout
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('sessionUpdated', { detail: { token: null } }))
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("[v0] Logout failed:", error)
      setUser(null)
      setUserStatus(null)
      setSessionToken(null)

      // Notify all tabs about logout even on error
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('sessionUpdated', { detail: { token: null } }))
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

    // Status invalid - user will be redirected

    // Only trigger logout for actual account issues, not network problems
    if (
      status.status === "suspended" ||
      status.status === "expired" ||
      (status.status === "inactive" && !status.message.includes("network") && !status.message.includes("status check"))
    ) {
      console.log("[v0] Account suspended/expired, logging out")
      // Wait a bit before logout to let user see the notification
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
        // Status invalid - user will be redirected
      }
    }
    return status
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        checkAuth()

        // Listen for session updates from other tabs
        const handleSessionUpdate = (event: CustomEvent) => {
          const { token } = event.detail
          console.log("[v0] Session updated from another tab:", token ? "login" : "logout")
          
          if (token) {
            // Another tab logged in, refresh current tab
            checkAuth()
          } else {
            // Another tab logged out, clear current tab
            setUser(null)
            setUserStatus(null)
            setSessionToken(null)
          }
        }

        // Listen for storage changes (localStorage sync)
        const handleStorageChange = (event: StorageEvent) => {
          if (event.key === 'session_token') {
            console.log("[v0] Session token changed in localStorage")
            checkAuth()
          }
        }

        window.addEventListener('sessionUpdated', handleSessionUpdate as EventListener)
        window.addEventListener('storage', handleStorageChange)

        return () => {
          window.removeEventListener('sessionUpdated', handleSessionUpdate as EventListener)
          window.removeEventListener('storage', handleStorageChange)
        }
      } catch (error) {
        console.warn("[v0] Error in auth useEffect:", error)
      }
    }
  }, [])

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
