"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import LoadingSpinner from "@/components/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireApproved?: boolean
}

export function ProtectedRoute({ children, redirectTo = "/login", requireApproved = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
      return
    }

    if (!loading && user && requireApproved) {
      const isPending = !user.is_approved
      const isExpired = user.expiration_date && new Date(user.expiration_date) < new Date()
      const isSuspended = user.status === "suspended"

      if (isPending || isExpired || isSuspended) {
        router.push("/premium-tools")
        return
      }
    }
  }, [user, loading, router, redirectTo, requireApproved])

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!user) {
    return <LoadingSpinner />
  }

  if (requireApproved) {
    const isPending = !user.is_approved
    const isExpired = user.expiration_date && new Date(user.expiration_date) < new Date()
    const isSuspended = user.status === "suspended"

    if (isPending || isExpired || isSuspended) {
      return <LoadingSpinner />
    }
  }

  // User is authenticated and approved, render children
  return <>{children}</>
}

export default ProtectedRoute
