"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { AdminNavigation } from "@/components/admin-navigation"
import { useEffect } from "react"
import LoadingOverlay from "@/components/loading-overlay"

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
    if (!isLoading && !admin && !isAuthRoute) {
      console.log("[v0] Not authenticated, redirecting to login")
      router.push("/adminbilla/login")
    }
  }, [admin, isLoading, isAuthRoute, router])

  if (isLoading) {
    return <LoadingOverlay message="অ্যাডমিন প্যানেল লোড হচ্ছে..." fullScreen />
  }

  // For login route, render without navigation
  if (isAuthRoute) {
    return <>{children}</>
  }

  if (!admin) {
    return <LoadingOverlay message="লগইন পেজে রিডাইরেক্ট হচ্ছে..." fullScreen />
  }

  // For protected routes, render with navigation if admin is authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AdminNavigation />
      <main className="ml-0 lg:ml-64 p-2 lg:p-4 min-h-screen">
        <div className="w-full max-w-none">{children}</div>
      </main>
    </div>
  )
}
