"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { AdminNavigation } from "@/components/admin-navigation"
import { useEffect } from "react"

interface AdminConditionalLayoutProps {
  children: React.ReactNode
}

export function AdminConditionalLayout({ children }: AdminConditionalLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { admin, isLoading } = useAdminAuth()

  // Routes that don't need navigation (login page)
  const authRoutes = ["/adminbilla/login"]
  const isAuthRoute = authRoutes.includes(pathname)

  useEffect(() => {
    // If not loading, not authenticated, and not on login page, redirect to login
    if (!isLoading && !admin && !isAuthRoute) {
      console.log("[v0] Unauthorized access detected, redirecting to login")
      router.push("/adminbilla/login")
    }
  }, [admin, isLoading, isAuthRoute, router])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center auth-container">
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <div className="text-lg text-foreground">Loading admin panel...</div>
          </div>
        </div>
      </div>
    )
  }

  // For login route, render without navigation
  if (isAuthRoute) {
    return <>{children}</>
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center auth-container">
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="text-lg text-foreground mb-4">Access Denied</div>
          <div className="text-sm text-muted-foreground mb-4">Admin login required to access this page</div>
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  // For protected routes, render with navigation if admin is authenticated
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 25%, hsl(var(--accent)) 50%, hsl(var(--muted)) 75%, hsl(var(--background)) 100%)",
        backgroundSize: "400% 400%",
      }}
    >
      <AdminNavigation />
      <main className="ml-0 lg:ml-64 p-4 lg:p-6 min-h-screen">
        <div className="w-full">{children}</div>
      </main>
    </div>
  )
}
