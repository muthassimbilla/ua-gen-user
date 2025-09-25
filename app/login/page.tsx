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
import { Eye, EyeOff, MessageCircle, Lock, CheckCircle, XCircle, LogIn, Clock, AlertTriangle, Sparkles, Shield, Zap } from "lucide-react"
import AuthThemeToggle from "@/components/auth-theme-toggle"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

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

  useEffect(() => {
    const message = searchParams.get("message")
    const reason = searchParams.get("reason")

    if (message) {
      setSuccessMessage(message)
    }

    if (reason === "ip_changed") {
      setIpChangeLogout(true)
    }
  }, [searchParams])

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

    try {
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        return
      }

      await login(formData.telegram_username.trim(), formData.password)

      // Wait a bit for the auth context to update
      await new Promise((resolve) => setTimeout(resolve, 100))
      
      const redirectTo = searchParams.get("redirect") || "/tool"
      router.push(redirectTo)
    } catch (error: any) {
      console.error("[v0] Login error:", error)

      if (error.message.includes("not been approved") || error.message.includes("Waiting for admin approval")) {
        setPendingApproval(true)
        setErrors(["Your account is pending approval. Please wait for admin approval before logging in."])
      } else {
        setErrors([error.message || "Login failed. Please try again."])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <AuthThemeToggle />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-32 left-16 w-2.5 h-2.5 bg-pink-400/60 rounded-full animate-bounce" style={{ animationDelay: "2.5s" }} />
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: "3s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Login Card */}
        <Card className="glass-card p-8 rounded-3xl shadow-2xl border-0 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10">
          {/* Header with Icon */}
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <Shield className="w-10 h-10 text-white relative z-10" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <Alert className="border-green-500/30 bg-green-500/10 backdrop-blur-sm rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <AlertDescription className="text-green-400 font-medium">{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* IP Change Alert */}
            {ipChangeLogout && (
              <Alert className="border-orange-500/30 bg-orange-500/10 backdrop-blur-sm rounded-xl">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <AlertDescription className="text-orange-600">
                  <div className="space-y-2">
                    <p className="font-semibold">Security Alert: IP Address Changed</p>
                    <p className="text-sm">You have been automatically logged out for security reasons. Please log in again.</p>
                    <p className="text-xs text-orange-500 font-medium">One Key can only be used on one device/IP.</p>
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
                      <li key={index} className="font-medium">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Info Alert */}
            <Alert className="border-blue-500/30 bg-blue-500/10 backdrop-blur-sm rounded-xl">
              <Zap className="h-5 w-5 text-blue-500" />
              <AlertDescription className="text-blue-600">
                <strong className="font-semibold">Note:</strong> New accounts require admin approval after registration.
              </AlertDescription>
            </Alert>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="telegram_username" className="text-sm font-semibold text-foreground flex items-center gap-2">
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
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground/70">
            © 2025 User Agent Generator. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
