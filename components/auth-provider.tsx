"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  telegram_username: string
  full_name: string
  status: "pending" | "approved" | "blocked"
  current_ip?: string
  key_expires_at?: string
}

interface AuthContextType {
  user: User | null
  login: (telegram_username: string, key: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setLoading(false)
        return
      }

      // Verify token with backend
      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        localStorage.removeItem("auth_token")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("auth_token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (telegram_username: string, key: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telegram_username, key }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem("auth_token", data.token)
        setUser(data.user)
        return true
      } else {
        throw new Error(data.message || "Login failed")
      }
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
    router.push("/login")
  }

  // Redirect logic
  useEffect(() => {
    if (!loading) {
      const isAdminRoute = pathname.startsWith("/adminbilla")
      const isLoginRoute = pathname === "/login" || pathname === "/key-buy"
      const isToolsRoute = pathname === "/tools"

      if (isAdminRoute) {
        // Admin routes should show 404 for regular users
        router.push("/404")
        return
      }

      if (!user && !isLoginRoute && !isToolsRoute) {
        router.push("/login")
      } else if (user && user.status === "approved" && isLoginRoute) {
        router.push("/dashboard")
      } else if (user && user.status === "pending" && !isLoginRoute) {
        router.push("/key-buy")
      }
    }
  }, [user, loading, pathname, router])

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
