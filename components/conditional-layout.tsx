"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import LoadingOverlay from "@/components/loading-overlay"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  // Routes that don't need sidebar (auth pages, landing, premium-tools, and account-blocked)
  const authRoutes = ["/login", "/signup"]
  const noLayoutRoutes = ["/", "/premium-tools", "/account-blocked", "/adminbilla", "/adminbilla/login"]
  const isAuthRoute = authRoutes.includes(pathname)
  const isNoLayoutRoute = noLayoutRoutes.includes(pathname) || pathname.startsWith("/adminbilla")

  if (!isAuthRoute && loading) {
    return <LoadingOverlay message="Initializing UGen Pro" fullScreen />
  }

  if (isAuthRoute || isNoLayoutRoute) {
    return <>{children}</>
  }

  if (user) {
    return <DashboardLayout>{children}</DashboardLayout>
  }

  // If not authenticated and not on auth route, render without sidebar
  // (middleware will handle redirects)
  return <>{children}</>
}
