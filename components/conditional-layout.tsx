"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import SidebarNavigation from "@/components/sidebar-navigation"
import TopNavigation from "@/components/top-navigation"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  // Routes that don't need sidebar (auth pages)
  const authRoutes = ["/login", "/signup"]
  const isAuthRoute = authRoutes.includes(pathname)

  // Show loading while checking authentication for non-auth routes
  if (!isAuthRoute && loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // For auth routes, render without sidebar and top nav
  if (isAuthRoute) {
    return <>{children}</>
  }

  // For protected routes, render with both sidebar and top nav if user is authenticated
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <SidebarNavigation />
        <TopNavigation />
        <div className="lg:ml-64 pt-16">{children}</div>
      </div>
    )
  }

  // If not authenticated and not on auth route, render without sidebar
  // (middleware will handle redirects)
  return <>{children}</>
}
