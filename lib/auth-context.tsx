"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "./auth-client"
import { AuthService } from "./auth-client"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (telegram_username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Get session token from localStorage
  const getSessionToken = (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("session_token")
  }

  const setSessionToken = (token: string | null) => {
    if (typeof window === "undefined") return

    if (token) {
      localStorage.setItem("session_token", token)
      // Set cookie for middleware access
      document.cookie = `session_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`
    } else {
      localStorage.removeItem("session_token")
      // Remove cookie
      document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  }

  // Check authentication status
  const checkAuth = async () => {
    try {
      console.log("[v0] Starting auth check...")
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
        // Session is invalid, clear it
        setUser(null)
        setSessionToken(null)
      }
    } catch (error) {
      console.error("[v0] Auth check failed:", error)
      setUser(null)
      setSessionToken(null)
    } finally {
      setLoading(false)
    }
  }

  // Login function
  const login = async (telegram_username: string, password: string) => {
    try {
      const { user: loggedInUser, sessionToken } = await AuthService.login({
        telegram_username,
        password,
      })

      setUser(loggedInUser)
      setSessionToken(sessionToken)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    try {
      const sessionToken = getSessionToken()
      if (sessionToken) {
        await AuthService.logout(sessionToken)
      }

      setUser(null)
      setSessionToken(null)
    } catch (error) {
      console.error("[v0] Logout failed:", error)
      // Still clear local state even if server logout fails
      setUser(null)
      setSessionToken(null)
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    await checkAuth()
  }

  useEffect(() => {
    // Sync session token from cookies to localStorage if needed
    if (typeof window !== "undefined") {
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_token="))
        ?.split("=")[1]

      const localToken = localStorage.getItem("session_token")

      if (cookieToken && !localToken) {
        localStorage.setItem("session_token", cookieToken)
      } else if (!cookieToken && localToken) {
        // Cookie expired but localStorage still has token, clear it
        localStorage.removeItem("session_token")
      }
    }

    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
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
