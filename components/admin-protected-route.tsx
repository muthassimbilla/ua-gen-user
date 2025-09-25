"use client"

import type React from "react"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { AdminNavigation } from "@/components/admin-navigation"

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAdminAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!admin) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <main className="ml-64 p-8">{children}</main>
    </div>
  )
}
