"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { setClientFlashMessage } from "@/lib/flash-messages"
import LoadingSpinner from "@/components/loading-spinner"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("[v0] Handling auth callback...")
        
        const supabase = createClient()
        
        // Get the session from URL hash
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("[v0] Auth callback error:", error)
          setError(error.message)
          setLoading(false)
          return
        }

        if (data.session) {
          console.log("[v0] User authenticated successfully")
          
          // Check if this is an email confirmation or password reset
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user?.email_confirmed_at) {
            console.log("[v0] Email confirmed, redirecting to login page")
            
            // Set success message
            setClientFlashMessage(
              "success",
              "Email confirmed successfully! Please login to access your account."
            )
            
            // Redirect to login page
            setTimeout(() => {
              router.push("/login?message=Email confirmed successfully! Please login to access your account.")
            }, 1000)
          } else {
            console.log("[v0] User not confirmed, redirecting to login")
            router.push("/login?message=Please verify your email before logging in.")
          }
        } else {
          // Check if this is a password reset (no session but has access token)
          const accessToken = searchParams.get("access_token")
          const refreshToken = searchParams.get("refresh_token")
          
          if (accessToken && refreshToken) {
            console.log("[v0] Password reset detected, redirecting to reset password page")
            
            // Store tokens for password reset
            if (typeof window !== "undefined") {
              localStorage.setItem("supabase.auth.token", JSON.stringify({
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_at: Date.now() + 3600000 // 1 hour
              }))
            }
            
            // Redirect to reset password page
            setTimeout(() => {
              router.push("/reset-password")
            }, 1000)
          } else {
            console.log("[v0] No session found, redirecting to login")
            router.push("/login?message=Authentication failed. Please try again.")
          }
        }
      } catch (error: any) {
        console.error("[v0] Auth callback failed:", error)
        setError(error.message || "Authentication failed")
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Verifying your email...
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Please wait while we confirm your email address. You will be redirected to login page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Verification Failed
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {error}
            </p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return null
}
