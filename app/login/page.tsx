"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import ClientOnly from "@/components/client-only"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { getClientFlashMessage, clearClientFlashMessage, type FlashMessage } from "@/lib/flash-messages"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  XCircle,
  LogIn,
  Clock,
  AlertTriangle,
  Sparkles,
  Shield,
} from "lucide-react"
import AuthThemeToggle from "@/components/auth-theme-toggle"
import { useNetwork } from "@/contexts/network-context"
import NoInternet from "@/components/no-internet"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { isOnline, retryConnection, isReconnecting } = useNetwork()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null)
  const [pendingApproval, setPendingApproval] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [ipChangeLogout, setIpChangeLogout] = useState(false)
  const [sessionInvalidReason, setSessionInvalidReason] = useState(false)

  const clearSessionData = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("session_token")
        localStorage.removeItem("current_user")

        document.cookie =
          "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=" + window.location.hostname
        document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

        setTimeout(() => {
          window.location.reload()
        }, 100)
      }
      console.log("[v0] Session data cleared for Vercel")
    } catch (error) {
      console.error("[v0] Error clearing session data:", error)
    }
  }

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      if (errors.length > 0) {
        setErrors([])
        setPendingApproval(false)
      }
    },
    [errors.length],
  )

  const validateForm = useCallback(() => {
    const newErrors: string[] = []

    if (!formData.email.trim()) {
      newErrors.push("Email is required")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push("Please enter a valid email address")
    }

    if (!formData.password.trim()) {
      newErrors.push("Password is required")
    }

    return newErrors
  }, [formData.email, formData.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)
    setLoading(true)
    setErrors([])
    setSuccessMessage("")
    setPendingApproval(false)

    try {
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        return
      }

      const loginTimeout = setTimeout(() => {
        console.error("[v0] Login timeout")
        setLoading(false)
        setIsSubmitting(false)
        setErrors(["Login is taking longer than expected. Please try again."])
      }, 10000)

      try {
        await login(formData.email.trim(), formData.password)

        clearTimeout(loginTimeout)

        const redirectTo = searchParams.get("redirect") || "/tool"
        setTimeout(() => {
          router.push(redirectTo)
        }, 100)
      } catch (loginError) {
        clearTimeout(loginTimeout)
        throw loginError
      }
    } catch (error: any) {
      console.error("[v0] Login error:", error)

      const errorMsg = error.message?.toLowerCase() || ""

      if (errorMsg.includes("deactivated")) {
        setErrors(["Your account has been deactivated. Please contact support."])
      } else if (errorMsg.includes("suspended")) {
        setErrors(["Your account suspended by admin"])
      } else if (errorMsg.includes("invalid") || errorMsg.includes("credentials")) {
        setErrors(["Invalid email or password. Please check your credentials and try again."])
      } else if (errorMsg.includes("email not confirmed")) {
        setErrors(["Please verify your email address before logging in. Check your inbox for the verification link."])
      } else {
        setErrors([error.message || "Login failed. Please try again."])
      }
    } finally {
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const message = searchParams.get("message")
    const reason = searchParams.get("reason")
    const success = searchParams.get("success")

    const flash = getClientFlashMessage()
    if (flash) {
      setFlashMessage(flash)
      clearClientFlashMessage()
      setTimeout(() => {
        setShowSuccessMessage(true)
      }, 100)
      return
    }

    if (message) {
      setSuccessMessage(message)
      setTimeout(() => {
        setShowSuccessMessage(true)
      }, 100)
    } else if (success === "signup") {
      setSuccessMessage("Account created successfully! Please check your email to verify your account.")
      setTimeout(() => {
        setShowSuccessMessage(true)
      }, 100)
    }

    if (reason === "ip_changed") {
      setIpChangeLogout(true)
    }

    if (reason === "session_invalid") {
      setSessionInvalidReason(true)
      clearSessionData()

      if (typeof window !== "undefined") {
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete("reason")
        newUrl.searchParams.delete("message")
        window.history.replaceState({}, "", newUrl.toString())

        setTimeout(() => {
          console.log("[v0] Vercel session cleanup completed")
        }, 50)
      }
    }
  }, [searchParams])

  if (!isOnline) {
    return <NoInternet onRetry={retryConnection} isReconnecting={isReconnecting} />
  }

  return (
    <ClientOnly>
      <div className="h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 page-enter">
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 text-blue-600 dark:text-blue-400 hover:bg-white/20 dark:hover:bg-gray-800/30 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md group"
          >
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Go back</span>
          </Link>
        </div>

        <div className="absolute top-6 right-6 z-20">
          <div className="relative group">
            <AuthThemeToggle />
            <div className="absolute -bottom-12 right-0 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Toggle theme
            </div>
          </div>
        </div>

        {/* Simplified Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/30 to-orange-500/30 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="hidden lg:block space-y-8">
              <div className="space-y-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <img
                    src="/logo.jpg"
                    alt="UGen Pro Logo"
                    className="w-full h-full object-cover rounded-2xl relative z-10"
                  />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-xl text-muted-foreground">
                  Sign in to your account to continue your journey with our powerful tools and services.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-muted-foreground">Fast and secure authentication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-muted-foreground">Your data is always protected</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-muted-foreground">Modern and intuitive interface</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto lg:mx-0">
              <Card className="glass-card p-6 rounded-3xl shadow-2xl border-0 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10">
                <CardHeader className="text-center space-y-2 pb-4">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Sign In
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {flashMessage && (
                    <Alert
                      className={`border-green-500/30 bg-green-500/10 backdrop-blur-sm rounded-xl transition-all duration-500 ease-out ${
                        showSuccessMessage ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                      }`}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <AlertDescription className="text-green-400 font-medium">{flashMessage.message}</AlertDescription>
                    </Alert>
                  )}

                  {successMessage && !flashMessage && (
                    <Alert
                      className={`border-green-500/30 bg-green-500/10 backdrop-blur-sm rounded-xl transition-all duration-500 ease-out ${
                        showSuccessMessage ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                      }`}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <AlertDescription className="text-green-400 font-medium">{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  {sessionInvalidReason && (
                    <Alert className="border-orange-500/30 bg-orange-500/10 backdrop-blur-sm rounded-xl">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <AlertDescription className="text-orange-600">
                        <div className="space-y-2">
                          <p className="font-semibold">Session Expired</p>
                          <p className="text-sm">Your previous session has expired. Please log in again to continue.</p>
                          <p className="text-xs text-orange-500 font-medium">
                            Session data has been cleared for security.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {ipChangeLogout && (
                    <Alert className="border-orange-500/30 bg-orange-500/10 backdrop-blur-sm rounded-xl">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <AlertDescription className="text-orange-600">
                        <div className="space-y-2">
                          <p className="font-semibold">Security Alert: IP Address Changed</p>
                          <p className="text-sm">
                            Your session has expired due to IP address change. This is a security feature to protect
                            your account.
                          </p>
                          <p className="text-xs text-orange-500 font-medium">
                            Please log in again to continue. Your account is secure.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {pendingApproval && (
                    <Alert className="border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm rounded-xl">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <AlertDescription className="text-yellow-600">
                        <div className="space-y-2">
                          <p className="font-semibold">Account Pending Approval</p>
                          <p className="text-sm">
                            Your account has been created successfully but is still waiting for admin approval.
                          </p>
                          <p className="text-xs text-yellow-500 font-medium">
                            Approval is usually granted within 24 hours. Please be patient.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {errors.length > 0 && !pendingApproval && (
                    <Alert variant="destructive" className="backdrop-blur-sm rounded-xl">
                      <XCircle className="h-5 w-5" />
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1">
                          {errors.map((error, index) => (
                            <li key={index} className="font-medium">
                              {error}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <div className="relative group">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="h-12 pl-12 pr-4 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200 group-hover:border-blue-300/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                          required
                          autoComplete="email"
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="password"
                        className="text-sm font-semibold text-foreground flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Password
                      </Label>
                      <div className="relative group">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="h-12 pl-12 pr-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200 group-hover:border-blue-300/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                          required
                          autoComplete="current-password"
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-blue-500 transition-colors p-1 rounded-md hover:bg-blue-50/50 dark:hover:bg-blue-900/30"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className="text-right">
                        <Link
                          href="/forgot-password"
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden active:scale-[0.98] active:shadow-md"
                      disabled={loading || isSubmitting}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin spinner h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <LogIn className="h-5 w-5" />
                          Sign In
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">
                      New user?{" "}
                      <Link
                        href="/signup"
                        className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 hover:underline"
                      >
                        Create Account
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center mt-4">
                <p className="text-xs text-muted-foreground/70">© 2025 UGen Pro. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  )
}
