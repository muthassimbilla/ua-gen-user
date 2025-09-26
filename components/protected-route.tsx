"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import LoadingSpinner from "@/components/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!user) {
    return <LoadingSpinner />
  }

  // User is authenticated, render children
  return <>{children}</>
}

export default ProtectedRoute
