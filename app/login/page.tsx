"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import {
  Eye,
  EyeOff,
  MessageCircle,
  Lock,
  CheckCircle,
  XCircle,
  LogIn,
  Clock,
  AlertTriangle,
  Sparkles,
  Shield,
  Zap,
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
    telegram_username: "",
    password: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState("")
  const [pendingApproval, setPendingApproval] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [ipChangeLogout, setIpChangeLogout] = useState(false)
  const [sessionInvalidReason, setSessionInvalidReason] = useState(false)

  useEffect(() => {
    const message = searchParams.get("message")
    const reason = searchParams.get("reason")

    if (message) {
      setSuccessMessage(message)
    }

    if (reason === "ip_changed") {
      setIpChangeLogout(true)
    }

    if (reason === "session_invalid") {
      setSessionInvalidReason(true)
      // Clear the URL parameters to prevent interference with login
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete("reason")
      window.history.replaceState({}, "", newUrl.toString())
    }
  }, [searchParams])

  // Show no internet page if offline
  if (!isOnline) {
    return <NoInternet onRetry={retryConnection} isReconnecting={isReconnecting} />
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors.length > 0) {
      setErrors([])
      setPendingApproval(false)
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.telegram_username.trim()) {
      newErrors.push("Telegram username is required")
    }

    if (!formData.password.trim()) {
      newErrors.push("Password is required")
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    setSuccessMessage("")
    setPendingApproval(false)
    setSessionInvalidReason(false)

    try {
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        setLoading(false)
        return
      }

      // Add timeout to prevent infinite loading
      const loginTimeout = setTimeout(() => {
        setLoading(false)
        setErrors(["Login is taking longer than expected. Please try again."])
      }, 30000) // 30 second timeout

      try {
        // Optimize login process
        const loginPromise = login(formData.telegram_username.trim(), formData.password)
        const redirectTo = searchParams.get("redirect") || "/tool"

        // Start login and redirect simultaneously
        await loginPromise

        clearTimeout(loginTimeout)
        setTimeout(() => {
          router.push(redirectTo)
        }, 100)
      } catch (loginError) {
        clearTimeout(loginTimeout)
        throw loginError
      }
    } catch (error: any) {
      console.error("[v0] Login error:", error)

      console.log("[v0] Error message:", error.message)
      console.log("[v0] Error type:", typeof error.message)
      console.log("[v0] Error includes pending approval:", error.message?.includes("pending approval"))
      console.log("[v0] Full error object:", error)

      // Check for specific error messages (case insensitive)
      const errorMsg = error.message?.toLowerCase() || ""

      console.log("[v0] Checking error message:", errorMsg)
      console.log("[v0] Contains 'pending approval':", errorMsg.includes("pending approval"))
      console.log("[v0] Contains 'not been approved':", errorMsg.includes("not been approved"))
      console.log("[v0] Contains 'account is pending approval':", errorMsg.includes("account is pending approval"))

      if (
        errorMsg.includes("pending approval") ||
        errorMsg.includes("not been approved") ||
        errorMsg.includes("account is pending approval") ||
        errorMsg.includes("is pending approval") ||
        errorMsg.includes("waiting for admin approval") ||
        errorMsg.includes("requires admin approval")
      ) {
        console.log("[v0] Setting pending approval error")
        setPendingApproval(true)
        setErrors([]) // Clear other errors when showing pending approval
      } else if (errorMsg.includes("deactivated") || errorMsg.includes("account is deactivated")) {
        console.log("[v0] Setting deactivated error")
        setErrors(["Your account has been deactivated. Please contact support."])
      } else if (
        errorMsg.includes("invalid telegram") ||
        errorMsg.includes("invalid password") ||
        errorMsg.includes("invalid username") ||
        errorMsg.includes("invalid credentials")
      ) {
        console.log("[v0] Setting invalid credentials error")
        setErrors(["Invalid username or password. Please check your credentials and try again."])
      } else if (errorMsg.includes("database error") || errorMsg.includes("database")) {
        console.log("[v0] Setting database error")
        setErrors(["Database connection error. Please try again later."])
      } else if (errorMsg.includes("network error") || errorMsg.includes("connection")) {
        console.log("[v0] Setting network error")
        setErrors(["Network connection error. Please check your internet connection and try again."])
      } else {
        console.log("[v0] Setting generic error:", error.message)
        setErrors([error.message || "Login failed. Please try again."])
      }
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <AuthThemeToggle />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Floating Particles */}
        <div
          className="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-40 right-32 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-32 left-16 w-2.5 h-2.5 bg-pink-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-1 h-1 bg-cyan-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <Shield className="w-10 h-10 text-white relative z-10" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
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
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Main Login Card */}
            <Card className="glass-card p-6 rounded-3xl shadow-2xl border-0 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10">
              {/* Header */}
              <CardHeader className="text-center space-y-2 pb-4">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sign In
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Success Message */}
                {successMessage && (
                  <Alert className="border-green-500/30 bg-green-500/10 backdrop-blur-sm rounded-xl">
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
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* IP Change Alert */}
                {ipChangeLogout && (
                  <Alert className="border-orange-500/30 bg-orange-500/10 backdrop-blur-sm rounded-xl">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <AlertDescription className="text-orange-600">
                      <div className="space-y-2">
                        <p className="font-semibold">Security Alert: IP Address Changed</p>
                        <p className="text-sm">
                          Your session has expired due to IP address change. This is a security feature to protect your account.
                        </p>
                        <p className="text-xs text-orange-500 font-medium">
                          Please log in again to continue. Your account is secure.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Pending Approval Alert */}
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

                {/* Error Messages */}
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

                {/* Info Alert */}
                <Alert className="border-blue-500/30 bg-blue-500/10 backdrop-blur-sm rounded-xl">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <AlertDescription className="text-blue-600">
                    <strong className="font-semibold">Note:</strong> New accounts require admin approval after
                    registration.
                  </AlertDescription>
                </Alert>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="telegram_username"
                      className="text-sm font-semibold text-foreground flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Telegram Username
                    </Label>
                    <div className="relative group">
                      <Input
                        id="telegram_username"
                        name="telegram_username"
                        type="text"
                        placeholder="your_username"
                        value={formData.telegram_username}
                        onChange={handleInputChange}
                        className="h-12 pl-12 pr-4 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200 group-hover:border-blue-300/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                        required
                        autoComplete="username"
                      />
                      <MessageCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                    </div>
                    <p className="text-xs text-muted-foreground ml-1">Enter username without @ symbol</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-2">
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
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="h-5 w-5" />
                        Sign In
                      </div>
                    )}
                  </Button>
                </form>

                {/* Sign Up Link */}
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

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground/70">© 2025 User Agent Generator. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
