"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import SidebarNavigation from "@/components/sidebar-navigation"
import LoadingSpinner from "@/components/loading-spinner"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  // Routes that don't need sidebar (auth pages)
  const authRoutes = ["/login", "/signup"]
  const isAuthRoute = authRoutes.includes(pathname)

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />
  }

  // For auth routes, render without sidebar
  if (isAuthRoute) {
    return <>{children}</>
  }

  // For protected routes, render with sidebar if user is authenticated
  if (user) {
    return (
      <>
        <SidebarNavigation />
        <div className="lg:ml-64">{children}</div>
      </>
    )
  }

  // If not authenticated and not on auth route, render without sidebar
  // (middleware will handle redirects)
  return <>{children}</>
}
